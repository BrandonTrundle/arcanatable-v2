import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const updateUser = (updatedFields) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedFields,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.id, token });
    }
  }, []);

  const login = (token, userData) => {
    const fullUser = { ...userData, token };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(fullUser)); // ✅ Save full user
    console.log("Logged in user:", fullUser);
    setUser(fullUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ clear stored user
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
