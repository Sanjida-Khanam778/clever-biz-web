import { useState, useEffect } from "react";

export type UserRole = "chef" | "staff" | "owner" | "admin" | null;

interface UserInfo {
  id: number;
  email: string;
  role: UserRole;
  username?: string;
  restaurants?: any[];
  // Add other user properties as needed
}

export const useRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Get user role from localStorage
  const getUserRole = (): UserRole => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        return user.role || null;
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
    }
    return null;
  };

  // Get full user info from localStorage
  const getUserInfo = (): UserInfo | null => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        return JSON.parse(userInfoStr);
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
    }
    return null;
  };

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(userRole as UserRole);
  };

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return userRole !== null && !!localStorage.getItem("accessToken");
  };

  // Clear user data (for logout)
  const clearUserData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setUserRole(null);
    setUserInfo(null);
  };

  // Update user data (for login)
  const updateUserData = (
    user: UserInfo,
    accessToken: string,
    refreshToken: string
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userInfo", JSON.stringify(user));
    setUserRole(user.role);
    setUserInfo(user);
  };

  // Initialize user data on component mount
  useEffect(() => {
    const role = getUserRole();
    const user = getUserInfo();
    setUserRole(role);
    setUserInfo(user);
    setIsLoading(false);
  }, []);

  return {
    userRole,
    userInfo,
    isLoading,
    getUserRole,
    getUserInfo,
    hasRole,
    hasAnyRole,
    isAuthenticated,
    clearUserData,
    updateUserData,
  };
};
