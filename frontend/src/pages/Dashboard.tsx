import React from "react";
import { useAuth } from "../modules/auth/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;


