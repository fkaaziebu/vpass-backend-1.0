import React from "react";
import ReactLogo from "../../images/logo192.png";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-between align-items-center bg-white rounded-5 p-4">
      <div className="d-none d-lg-flex">
        <img className="img-fluid" src={ReactLogo} alt="React Logo" />
      </div>
      <div>
        <h2 className="display-5 fw-normal">Welcome to your VPASS dashboard!</h2>
        <p className="text-muted fs-4">
          Your vpass dashboard is a safe place to store passwords and create
          passwords for everything
        </p>
        <div>
          <button className="btn btn-primary fs-3" onClick={() => {
            navigate("/create-password")
          }}>Create Password</button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
