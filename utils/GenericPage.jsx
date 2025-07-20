// utils/GenericPage.jsx
import React from "react";

const GenericPage = ({ title, description, icon, children }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            {icon && <span className="mr-3">{icon}</span>}
            {title}
          </h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      {children || (
        <div className="bg-gray-50 rounded-lg p-6 text-center mt-6">
          <p className="text-gray-500">This section is under development.</p>
          <p className="text-sm text-gray-400 mt-2">
            Content will be added soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenericPage;
