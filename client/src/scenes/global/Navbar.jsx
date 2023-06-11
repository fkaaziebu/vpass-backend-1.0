import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userAuth } from "../../state/index";
import VpassLogo from "../../images/vpass-logo.png";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand-lg bg-light p-0">
      <div className="container-fluid">
        <Link className="d-flex align-items-center navbar-brand fw-bold fs-1" to="/">
          <img
            className="img-fluid w-15 border rounded-pill me-3"
            src={VpassLogo}
            alt="Vpass Logo"
          />
          <h1 className="display-6 m-0">VPASS</h1>
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
                      onClick={() => {
                        dispatch(userAuth({}));
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
