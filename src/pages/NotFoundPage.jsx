import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-app px-6 py-10">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
        <div className="card w-full p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-app-sub">
            Error 404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-app-heading">Page Not Found</h1>
          <p className="mt-3 text-sm text-app-sub">
            The page you are trying to open does not exist or may have been moved.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-ghost w-full sm:w-auto">
              Go To Home
            </Link>
            <Link to="/cf/auth/login" className="btn-primary w-full sm:w-auto">
              Go To Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
