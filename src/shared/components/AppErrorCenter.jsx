import { useEffect, useRef, useState } from "react";
import { MdClose, MdErrorOutline } from "react-icons/md";
import { onAppError } from "../utils/appError";

const AUTO_DISMISS_MS = 4200;

const AppErrorCenter = () => {
  const [errors, setErrors] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const unsubscribe = onAppError((payload) => {
      if (!payload?.message) return;

      setErrors((prev) => [...prev, payload]);
      const timeoutId = window.setTimeout(() => {
        setErrors((prev) => prev.filter((err) => err.id !== payload.id));
        timersRef.current.delete(payload.id);
      }, AUTO_DISMISS_MS);

      timersRef.current.set(payload.id, timeoutId);
    });

    return () => {
      const timers = timersRef.current;
      unsubscribe();
      timers.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timers.clear();
    };
  }, []);

  const dismiss = (id) => {
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timersRef.current.delete(id);
    }
    setErrors((prev) => prev.filter((err) => err.id !== id));
  };

  if (!errors.length) return null;

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-[120] w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 space-y-2">
      {errors.map((error) => (
        <div
          key={error.id}
          className="pointer-events-auto rounded-xl border border-danger-alert-border bg-danger-alert-bg px-4 py-3 text-danger-alert-text shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <MdErrorOutline size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-semibold leading-5">{error.message}</p>
            <button
              type="button"
              onClick={() => dismiss(error.id)}
              className="rounded-md p-1 opacity-70 transition hover:opacity-100"
              aria-label="Close error message"
            >
              <MdClose size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppErrorCenter;
