import React, { Fragment, useEffect, useRef, useState } from "react";
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
        console.log(err.request);
        dispatch(setErrorMessage({ message: "Network error, reconnect" }));
      } else {
        dispatch(setErrorMessage({ message: err.message }));
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

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
        { otp: otp.join("") },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSuccessMessage({ message: "Password Deleted Successfully" }));
      await handleFetchPassword();
    } catch (err) {
      if (err.response) {
        dispatch(setErrorMessage({ message: err.response.data.message }));
      } else if (err.request) {
        console.log(err.request);
        dispatch(setErrorMessage({ message: "Network error, reconnect" }));
      } else {
        dispatch(setErrorMessage({ message: err.message }));
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal4"
      tabindex="-1"
      aria-labelledby="exampleModal4Label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h1 className="modal-title fs-3" id="exampleModal4Label">
              Delete Password
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="my-3">
              <p className="text-muted my-3">
                If you consent to deleting your password, please enter the
                verification code sent to your email in the field below and
                press delete
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
                    />
                  </Fragment>
                );
              })}
            </div>
            <div className="mt-3">
              <a
                href="#home"
                alt="resend code"
                onClick={async (e) => {
                  e.preventDefault();
                  await sendOTP(passId);
                }}
              >
                Didn't get a code? Click to resend
              </a>
            </div>
          </div>
          <div className="row g-1 modal-footer border-0">
            <button
              type="button"
              className="btn text-light fs-4 col"
              style={{
                background: "#0C134F",
              }}
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-danger fs-4 col"
              data-bs-dismiss="modal"
              onClick={async () => {
                await deletePassword(passId);
                setOtp(new Array(6).fill(""));
              }}
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
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
