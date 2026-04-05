import React from 'react'

const Dashboard = () => {

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setAccessToken(null);
      window.location.href = "/login";
    }
  };
  return (
    <div>Dashboard</div>
    <button onClick={handleLogout}>Logout</button>
  )
}

export default Dashboard