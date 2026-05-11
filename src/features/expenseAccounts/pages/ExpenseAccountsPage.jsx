import { MdAdd, MdInbox, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../../shared/components/ActionMenu";
import useExpenseAccounts from "../hooks/useExpenseAccounts";

const ExpenseAccountsPage = () => {
  const {
    companyId,
    filteredAccounts,
    globalFilter,
    setGlobalFilter,
    loading,
    deactivateAccount,
    activateAccount,
  } = useExpenseAccounts();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-bold text-app-text">Expense Accounts</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
            />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search accounts..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 240 }}
            />
          </div>
          <button
            className="btn-primary text-xs"
            onClick={() => navigate(`/cf/company/${companyId}/setup/expense-accounts/create`)}
          >
            <MdAdd size={15} /> New Account
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {["S.No", "Account Name", "Account Type", "Status", "Action"].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-app-sub"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MdInbox size={28} className="text-app-sub" />
                      <p className="text-sm text-app-sub">No expense accounts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account, index) => (
                  <tr key={account.expenseAccountId} className="border-b border-line-soft hover:bg-surface-hover">
                    <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                    <td className="px-5 py-3 text-sm font-medium text-brand-hover">{account.accountName}</td>
                    <td className="px-5 py-3 text-sm text-app-text">{account.accountType}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${account.isActive ? "badge-blue" : "badge-gray"}`}>
                        {account.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        row={{ original: account }}
                        onEdit={() =>
                          navigate(`/cf/company/${companyId}/setup/expense-accounts/${account.expenseAccountId}/update`)
                        }
                        onDelete={async () => {
                          if (!window.confirm("Deactivate this expense account?")) return;
                          await deactivateAccount(account.expenseAccountId);
                        }}
                        onActivate={async () => {
                          if (!window.confirm("Activate this expense account?")) return;
                          await activateAccount(account.expenseAccountId);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAccountsPage;
