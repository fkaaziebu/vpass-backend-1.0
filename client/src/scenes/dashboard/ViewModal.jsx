import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "../../state/index";

function ViewModal({ passId }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState({});
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  // Viewing Password
  const viewPassword = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/otp/" +
          id +
          "/" +
          user.id +
          "/" +
          "verify",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = response?.data?.password;
      setPassword(data);
      setOtp("");
      dispatch(setSuccessMessage({ message: "OTP code verified" }));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
    setIsLoading(false);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-3" id="exampleModalLabel">
              View Password
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setOtp("");
                setPassword("");
              }}
            ></button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await viewPassword(passId);
            }}
          >
            <div className="modal-body">
              <div className="my-3">
                <div className="my-3">
                  <p className="text-muted">
                    Enter the verification token sent to your email in the field
                    below
                  </p>
                </div>
                <label htmlFor="otp" className="form-label fs-4">
                  Verification Code
                </label>
                <input
                  type="text"
                  className="form-control fs-3"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={password.password}
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  className="form-control fs-3"
                  id="otp"
                  value={password.password ? password.password : "*".repeat(31)}
                  disabled
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn text-light fs-4"
                style={{
                  background: "#0C134F",
                }}
                data-bs-dismiss="modal"
                onClick={() => {
                  setOtp("");
                  setPassword("");
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary fs-4"
                disabled={password.password}
              >
                {!isLoading ? (
                  "Verify"
                ) : (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
