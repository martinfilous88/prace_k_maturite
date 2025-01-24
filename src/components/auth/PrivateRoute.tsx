import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function PrivateRoute({ 
  children, 
  adminOnly = false 
}: PrivateRouteProps) {
  const { currentUser, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    toast.error('Nemáte oprávnění pro přístup do administrace');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}