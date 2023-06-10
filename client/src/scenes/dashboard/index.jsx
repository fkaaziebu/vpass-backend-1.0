import React from "react";
import Welcome from "./Welcome";
import PasswordListing from "./PasswordListing";

function Dashboard() {
  return (
    <div className="container-fluid p-4">
      <div className="container-lg container-lg-fluid">
        <Welcome />
        <PasswordListing />
      </div>
    </div>
  );
}

export default Dashboard;
