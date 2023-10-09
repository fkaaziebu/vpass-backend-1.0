import React, { Fragment, useEffect, useRef, useState } from "react";
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
  const inputRef = useRef(null);
  let currentOTPIndex = 0;

  const handleChange = (e) => {
    const { value } = e.target;

    if (!value) {
      setActiveOTPIndex(currentOTPIndex - 1);
    } else {
      setActiveOTPIndex(currentOTPIndex + 1);
      otp[currentOTPIndex] = value.substring(value.length - 1);
      setOtp([...otp]);
    }
  };

  const handleOnKeyDown = (e, index) => {
    const { key } = e;
    currentOTPIndex = index;
    if (key === "Backspace") {
      setActiveOTPIndex(currentOTPIndex - 1);
      otp[currentOTPIndex] = "";
      setOtp([...otp]);
    }
  };

  const handlePaste = async (e) => {
    const text = e.clipboardData.getData("text");
    const newOTP = [...otp];
    await navigator.clipboard.writeText(text.charAt(0));
    for (let i = 0; i < text.length; i++) {
      newOTP[i] = text.charAt(i);
    }
    setOtp([...newOTP]);
  };

  const sendOTP = async (id) => {
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
      if (err.response) {
        dispatch(setErrorMessage({ message: err.response.data.message }));
      } else if (err.request) {
        dispatch(setErrorMessage({ message: "Network error, reconnect" }));
      } else {
        dispatch(setErrorMessage({ message: err.message }));
      }
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [activeOTPIndex]);

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
        { otp: otp.join("") },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = response?.data?.password;
      setPassword(data);
      setOtp(new Array(6).fill(""));
      dispatch(setSuccessMessage({ message: "OTP code verified" }));
    } catch (err) {
      if (err.response) {
        dispatch(setErrorMessage({ message: err.response.data.message }));
      } else if (err.request) {
        dispatch(setErrorMessage({ message: "Network error, reconnect" }));
      } else {
        dispatch(setErrorMessage({ message: err.message }));
      }
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
      id="exampleModal2"
      tabindex="-1"
      aria-labelledby="exampleModal2Label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h1 className="modal-title fs-3" id="exampleModal2Label">
              View Password
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setOtp(new Array(6).fill(""));
                setPassword("");
                setIsCopy(false);
              }}
            ></button>
          </div>
          <div className="modal-body">
            <div className="my-3">
              <div className="my-3">
                <p className="text-muted my-3">
                  Enter the verification code sent to your email in the field
                  and click on view below
                </p>
              </div>

              <div className="d-flex my-3">
                {otp.map((_, index) => {
                  return (
                    <Fragment key={index}>
                      <input
                        ref={index === activeOTPIndex ? inputRef : null}
                        type="number"
                        onChange={handleChange}
                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                        onPaste={handlePaste}
                        value={otp[index]}
                        className="form-control mx-1 fs-2"
                        disabled={password.password}
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

            <div className="my-3">
              {!password.password && (
                <a
                  href="#home"
                  alt="resend code"
                  onClick={async (e) => {
                    e.preventDefault();
                    await sendOTP(passId);
                  }}
                  disabled={password.password}
                >
                  Didn't get a code? Click to resend
                </a>
              )}
            </div>
          </div>
          <div className="row g-1 modal-footer border-0">
            <button
              type="button"
              className="btn btn-deepblue text-light fs-4 col"
              data-bs-dismiss="modal"
              onClick={() => {
                setOtp(new Array(6).fill(""));
                setPassword("");
                setIsCopy(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-violet text-light fs-4 col"
              disabled={password.password}
              onClick={async () => {
                await viewPassword(passId);
              }}
            >
              {!isLoading ? (
                "View"
              ) : (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
