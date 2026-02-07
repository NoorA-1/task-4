import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="container py-4">
      <h1 className="h4">User Admin Panel</h1>
      <p className="text-muted">Scaffold is up.</p>
      <div className="d-flex gap-2">
        <Link className="btn btn-outline-primary" to="/login">
          Login
        </Link>
        <Link className="btn btn-outline-secondary" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="container py-4">
      <h1 className="h4">{title}</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
        <Route path="/register" element={<Placeholder title="Register" />} />
        <Route path="/users" element={<Placeholder title="Users" />} />
      </Routes>
    </BrowserRouter>
  );
}
