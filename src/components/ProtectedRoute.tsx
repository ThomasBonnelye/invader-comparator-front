import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route component that requires authentication or guest status
 * Redirects to home page if user is not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authStatus } = useAuth();

  if (authStatus === null) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
