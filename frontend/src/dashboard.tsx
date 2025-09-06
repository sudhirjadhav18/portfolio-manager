interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Dashboard</h2>
      <p>Welcome to Portfolio Manager</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
