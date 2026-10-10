import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAuth, setAuth } from "../api/api";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getAuth()
      .then((data) => setIsAuthenticated(data.isAuthenticated))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async () => {
    const data = await setAuth(true);
    setIsAuthenticated(data.isAuthenticated);
  };

  const logout = async () => {
    const data = await setAuth(false);
    setIsAuthenticated(data.isAuthenticated);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, isError, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
