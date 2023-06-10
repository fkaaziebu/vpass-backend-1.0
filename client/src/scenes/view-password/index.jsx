import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setErrorMessage, setSuccessMessage } from "../../state/index";

function Password() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({ password: "*".repeat(31) });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadPassword() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://vpass-backend.onrender.com/api/1.0/password/" +
          id +
          "/" +
          user.id,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.data.password;
      setPassword(data);
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
      navigate("/");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadPassword();
    dispatch(setErrorMessage(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = async () => {
    try {
      await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/otp/" + id + "/" + user.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSuccessMessage({ message: "OTP code sent successfully" }));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
  };

  const verifyOTP = async () => {
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

      const data = await response.data.password;
      setPassword(data);
      setOtp("");
      dispatch(setSuccessMessage({ message: "OTP code verified" }));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
    setIsLoading(false);
  };

  const deletePassword = async () => {
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
      navigate("/dashboard");
      dispatch(setSuccessMessage({ message: "Password Deleted Successfully" }));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
    setIsLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      {/* Modal */}
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
                Enter OTP sent to your Email
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOTP();
              }}
            >
              <div className="modal-body">
                <div className="my-3">
                  <label htmlFor="otp" className="form-label fs-2">
                    OTP
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
                  type="submit"
                  className="btn btn-primary fs-4"
                  data-bs-dismiss="modal"
                >
                  Send OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal 2 */}
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
                Enter OTP sent to your Email
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                deletePassword();
              }}
            >
              <div className="modal-body">
                <div className="my-3">
                  <label htmlFor="otp" className="form-label fs-2">
                    OTP
                  </label>
                  <input
                    type="text"
                    className="form-control fs-3"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <p className="text-muted">
                    If you consent to deleting your password, please enter the
                    OTP sent to your email and press delete
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-danger fs-4"
                  data-bs-dismiss="modal"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between bg-white rounded-5 p-4">
        <h1 className="display-5">View or delete this password</h1>
      </div>
      <div className="d-flex flex-column justify-content-between bg-white rounded-5 p-4 my-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendOTP();
          }}
        >
          <div className="mb-3">
            <label htmlFor="description" className="form-label fs-2">
              Description
            </label>
            <input
              type="text"
              className="form-control fs-3"
              id="description"
              value={password.description}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fs-2">
              Password
            </label>
            <input
              type="text"
              className="form-control fs-3"
              id="password"
              value={password.password}
              disabled
            />
          </div>
          <div className="d-grid mt-3">
            <button
              type="submit"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="btn btn-info mt-3 fs-4"
            >
              {isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "View Password"
              )}
            </button>
          </div>
          <div className="d-grid mt-3">
            <button
              type="submit"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
              className="btn btn-danger mt-3 fs-4"
            >
              {isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Delete Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Password;
