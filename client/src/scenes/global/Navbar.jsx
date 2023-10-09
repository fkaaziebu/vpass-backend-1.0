import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setSuccessMessage,
  setErrorMessage,
  userAuth,
} from "../../state/index";
import VpassLogo from "../../images/vpass-no-background.png";
import axios from "axios";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const sessionLogout = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/1.0/logout");

      console.log(response);

      dispatch(userAuth(response.data));
      dispatch(setErrorMessage({}));
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

  return (
    <nav className="navbar navbar-expand-lg bg-light p-0">
      <div className="container-fluid">
        <Link
          className="d-flex align-items-center navbar-brand m-0 mw-50"
          to="/"
        >
          <img className="img-fluid w-15" src={VpassLogo} alt="Vpass Logo" />
        </Link>
        {user?.token && (
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user.username && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle p-2 mx-2 fs-3"
                  href="#home"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.username}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item p-2 mx-2 fs-3"
                      onClick={async () => {
                        await sessionLogout();
                        dispatch(userAuth({}));
                        dispatch(
                          setSuccessMessage({ message: "Logout successful" })
                        );
                      }}
                      href="#home"
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
