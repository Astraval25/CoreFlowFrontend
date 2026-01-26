const Info = ({ label, value }) => (
  <div className="flex items-start">
    <span className="w-35 text-sm text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium">: {value}</span>
  </div>
);

export default Info;
