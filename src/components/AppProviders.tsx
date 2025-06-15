
'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

// This component can be used to wrap your application with any context providers
// For now, it's a simple pass-through, but useful for future expansion (e.g., Auth, Theme)

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProviders;
