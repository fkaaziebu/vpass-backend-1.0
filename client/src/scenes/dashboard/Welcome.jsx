import React from "react";
import CreatePass from "../create-password";
import passLogo from "../../images/vpass-favicon.png";

function Welcome() {
  return (
    <div className="row g-4 p-4">
      {/* <div>
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
            className="btn btn-violet text-light fs-3"
          >
            Create Password
          </button>
        </div>
      </div> */}
      <div className="col-3">
        {/* Icon */}
        <button
          className="btn-deepblue border-0 rounded-5 p-4 h-100"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal3"
        >
          <div>
            <img
              src={passLogo}
              alt="Lock Logo"
              className="img-fluid w-10 mb-3"
            />
          </div>
          <div className="display-5 fw-normal text-light">
            Add a new password
          </div>
        </button>
      </div>

      <div className="col-9">
        <div className="btn-deepblue rounded-5 p-4 h-100 d-flex justify-content-center align-items-center">
          <p className="text-light fs-2 text-center">
            VPASS is a cloud application for generating and saving passwords. It
            helps you to create and store secure passwords for all your online
            and offline accounts
          </p>
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
