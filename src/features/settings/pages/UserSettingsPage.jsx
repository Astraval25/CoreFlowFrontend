import { jwtDecode } from "jwt-decode";
import { MdAccountBalanceWallet, MdBusiness, MdChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const token = localStorage.getItem("token");
  let companyId = "";
  try {
    companyId = token ? jwtDecode(token)?.defaultComp?.[0] || "" : "";
  } catch {
    companyId = "";
  }

  return (
    <div className="min-h-screen bg-app">
      <div className="mb-5">
        <h1 className="text-sm font-bold text-app-text">User Settings</h1>
        <p className="text-xs text-app-muted mt-1">User #{userId}</p>
      </div>

      <div className="page-section max-w-3xl">
        <h2 className="text-xs font-bold uppercase tracking-wide text-app-sub mb-3">Setup</h2>

        <button
          type="button"
          onClick={() => companyId && navigate(`/cf/company/${companyId}/settings/organization-profile`)}
          disabled={!companyId}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-line bg-surface hover:bg-surface-hover transition-colors disabled:opacity-60 mb-3"
        >
          <span className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-md bg-brand-soft text-brand flex items-center justify-center">
              <MdBusiness size={17} />
            </span>
            <span className="text-sm font-semibold text-app-text">Organization Profile</span>
          </span>
          <MdChevronRight size={18} className="text-app-muted" />
        </button>

        <button
          type="button"
          onClick={() => companyId && navigate(`/cf/company/${companyId}/setup/expense-accounts`)}
          disabled={!companyId}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-line bg-surface hover:bg-surface-hover transition-colors disabled:opacity-60"
        >
          <span className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-md bg-brand-soft text-brand flex items-center justify-center">
              <MdAccountBalanceWallet size={17} />
            </span>
            <span className="text-sm font-semibold text-app-text">Expense Account</span>
          </span>
          <MdChevronRight size={18} className="text-app-muted" />
        </button>
      </div>
    </div>
  );
};

export default UserSettingsPage;
