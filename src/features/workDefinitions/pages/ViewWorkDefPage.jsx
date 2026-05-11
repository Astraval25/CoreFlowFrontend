import React from 'react';
import { useParams } from 'react-router-dom';
import useViewWorkDef from '../hooks/useViewWorkDef';

const ViewWorkDefPage = () => {
  const { companyId, workDefId } = useParams();
  const { workDef, loading, error } = useViewWorkDef(companyId, workDefId);

  return (
    <div className="view-work-def-page p-6 bg-surface min-h-screen">
      <h1 className="text-lg font-semibold text-app-text mb-4">Work Definition Details</h1>
      {workDef ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-app-muted">Work Definition ID</p>
              <p className="text-base font-medium text-app-text">{workDef.workDefId}</p>
            </div>
            <div>
              <p className="text-sm text-app-muted">Work Name</p>
              <p className="text-base font-medium text-app-text">{workDef.workName}</p>
            </div>
            <div>
              <p className="text-sm text-app-muted">Work Code</p>
              <p className="text-base font-medium text-app-text">{workDef.workCode}</p>
            </div>
            <div>
              <p className="text-sm text-app-muted">Rate Per Unit</p>
              <p className="text-base font-medium text-app-text">${workDef.ratePerUnit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-app-muted">Unit</p>
              <p className="text-base font-medium text-app-text">{workDef.unit}</p>
            </div>
            <div>
              <p className="text-sm text-app-muted">Status</p>
              <p className="text-base font-medium text-app-text">
                {workDef.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-app-muted">Description</p>
            <p className="text-base font-medium text-app-text">{workDef.description}</p>
          </div>
        </div>
      ) : (
        <p className="text-app-muted">No details available.</p>
      )}
    </div>
  );
};

export default ViewWorkDefPage;