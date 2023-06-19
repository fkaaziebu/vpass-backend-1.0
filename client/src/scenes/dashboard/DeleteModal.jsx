import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  passwordListing,
  setErrorMessage,
  setSuccessMessage,
} from "../../state/index";

function DeleteModal({ passId }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  async function handleFetchPassword() {
    const response = await axios.get(
      "https://vpass-backend.onrender.com/api/1.0/passwords/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.data.passwords;
    dispatch(passwordListing(data));
  }

  // Delete Password
  const deletePassword = async (id) => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/delete/" +
          id +
          "/" +
          user.id,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSuccessMessage({ message: "Password Deleted Successfully" }));
      await handleFetchPassword();
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
    setIsLoading(false);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal2"
      tabindex="-1"
      aria-labelledby="exampleModal2Label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-3" id="exampleModalLabel">
              Delete Password
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await deletePassword(passId);
              setOtp("");
            }}
          >
            <div className="modal-body">
              <div className="my-3">
                <div className="my-3">
                  <p className="text-muted">
                    If you consent to deleting your password, please enter the
                    Authentication code sent to your email in the field below
                    and press delete
                  </p>
                </div>
                <label htmlFor="otp" className="form-label fs-4">
                  Verification code
                </label>
                <input
                  type="text"
                  className="form-control fs-3"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-danger fs-4"
                data-bs-dismiss="modal"
              >
                {!isLoading ? (
                  "Delete"
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

export default DeleteModal;
