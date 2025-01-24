import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/page" replace />;
  }

  if (adminOnly && !isAdmin()) {
    toast.error('Nemáte oprávnění pro přístup do administrace');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
