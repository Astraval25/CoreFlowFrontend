import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdDownload, MdPerson, MdReceiptLong, MdPayments } from "react-icons/md";
import { coreApi } from "../../../shared/services/coreApi";
import { emitAppError } from "../../../shared/utils/appError";

const statusBadge = (status) => {
  const map = { DRAFT: "orange", APPROVED: "blue", PAID: "blue" };
  return <span className={`badge badge-${map[status] || "gray"}`}>{status}</span>;
};

const paymentStatusLabel = (detail) => {
  const paidAmount = Number(detail?.paidAmount || 0);
  const balanceAmount = Number(detail?.balanceAmount || 0);
  if (paidAmount <= 0) return "Not Paid";
  if (balanceAmount <= 0) return "Fully Paid";
  return "Partially Paid";
};

const DataPoint = ({ label, value, accent = false }) => (
  <div>
    <p className="text-[10px] uppercase font-semibold tracking-[0.05em] text-app-muted">{label}</p>
    <p className={`text-sm font-medium ${accent ? "text-brand-hover" : "text-app-text"}`}>{value ?? "-"}</p>
  </div>
);

const SalaryDetailPage = () => {
  const navigate = useNavigate();
  const { companyId, salaryPeriodId } = useParams();
  const [detail, setDetail] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const detailRes = await coreApi.getSalaryPeriodDetail(companyId, salaryPeriodId);
        const salaryDetail = detailRes?.data?.responseData;
        if (!active) return;
        setDetail(salaryDetail || null);

        if (salaryDetail?.employeeId) {
          const employeeRes = await coreApi.getEmployeeDetail(companyId, salaryDetail.employeeId);
          if (!active) return;
          setEmployee(employeeRes?.data?.responseData || null);
        } else {
          setEmployee(null);
        }
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.responseMessage || "Failed to load salary details");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [companyId, salaryPeriodId]);

  const workSummary = useMemo(() => {
    const workLines = (detail?.lines || []).filter((line) => line.lineType === "WORK_EARNING");
    const totalQuantity = workLines.reduce((sum, line) => sum + Number(line.totalQty || 0), 0);
    return {
      workTypeCount: workLines.length,
      totalQuantity,
    };
  }, [detail]);

  const downloadSlip = async () => {
    try {
      const res = await coreApi.downloadSalarySlip(companyId, salaryPeriodId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `salary-slip-${salaryPeriodId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      emitAppError(err, "Failed to download salary slip.");
    }
  };

  if (loading) {
    return <p className="text-sm p-6 text-app-muted">Loading salary details...</p>;
  }

  if (error) {
    return <p className="text-sm p-6 text-danger">{error}</p>;
  }

  if (!detail) {
    return <p className="text-sm p-6 text-app-muted">Salary detail not found.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost p-1.5">
            <MdArrowBack size={18} />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-app-text">Salary Details</h1>
            <p className="text-xs text-app-muted">
              {detail.employeeName} | {detail.fromDate} to {detail.toDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge(detail.status)}
          <button type="button" onClick={downloadSlip} className="btn-outline text-xs">
            <MdDownload size={14} /> Download Slip
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-app-text">
            <MdPerson size={16} /> Employee Basic Details
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <DataPoint label="Employee Name" value={detail.employeeName} />
            <DataPoint label="Employee Code" value={detail.employeeCode} />
            <DataPoint label="Phone" value={employee?.phone || "-"} />
            <DataPoint label="Email" value={employee?.email || "-"} />
            <DataPoint label="Designation" value={employee?.designation || "-"} />
            <DataPoint label="Joined Date" value={employee?.joinedDt || "-"} />
            <DataPoint label="Salary Type" value={detail.salaryType} />
            <DataPoint
              label="Current Monthly Amount"
              value={employee?.currentMonthlyAmount != null ? `Rs ${Number(employee.currentMonthlyAmount).toLocaleString()}` : "-"}
            />
            <DataPoint label="Payment Status" value={paymentStatusLabel(detail)} accent />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-app-text">
            <MdPayments size={16} /> Payment Snapshot
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <DataPoint label="Net Amount" value={`Rs ${Number(detail.netAmount || 0).toLocaleString()}`} />
            <DataPoint label="Paid Amount" value={`Rs ${Number(detail.paidAmount || 0).toLocaleString()}`} />
            <DataPoint label="Balance Amount" value={`Rs ${Number(detail.balanceAmount || 0).toLocaleString()}`} accent />
            <DataPoint label="Payments Recorded" value={detail.paymentCount ?? 0} />
            <DataPoint label="Approved On" value={detail.approvedDt || "-"} />
            <DataPoint label="Paid On" value={detail.paidDt || "-"} />
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-app-text">
          <MdReceiptLong size={16} /> Salary Summary
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          <DataPoint label="Period" value={detail.period} />
          <DataPoint label="From Date" value={detail.fromDate} />
          <DataPoint label="To Date" value={detail.toDate} />
          <DataPoint label="Working Days" value={detail.workingDaysInMonth ?? "-"} />
          <DataPoint label="Days Present" value={detail.daysPresent ?? "-"} />
          <DataPoint label="Days Absent" value={detail.daysAbsent ?? "-"} />
          <DataPoint label="LOP Days" value={detail.lopDays ?? "-"} />
          <DataPoint label="Gross Amount" value={`Rs ${Number(detail.grossAmount || 0).toLocaleString()}`} />
          <DataPoint label="LOP Deduction" value={`Rs ${Number(detail.lopDeduction || 0).toLocaleString()}`} />
          <DataPoint label="Other Deductions" value={`Rs ${Number(detail.otherDeductions || 0).toLocaleString()}`} />
          <DataPoint label="Work Types Done" value={workSummary.workTypeCount} />
          <DataPoint label="Total Work Qty" value={workSummary.totalQuantity} />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-app-text">Earnings and Deduction Details</h2>
        {detail.lines?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  {["Type", "Description", "Qty", "Unit", "Rate", "Amount"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.05em] text-app-muted">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.lines.map((line) => (
                  <tr key={line.lineId} className="border-b border-line-soft">
                    <td className="px-4 py-3 text-xs">{statusBadge(line.lineType)}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{line.description}</td>
                    <td className="px-4 py-3 text-sm tabular-nums text-app-text">{line.totalQty ?? "-"}</td>
                    <td className="px-4 py-3 text-sm text-app-sub">{line.unit || "-"}</td>
                    <td className="px-4 py-3 text-sm tabular-nums text-app-sub">
                      {line.rateUsed != null ? `Rs ${Number(line.rateUsed).toLocaleString()}` : "-"}
                    </td>
                    <td className={`px-4 py-3 text-sm tabular-nums font-semibold ${Number(line.amount || 0) < 0 ? "text-danger" : "text-app-text"}`}>
                      Rs {Number(line.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-app-muted">No earnings or deduction lines available.</p>
        )}
      </section>

      <section className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-app-text">Payment Records</h2>
        {detail.payments?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  {["Date", "Payment Mode", "Invoice No", "Remark", "Amount"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.05em] text-app-muted">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.payments.map((payment) => (
                  <tr key={payment.expenseId} className="border-b border-line-soft">
                    <td className="px-4 py-3 text-sm text-app-text">{payment.expenseDate}</td>
                    <td className="px-4 py-3 text-sm text-app-sub">{payment.paymentMode}</td>
                    <td className="px-4 py-3 text-sm text-app-sub">{payment.invoiceNo || "-"}</td>
                    <td className="px-4 py-3 text-sm text-app-sub">{payment.remark || "-"}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-semibold text-app-text">
                      Rs {Number(payment.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-app-muted">No salary payments recorded yet.</p>
        )}
      </section>
    </div>
  );
};

export default SalaryDetailPage;
