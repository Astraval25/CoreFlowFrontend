import { MdAdd, MdInbox, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../../shared/components/ActionMenu";
import useExpenses from "../hooks/useExpenses";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ExpensesPage = () => {
  const {
    companyId,
    filteredExpenses,
    globalFilter,
    setGlobalFilter,
    loading,
    deactivateExpense,
  } = useExpenses();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-bold text-app-text">Expenses</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
            />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search expenses..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 240 }}
            />
          </div>
          <button
            className="btn-primary text-xs"
            onClick={() => navigate(`/cf/company/${companyId}/expenses/create`)}
          >
            <MdAdd size={15} /> New Expense
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[1040px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {["S.No", "Date", "Account", "Invoice No.", "Vendor", "Customer", "Payment Mode", "Amount", "Action"].map((header, index) => (
                  <th
                    key={header}
                    className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide ${index === 7 ? "text-right" : "text-left"} text-app-sub`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MdInbox size={28} className="text-app-sub" />
                      <p className="text-sm text-app-sub">No expenses found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, index) => {
                  const amount = Number(expense.amount || 0);
                  return (
                    <tr
                      key={expense.expenseId}
                      className="cursor-pointer border-b border-line-soft hover:bg-surface-hover"
                      onClick={() => navigate(`/cf/company/${companyId}/expenses/${expense.expenseId}/update`)}
                    >
                      <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                      <td className="px-5 py-3 text-sm text-app-text">{expense.expenseDate || "-"}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-brand-hover">{expense.expenseAccountName || "-"}</span>
                          <span className="text-[11px] text-app-muted">{expense.expenseAccountType || "-"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-app-text">{expense.invoiceNo || "-"}</td>
                      <td className="px-5 py-3 text-sm text-app-text">{expense.vendorName || "-"}</td>
                      <td className="px-5 py-3 text-sm text-app-text">{expense.customerName || "-"}</td>
                      <td className="px-5 py-3 text-sm text-app-text">{expense.paymentMode || "-"}</td>
                      <td className={`px-5 py-3 text-sm font-semibold tabular-nums text-right ${amount < 0 ? "text-danger" : "text-app-text"}`}>
                        {fmtMoney(amount)}
                      </td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          row={{ original: expense }}
                          onEdit={() => navigate(`/cf/company/${companyId}/expenses/${expense.expenseId}/update`)}
                          onDelete={async () => {
                            if (!window.confirm("Deactivate this expense?")) return;
                            await deactivateExpense(expense.expenseId);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
