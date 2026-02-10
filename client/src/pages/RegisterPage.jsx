import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { flash } from "../ui/flash";

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register({ name, email, password });
      flash(
        "Registration successful. Confirmation email has been sent.",
        "success",
      );
      nav("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", {
        message: err.message,
        status: err?.response?.status,
        data: err?.response?.data,
        headers: err?.response?.headers,
      });

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Registration failed.";

      flash(msg, "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h3 className="mb-3">Register</h3>

      <form className="card card-body" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-text">
            You’ll be able to log in after confirming your email (unless your
            backend allows unverified login).
          </div>
        </div>

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>

        <div className="mt-3 text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
