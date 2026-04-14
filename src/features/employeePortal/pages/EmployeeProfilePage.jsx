import { useEmployeeProfile } from "../hooks/useEmployeeProfile";
import { MdPerson } from "react-icons/md";

const EmployeeProfilePage = () => {
  const { profile, loading } = useEmployeeProfile();

  if (loading) return <p className="text-xs p-5" style={{ color: "var(--text-muted)" }}>Loading…</p>;
  if (!profile) return <p className="text-xs p-5" style={{ color: "var(--red)" }}>Profile not found</p>;

  return (
    <div>
      <h1 className="text-sm font-semibold mb-5" style={{ color: "var(--text-main)" }}>My Profile</h1>

      <div className="card p-5">
        <h2 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-main)" }}><MdPerson size={16} /> Employee Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ["Code", profile.employeeCode],
            ["Name", profile.employeeName],
            ["Phone", profile.phone || "—"],
            ["Email", profile.email || "—"],
            ["Designation", profile.designation || "—"],
            ["Joined", profile.joinedDt],
            ["Salary Type", profile.currentSalaryType],
            ["Monthly Amount", profile.currentMonthlyAmount != null ? `₹${profile.currentMonthlyAmount.toLocaleString()}` : "—"],
            ["Status", profile.isActive ? "Active" : "Inactive"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] uppercase font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-xs font-medium" style={{ color: "var(--text-main)" }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
