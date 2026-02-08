import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../auth/token";
import { flash } from "../ui/flash";

export default function TopNav() {
  const nav = useNavigate();

  function logout() {
    clearToken();
    flash("Logged out.", "secondary");
    nav("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/users">
          User Admin Panel
        </Link>
        <div className="ms-auto">
          <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
