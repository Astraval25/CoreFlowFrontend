import { useParams } from "react-router-dom";

const PlaceholderPage = ({ title }) => {
  const params = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--text-main)" }}
      >
        {title}
      </h1>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        This page is under construction.
      </p>
      {Object.keys(params).length > 0 && (
        <pre
          className="text-xs px-4 py-2 rounded-lg"
          style={{ background: "var(--surface-soft)", color: "var(--text-sub)" }}
        >
          {JSON.stringify(params, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default PlaceholderPage;
