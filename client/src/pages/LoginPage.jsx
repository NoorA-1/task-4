import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../auth/token";
import { flash } from "../ui/flash";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await login({ email, password });
      if (data?.token) setToken(data.token);
      flash("Logged in successfully.", "success");
      nav("/users");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed.";
      flash(msg, "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h3 className="mb-3">Login</h3>

      <form className="card card-body" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in..." : "Login"}
        </button>

        <div className="mt-3 text-muted">
          No account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
