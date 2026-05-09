import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from '../api/supabase';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roleRequired: 'admin' | 'user' | 'guide';
}

export default function ProtectedRoute({ children, roleRequired }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);

      // 1. Check if a session exists
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user || sessionError) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // 2. Fetch the role from your 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setIsAuthorized(false);
      } else {
        // 3. Compare user role with the required role (case-insensitive)
        const userRole = String(profile.role).toLowerCase();
        setIsAuthorized(userRole === roleRequired.toLowerCase());
      }

      setLoading(false);
    };

    checkUserRole();
  }, [roleRequired]);

  // Show a loading spinner while checking authorization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-emerald-800 font-bold animate-pulse text-sm">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // If authorized, render the page; otherwise, redirect to login
  return isAuthorized ? children : <Navigate to="/login" replace />;
}