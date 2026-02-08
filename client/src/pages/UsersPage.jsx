import { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav";
import UsersToolbar from "../components/UsersToolbar";
import { flash } from "../ui/flash";
import {
  fetchUsers,
  blockUsers,
  unblockUsers,
  deleteUsers,
  deleteUnverified,
} from "../api/users";

function fmtDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function statusBadge(status) {
  const map = {
    active: "success",
    blocked: "danger",
    unverified: "secondary",
  };
  const cls = map[status] || "secondary";
  return <span className={`badge text-bg-${cls}`}>{status}</span>;
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  async function load() {
    setLoading(true);
    try {
      const data = await fetchUsers();
      // backend might return { users: [...] } or [...]
      const list = Array.isArray(data) ? data : data.users;
      setUsers(list || []);
      // keep selection only for existing rows
      setSelected((prev) => {
        const next = new Set();
        const ids = new Set((list || []).map((u) => u.id));
        for (const id of prev) if (ids.has(id)) next.add(id);
        return next;
      });
    } catch (err) {
      flash(err?.response?.data?.message || "Failed to load users.", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); // 🚨 this call is where kick-on-action happens if you got blocked/deleted
  }, []);

  const allIds = useMemo(() => users.map((u) => u.id), [users]);
  const allSelected = users.length > 0 && selected.size === users.length;

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (users.length === 0) return prev;
      if (prev.size === users.length) return new Set();
      return new Set(allIds);
    });
  }

  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const bulkDisabled = selectedIds.length === 0;

  async function act(fn, successMsg) {
    try {
      await fn();
      flash(successMsg, "success");
      await load();
    } catch (err) {
      flash(err?.response?.data?.message || "Action failed.", "danger");
    }
  }

  return (
    <>
      <TopNav />
      <div className="container py-4">
        <div className="d-flex align-items-center mb-2">
          <h4 className="mb-0">Users</h4>
          <button
            className="btn btn-sm btn-outline-secondary ms-auto"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <UsersToolbar
          disabled={bulkDisabled}
          selectedCount={selectedIds.length}
          onBlock={() =>
            act(() => blockUsers(selectedIds), "Selected users blocked.")
          }
          onUnblock={() =>
            act(() => unblockUsers(selectedIds), "Selected users unblocked.")
          }
          onDelete={() =>
            act(() => deleteUsers(selectedIds), "Selected users deleted.")
          }
          onDeleteUnverified={() =>
            act(() => deleteUnverified(), "Unverified users deleted.")
          }
        />

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }} className="text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Last login</th>
                <th style={{ width: 120 }}>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggleOne(u.id)}
                      aria-label={`Select ${u.email}`}
                    />
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{fmtDate(u.last_login_at || u.lastLoginAt)}</td>
                  <td>{statusBadge(u.status)}</td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-muted small">
          Sorted by last login time (server-side).
        </div>
      </div>
    </>
  );
}
