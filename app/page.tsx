"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://mobulous-tech.vercel.app/api";
const PAGE_SIZE = 10;

type User = { _id: string; name?: string; email: string; phone?: string; admin?: boolean; isEmailVerified?: boolean; createdAt?: string; lastLoginMethod?: string };
type LoginResponse = { success: boolean; message?: string; data?: { accessToken: string; user: User } };

function messageOf(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload && "message" in payload ? String(payload.message) : fallback;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(() => typeof window === "undefined" ? null : sessionStorage.getItem("admin_access_token"));
  const [admin, setAdmin] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const savedAdmin = sessionStorage.getItem("admin_user");
    return savedAdmin ? JSON.parse(savedAdmin) as User : null;
  });
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]); const [userError, setUserError] = useState("");
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1); const [activeSection, setActiveSection] = useState("Dashboard");

  useEffect(() => { if (token) void loadUsers(token); }, [token]);

  async function loadUsers(accessToken: string) {
    setLoading(true); setUserError("");
    try {
      const response = await fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${accessToken}` } });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(messageOf(payload, "Could not load users."));
      setUsers(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) { setUserError(error instanceof Error ? error.message : "Could not load users."); }
    finally { setLoading(false); }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginError(""); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login-user`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const payload = await response.json() as LoginResponse;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.message ?? "Unable to sign in.");
      if (!payload.data.user.admin) throw new Error("This admin panel is restricted to administrator accounts.");
      sessionStorage.setItem("admin_access_token", payload.data.accessToken); sessionStorage.setItem("admin_user", JSON.stringify(payload.data.user));
      setToken(payload.data.accessToken); setAdmin(payload.data.user); setPassword("");
    } catch (error) { setLoginError(error instanceof Error ? error.message : "Unable to sign in."); }
    finally { setLoading(false); }
  }
  function logout() { sessionStorage.removeItem("admin_access_token"); sessionStorage.removeItem("admin_user"); setToken(null); setAdmin(null); setUsers([]); }

  const filteredUsers = useMemo(() => users.filter((user) => {
    const term = search.trim().toLowerCase(); const matchesSearch = !term || [user.name, user.email, user.phone].filter(Boolean).some((value) => value!.toLowerCase().includes(term));
    const matchesStatus = status === "all" || (status === "verified" && user.isEmailVerified) || (status === "unverified" && !user.isEmailVerified);
    return matchesSearch && matchesStatus;
  }), [users, search, status]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE)); const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); const verifiedUsers = users.filter((user) => user.isEmailVerified).length;

  if (!admin) return <main className="login-shell"><section className="login-card"><p className="eyebrow">ASSET HEAVEN</p><h1>Admin portal</h1><p className="muted">Sign in with an administrator account to manage your platform.</p><form onSubmit={handleLogin} className="login-form"><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{loginError && <p className="error">{loginError}</p>}<button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form><p className="hint">Only accounts marked as administrators can access this portal.</p></section></main>;

  return <main className="admin-shell"><aside className="sidebar"><div className="brand"><span>AH</span><strong>Asset Heaven</strong></div><nav>{["Dashboard", "Users", "News", "Analytics", "Settings"].map((item) => <button key={item} className={activeSection === item ? "nav-item active" : "nav-item"} onClick={() => setActiveSection(item)}>{item}</button>)}</nav><button className="logout" onClick={logout}>Sign out</button></aside><section className="content"><header><div><p className="eyebrow">ADMINISTRATION</p><h1>{activeSection}</h1></div><div className="header-actions"><ThemeToggle /><div className="admin-name"><span>{admin.name?.charAt(0).toUpperCase() ?? "A"}</span>{admin.name || admin.email}</div></div></header>{activeSection !== "Dashboard" && activeSection !== "Users" ? <div className="empty-state"><h2>{activeSection}</h2><p>This section is ready for its API integration.</p></div> : <><div className="stats"><article><p>Total users</p><strong>{users.length}</strong><small>All registered accounts</small></article><article><p>Verified users</p><strong>{verifiedUsers}</strong><small>Email verified accounts</small></article><article><p>Unverified users</p><strong>{users.length - verifiedUsers}</strong><small>Awaiting verification</small></article></div><section className="table-card"><div className="table-heading"><div><h2>User directory</h2><p>Review registered user accounts.</p></div><button className="refresh" onClick={() => token && void loadUsers(token)} disabled={loading}>Refresh</button></div><div className="filters"><input aria-label="Search users" placeholder="Search name, email or phone" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="verified">Verified</option><option value="unverified">Unverified</option></select></div>{userError ? <p className="error">{userError}</p> : <div className="table-wrap"><table><thead><tr><th>User</th><th>Phone</th><th>Sign-in method</th><th>Status</th><th>Joined</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="center">Loading users…</td></tr> : visibleUsers.length === 0 ? <tr><td colSpan={5} className="center">No users match these filters.</td></tr> : visibleUsers.map((user) => <tr key={user._id}><td><strong>{user.name || "Unnamed user"}</strong><small>{user.email}</small></td><td>{user.phone || "—"}</td><td>{user.lastLoginMethod === "google" ? "Google" : "Email & password"}</td><td><span className={user.isEmailVerified ? "badge verified" : "badge pending"}>{user.isEmailVerified ? "Verified" : "Unverified"}</span></td><td>{user.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(user.createdAt)) : "—"}</td></tr>)}</tbody></table></div>}<footer className="pagination"><span>{filteredUsers.length ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of ${filteredUsers.length}` : "0 users"}</span><div><button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button><span>Page {currentPage} of {totalPages}</span><button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button></div></footer></section></>}</section></main>;
}
