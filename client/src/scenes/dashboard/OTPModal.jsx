import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "../../state/index";
import vpassLogo from "../../images/vpass-favicon.png";

function OTPModal({ passId, modalId }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

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

  return (
    <div
      className="modal fade"
      id="exampleModal1"
      tabindex="-1"
      aria-labelledby="exampleModal1Label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-top">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center align-items-center border-0">
            <img
              src={vpassLogo}
              className="img-fluid w-25 border rounded-5 p-1"
              alt="VPASS logo"
            />
          </div>
          <form>
            <div className="modal-body px-3 m-0">
              <div className="m-0">
                <p className="text-muted m-0">
                  A verification token will be sent to your email. Click on the
                  confirm button to receive the token
                </p>
              </div>
            </div>
            <div className="row g-1 modal-footer border-0">
              <button
                type="button"
                className="btn btn-deepblue text-light fs-4 col"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-violet text-light fs-4 col"
                data-bs-target={`#exampleModal${modalId}`}
                data-bs-toggle="modal"
                onClick={async () => {
                  await sendOTP(passId);
                }}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OTPModal;
