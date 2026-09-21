/* eslint-disable @typescript-eslint/no-require-imports */
// Exercise the actual TypeScript services over HTTP without a browser, database,
// production credentials, or additional test dependencies.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  if (!file.endsWith('.ts')) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = (id) => id.startsWith('.') ? load(path.resolve(path.dirname(file), id)) :
    id.startsWith('@/') ? load(path.join(root, id.slice(2))) : require(id);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const storage = new Map();
global.window = Object.assign(new EventTarget(), {
  sessionStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});

let refreshStatus = 200;
let usersStatus = 200;
let refreshCount = 0;
let rejectAdmin = false;
let duringRefresh;
const requests = [];
const server = http.createServer(async (req, res) => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};
  requests.push({ path: req.url, authorization: req.headers.authorization, body });
  const send = (status, data, message = 'Test response') => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: status === 200, message, data }));
  };
  if (req.url === '/api/admin/login') {
    if (body.password !== ' secret with spaces ') return send(401, null, 'Invalid admin email or password');
    return send(200, { user: { admin: !rejectAdmin }, accessToken: 'valid', refreshToken: 'refresh' });
  }
  if (req.url === '/api/auth/refresh-token') {
    refreshCount++;
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (duringRefresh) duringRefresh();
    return send(refreshStatus, { accessToken: 'valid', refreshToken: 'refresh' });
  }
  if (['/api/admin/forgot-password', '/api/admin/verify-otp', '/api/admin/reset-password'].includes(req.url)) return send(200, null);
  if (req.headers.authorization !== 'Bearer valid') return send(401, null, 'Access token has expired');
  if (req.url === '/api/auth/me') return send(200, { admin: true });
  if (req.url === '/api/auth/logout') return send(200, { refreshTokenRevoked: true });
  if (req.url === '/api/admin/users') return send(usersStatus, [{ _id: 'user-1', email: 'user@example.com' }]);
  if (req.url === '/api/admin/users/user-1') return send(200, { _id: 'user-1', email: 'user@example.com' });
  return send(404);
});

(async () => {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  process.env.NEXT_PUBLIC_API_URL = ` http://127.0.0.1:${server.address().port}/api/ `;
  const { authService } = load(path.join(root, 'services/api/authService.ts'));
  const { userService } = load(path.join(root, 'services/api/userService.ts'));
  const { apiClient } = load(path.join(root, 'services/api/apiClient.ts'));
  const { getSession, saveSession, clearSession } = load(path.join(root, 'services/api/session.ts'));
  const expired = () => saveSession({ accessToken: 'expired', refreshToken: 'refresh' });
  try {
    storage.set('auth_token', 'legacy');
    storage.set('isAdminAuthenticated', 'true');
    assert.equal(getSession(), null, 'Legacy flags must not authorize dashboard access');
    await assert.rejects(authService.login('admin@example.com', 'wrong'), /Invalid admin email or password/);
    assert.equal(getSession(), null);
    rejectAdmin = true;
    await assert.rejects(authService.login('admin@example.com', ' secret with spaces '), /administrator access/);
    rejectAdmin = false;
    await authService.login(' ADMIN@EXAMPLE.COM ', ' secret with spaces ');
    assert.deepEqual(getSession(), { accessToken: 'valid', refreshToken: 'refresh' });
    assert.equal(requests.at(-1).body.email, 'admin@example.com');
    assert.equal(requests.at(-1).authorization, undefined);
    assert.equal((await authService.getCurrentAdmin()).admin, true);
    assert.equal((await userService.getAllUsers())[0].name, '', 'Missing MongoDB names must not break search');
    assert.equal(requests.at(-1).authorization, 'Bearer valid');
    assert.equal((await userService.getUserById('user-1'))._id, 'user-1');

    expired();
    const beforeRefresh = refreshCount;
    await Promise.all([userService.getAllUsers(), userService.getAllUsers(), authService.getCurrentAdmin()]);
    assert.equal(refreshCount - beforeRefresh, 1, 'Concurrent 401s must share one refresh');
    assert.equal(getSession().accessToken, 'valid');
    const refresh = requests.find((r) => r.path === '/api/auth/refresh-token');
    assert.equal(refresh.authorization, undefined);
    assert.equal(refresh.body.refreshToken, 'refresh');

    usersStatus = 403;
    const beforeForbidden = refreshCount;
    await assert.rejects(userService.getAllUsers(), (error) => error.response.status === 403);
    assert.equal(refreshCount, beforeForbidden, 'Forbidden is not token expiry');
    assert.ok(getSession());
    usersStatus = 401;
    await assert.rejects(userService.getAllUsers());
    assert.equal(refreshCount, beforeForbidden + 1, 'Retry at most once');
    assert.equal(getSession(), null);
    usersStatus = 200;

    expired();
    refreshStatus = 401;
    await assert.rejects(userService.getAllUsers());
    assert.equal(getSession(), null, 'Revoked refresh must end the session');
    expired();
    refreshStatus = 503;
    await assert.rejects(userService.getAllUsers());
    assert.ok(getSession(), 'Temporary backend failure must remain retryable');
    refreshStatus = 200;
    duringRefresh = clearSession;
    await assert.rejects(userService.getAllUsers());
    assert.equal(getSession(), null, 'Late refresh must not resurrect logout');
    duringRefresh = undefined;

    await authService.login('admin@example.com', ' secret with spaces ');
    await authService.requestPasswordReset('admin@example.com');
    await authService.verifyPasswordResetOtp('admin@example.com', '123456');
    await authService.resetPassword('admin@example.com', '123456', 'NewPassword123');
    for (const request of requests.filter((r) => /forgot-password|verify-otp|reset-password/.test(r.path))) {
      assert.equal(request.authorization, undefined, 'Recovery is public');
    }
    assert.equal(requests.at(-1).body.newPassword, 'NewPassword123');
    await authService.logout();
    assert.equal(requests.at(-1).path, '/api/auth/logout');
    assert.equal(requests.at(-1).body.refreshToken, 'refresh');
    assert.equal(getSession(), null);
    assert.equal(apiClient.defaults.baseURL, process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, ''));
    console.log('Frontend auth checks passed: login, role validation, Bearer users/details, concurrent refresh, bounded retries, revocation, transient failures, logout race, recovery and logout.');
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
