import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the AuthContext
interface AuthContextProps {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  handleSignOut: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem("user_email");
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
