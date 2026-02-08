import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmEmail } from "../api/auth";
import { flash } from "../ui/flash";

export default function ConfirmPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        await confirmEmail(token);
        if (cancelled) return;
        setState("ok");
        flash("Email confirmed. You can log in now.", "success");
      } catch (e) {
        if (cancelled) return;
        setState("error");
        flash("Confirmation link is invalid or expired.", "danger");
      }
    }
    if (token) run();
    else setState("error");
    return () => (cancelled = true);
  }, [token]);

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h3 className="mb-3">Email Confirmation</h3>
      <div className="card card-body">
        {state === "loading" && <div>Confirming...</div>}
        {state === "ok" && (
          <div>
            Confirmed ✅{" "}
            <div className="mt-2">
              <Link to="/login">Go to login</Link>
            </div>
          </div>
        )}
        {state === "error" && (
          <div>
            Could not confirm.{" "}
            <div className="mt-2">
              <Link to="/login">Go to login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
