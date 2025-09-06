import { useEffect, useState } from "react";

interface DashboardProps {
  onLogout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user info from backend
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          credentials: "include", // send cookie
        });
        const data = await res.json();
        if (data.ok) {
          setUser(data.user);
        } else {
          onLogout(); // token invalid → logout
        }
      } catch (err) {
        console.error(err);
        onLogout();
      }
    };

    fetchUser();
  }, [onLogout]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      onLogout();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
