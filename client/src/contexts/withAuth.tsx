import React from "react";
import { useAuth } from "./AuthContext";

export interface WithAuthProps {
  authUser: any;
  authLoading: boolean;
}

export function withAuth<P extends WithAuthProps>(
  Component: React.ComponentType<P>
) {
  return (props: Omit<P, keyof WithAuthProps>) => {
    const { user, isLoading } = useAuth();
    return (
      <Component {...(props as P)} authUser={user} authLoading={isLoading} />
    );
  };
}
