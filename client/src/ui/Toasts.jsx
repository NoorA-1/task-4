import { useEffect, useState } from "react";
import { subscribeFlash } from "./flash";

export default function Toasts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return subscribeFlash((t) => {
      setItems((prev) => [...prev, t]);
      // auto-remove after 4s
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 4000);
    });
  }, []);

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080 }}
    >
      {items.map((t) => (
        <div key={t.id} className={`toast show text-bg-${t.variant} mb-2`}>
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setItems((prev) => prev.filter((x) => x.id !== t.id))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
