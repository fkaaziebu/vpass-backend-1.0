import React from "react";
import CreatePass from "../create-password";

function Welcome() {
  return (
    <div className="d-flex justify-content-between align-items-center bg-white rounded-5 p-4">
      <div>
        <h2 className="display-5 fw-normal text-center">
          Welcome to your VPASS dashboard!
        </h2>
        <p className="text-muted fs-4 text-center my-5">
          VPASS is a cloud application for generating and saving passwords. It
          helps you to create and store secure passwords for all your online and
          offline accounts
        </p>
        <div className="text-center">
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
