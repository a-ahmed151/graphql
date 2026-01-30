import type { ReactNode } from "react";
import { useState, createContext, useContext } from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  userToken: string | null;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

const loginURL = "https://learn.reboot01.com/api/auth/signin";
type loginRepsonse = string | { error: string };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(
    sessionStorage.getItem("jwt"),
  );

  const isAuthenticated = !!userToken;

  const logout = () => {
    sessionStorage.removeItem("jwt");
    setUserToken(null);
  };

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const result: loginRepsonse = await response.json();
      if (typeof result === "string") {
        setUserToken(result);
        sessionStorage.setItem("jwt", result);
        return "";
      }else {
        return JSON.stringify(result.error)
      }
    } catch (err) {
      console.error(err);
      return JSON.stringify(err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
};
