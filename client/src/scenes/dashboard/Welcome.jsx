import React from "react";
import ReactLogo from "../../images/logo192.png";
import CreatePass from "../create-password";

function Welcome() {
  return (
    <div className="d-flex justify-content-between align-items-center bg-white rounded-5 p-4">
      <div className="d-none d-lg-flex">
        <img className="img-fluid" src={ReactLogo} alt="React Logo" />
      </div>
      <div>
        <h2 className="display-5 fw-normal">
          Welcome to your VPASS dashboard!
        </h2>
        <p className="text-muted fs-4">
          Your vpass dashboard is a safe place to store passwords and create
          passwords for everything
        </p>
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#exampleModal3"
            className="btn btn-primary fs-3"
          >
            Create Password
          </button>
        </div>
      </div>

      {/* Creating Password */}
      <div
        className="modal fade"
        id="exampleModal3"
        tabindex="-1"
        aria-labelledby="exampleModal3Label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          
            <CreatePass />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
