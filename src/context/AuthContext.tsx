
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions for demo purposes
// In a real app, these would connect to your backend
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (simulating persistent sessions)
    const savedUser = localStorage.getItem("bentoUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful login
      const mockUser = {
        id: "user-1",
        username: email.split('@')[0],
        displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email
      };
      
      setUser(mockUser);
      localStorage.setItem("bentoUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const mockUser = {
        id: "user-" + Date.now(),
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        email
      };
      
      setUser(mockUser);
      localStorage.setItem("bentoUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bentoUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
