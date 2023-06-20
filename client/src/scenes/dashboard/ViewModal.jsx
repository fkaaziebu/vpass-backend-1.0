import React, { Fragment, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "../../state/index";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

function ViewModal({ passId }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState({});
  const [isCopy, setIsCopy] = useState(false);
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef();
  let currentOTPIndex = 0;

  const handleChange = (e) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) {
      setActiveOTPIndex(currentOTPIndex - 1);
    } else {
      setActiveOTPIndex(currentOTPIndex + 1);
    }

    setOtp(newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    const { key } = e;
    currentOTPIndex = index;
    if (key === "Backspace") {
      setActiveOTPIndex(currentOTPIndex - 1);
    }
  };

  // Viewing Password
  const viewPassword = async (id) => {
    console.log(otp.join(""));
    const otpToSend = otp.join("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/otp/" +
          id +
          "/" +
          user.id +
          "/" +
          "verify",
        { otpToSend },
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

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(password?.password);
    dispatch(setSuccessMessage({ message: "Password copied successfully" }));
    setIsCopy(true);
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
                <div className="d-flex my-3">
                  {otp.map((_, index) => {
                    return (
                      <Fragment key={index}>
                        {index + 1}
                        <input
                          ref={index === activeOTPIndex ? inputRef : null}
                          type="number"
                          onChange={handleChange}
                          onKeyDown={(e) => handleOnKeyDown(e, index)}
                          value={otp[index]}
                          className="form-control mx-1 fs-2 spin-button-none"
                          
                        />
                      </Fragment>
                    );
                  })}
                </div>
              </div>
              <div className="input-group my-3">
                <input
                  type="text"
                  className="form-control fs-3"
                  id="otp"
                  value={password.password ? password.password : "*".repeat(31)}
                  disabled
                />
                <button
                  type="button"
                  className="btn input-group-text border border-2"
                  style={{ cursor: "pointer" }}
                  id="copy"
                  disabled={!password.password}
                  onClick={handleCopy}
                >
                  {!isCopy ? <ContentCopyIcon /> : <CheckIcon />}
                </button>
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
