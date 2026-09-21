/* eslint-disable @typescript-eslint/no-require-imports */
// Exercise real store factories with deferred API responses, without a live backend.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
const userService = {};
const newsService = {};
function load(file) {
  if (!file.endsWith('.ts')) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = (id) => {
    if (id === '@/services/api/userService') return { userService };
    if (id === '@/services/api/newsService') return { newsService };
    if (id.startsWith('@/')) return load(path.join(root, id.slice(2)));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const user = (id) => ({ _id: id, name: id, email: `${id}@example.com`, isEmailVerified: true });

(async () => {
  const { createAppStores } = load(path.join(root, 'lib/store.ts'));
  const stores = createAppStores();
  const users = stores.users;
  const news = stores.news;
  const theme = stores.theme;

  let calls = 0;
  let pending = deferred();
  userService.getAllUsers = () => { calls++; return pending.promise; };
  const first = users.getState().fetchUsers();
  await users.getState().fetchUsers();
  assert.equal(calls, 1, 'Pending list requests must be deduplicated');
  pending.resolve([user('one'), user('two')]);
  await first;
  await users.getState().fetchUsers();
  assert.equal(calls, 1, 'Navigation should use the fresh cache');
  await users.getState().fetchUsers(true);
  assert.equal(calls, 2, 'Refresh must bypass the cache');
  assert.equal(createAppStores().users.getState().users.length, 0, 'Provider instances must be isolated');

  users.getState().setCurrentPage(3);
  users.getState().setSearchQuery('one');
  assert.equal(users.getState().currentPage, 1);
  users.getState().setCurrentPage(3);
  users.getState().setSortOption('verified');
  assert.equal(users.getState().currentPage, 1);
  users.getState().setPageSize(25);
  assert.equal(users.getState().searchQuery, 'one');

  const detailsOne = deferred(), detailsTwo = deferred();
  userService.getUserById = (id) => id === 'one' ? detailsOne.promise : detailsTwo.promise;
  const oldDetails = users.getState().fetchUserById('one');
  const newDetails = users.getState().fetchUserById('two');
  detailsTwo.resolve(user('two'));
  await newDetails;
  detailsOne.resolve(user('one'));
  await oldDetails;
  assert.equal(users.getState().selectedUser._id, 'two', 'Late details must not replace the current selection');
  const closedDetails = deferred();
  userService.getUserById = () => closedDetails.promise;
  const afterClose = users.getState().fetchUserById('one');
  users.getState().clearSelectedUser();
  closedDetails.resolve(user('one'));
  await afterClose;
  assert.equal(users.getState().selectedUser, null, 'Closing a modal must invalidate its response');
  userService.getUserById = async () => { throw new Error('Detail failed'); };
  await users.getState().fetchUserById('one');
  assert.equal(users.getState().detailsError, 'Detail failed');
  assert.equal(users.getState().error, null, 'Detail failure must not replace the list error');

  userService.softDeleteUser = async () => { throw new Error('Deletion failed'); };
  await assert.rejects(users.getState().softDeleteUser('one'), /Deletion failed/);
  assert.equal(users.getState().users.length, 2, 'Failed deletion must retain the row');
  assert.equal(users.getState().deletingUserId, null);
  userService.softDeleteUser = async () => {};
  pending = deferred();
  const staleList = users.getState().fetchUsers(true);
  assert.equal(await users.getState().softDeleteUser('one'), true);
  pending.resolve([user('one'), user('two')]);
  await staleList;
  assert.deepEqual(users.getState().users.map((item) => item._id), ['two'], 'Old lists must not undo a deletion');
  userService.permanentlyDeleteUser = async () => {};
  assert.equal(await users.getState().permanentlyDeleteUser('two'), true);
  assert.equal(users.getState().users.length, 0);

  pending = deferred();
  const oldSessionList = users.getState().fetchUsers(true);
  const lateDelete = deferred();
  userService.softDeleteUser = () => lateDelete.promise;
  const oldSessionDelete = users.getState().softDeleteUser('one');
  users.getState().resetUsers();
  userService.getAllUsers = async () => [user('new-session')];
  await users.getState().fetchUsers();
  pending.resolve([user('old-session')]);
  lateDelete.resolve();
  await oldSessionList;
  assert.equal(await oldSessionDelete, false);
  assert.deepEqual(users.getState().users.map((item) => item._id), ['new-session']);
  assert.equal(users.getState().searchQuery, '');
  assert.equal(users.getState().pageSize, 10);

  let newsCalls = 0;
  const newsPending = deferred();
  const feeds = { indianNews: { data: [{ uuid: 'indian' }] }, globalNews: { data: [{ uuid: 'global' }] } };
  newsService.getAllNews = () => { newsCalls++; return newsPending.promise; };
  const newsRequest = news.getState().fetchAllNews();
  await news.getState().fetchAllNews();
  assert.equal(newsCalls, 1);
  newsPending.resolve(feeds);
  await newsRequest;
  news.getState().setSelectedNewsType('global');
  news.getState().setSearchQuery('market');
  await news.getState().fetchAllNews();
  assert.equal(newsCalls, 1);
  newsService.getAllNews = async () => { throw new Error('News failed'); };
  await news.getState().fetchAllNews(true);
  assert.equal(news.getState().error, 'News failed');
  assert.equal(news.getState().globalNews.length, 1, 'Refresh errors should preserve the previous feed');
  assert.equal(news.getState().selectedNewsType, 'global');
  newsService.getAllNews = async () => feeds;
  await news.getState().fetchAllNews(true);
  assert.equal(news.getState().error, null);
  const lateNews = deferred();
  newsService.getAllNews = () => lateNews.promise;
  const oldNews = news.getState().fetchAllNews(true);
  news.getState().resetNews();
  lateNews.resolve(feeds);
  await oldNews;
  assert.equal(news.getState().indianNews.length, 0);
  assert.equal(news.getState().searchQuery, '');

  const storage = new Map([['theme', 'dark']]);
  global.window = {
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    matchMedia: () => ({ matches: true }),
  };
  const { getPreferredTheme } = load(path.join(root, 'features/theme/themeStore.ts'));
  assert.equal(theme.getState().hydrated, false, 'First render must agree with SSR');
  theme.getState().syncTheme(getPreferredTheme());
  assert.equal(theme.getState().mode, 'dark');
  theme.getState().toggleTheme();
  assert.equal(storage.get('theme'), 'light');
  const nextTheme = createAppStores().theme;
  nextTheme.getState().syncTheme(getPreferredTheme());
  assert.equal(nextTheme.getState().mode, 'light', 'Saved light must override a dark system preference');
  storage.set('theme', 'invalid');
  assert.equal(getPreferredTheme(), 'dark');
  window.localStorage.getItem = () => { throw new Error('Storage blocked'); };
  window.localStorage.setItem = () => { throw new Error('Storage blocked'); };
  assert.equal(getPreferredTheme(), 'dark');
  assert.doesNotThrow(() => theme.getState().toggleTheme());

  // The pre-paint bootstrap must agree with the hydrated preference.
  const bootstrap = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8').match(/__html: `([\s\S]*?)`/)[1];
  for (const [saved, systemDark, expected] of [['light', true, 'light'], ['dark', false, 'dark'], [null, true, 'dark'], ['bad', false, 'light']]) {
    const element = { classList: { toggle: (_, enabled) => { element.dark = enabled; } }, style: {} };
    vm.runInNewContext(bootstrap, { localStorage: { getItem: () => saved }, matchMedia: () => ({ matches: systemDark }), document: { documentElement: element } });
    assert.equal(element.dark, expected === 'dark');
    assert.equal(element.style.colorScheme, expected);
  }
  console.log('State checks passed: cache/deduplication, isolated stores, filters, detail races, deletion success/failure, stale session responses, news retry/reset, theme hydration/persistence, blocked storage and pre-paint theme.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
