import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: "password", 
        }),
      });
      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  // TODO: authenticate
async function authenticate() {
  if (!token) {
    throw new Error("No token available");
  }

  try {
    const response = await fetch(API + "/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    const result = await response.json();
    console.log("Authenticated result:", result);

    setLocation("TUNNEL");
  } catch (e) {
    console.error("Authentication failed:", e);
    throw e;
  }
}


  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
