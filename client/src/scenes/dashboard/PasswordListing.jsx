import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { passwordListing, setErrorMessage } from "../../state/index";

function PasswordListing() {
  const passwords = useSelector((state) => state.auth.passwords);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  async function handleFetchPassword() {
    const response = await axios.get(
      "http://localhost:3001/api/1.0/passwords/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.data.passwords;
    dispatch(passwordListing(data));
  }

  useEffect(() => {
    try {
      handleFetchPassword();
    } catch (err) {
      dispatch(setErrorMessage(err.response.data.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column justify-content-between bg-white rounded-5 p-4 mt-5">
      <div>
        <h3>All Passwords</h3>
      </div>
      <div className="line-div my-5" />
      <div className="row g-4">
        {passwords.map((password) => {
          return (
            <div key={password.id} className="col-md-6 col-xl-4">
              <Link
                to={/view-password/ + password.id}
                className="d-flex justify-content-center align-items-center  shadow p-3 bg-body rounded text-decoration-none text-dark"
              >
                <h4>{password.description}</h4>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PasswordListing;
