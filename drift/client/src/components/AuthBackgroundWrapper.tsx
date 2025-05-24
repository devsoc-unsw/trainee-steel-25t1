// components/AuthBackgroundWrapper.tsx
import React from 'react';

const AuthBackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue p-4">
      {children}
    </div>
  );
};

export default AuthBackgroundWrapper;
