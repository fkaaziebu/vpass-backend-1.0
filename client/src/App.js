import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home/index";
import Dashboard from "./scenes/dashboard/index";
import Navbar from "./scenes/global/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "../src/state/index";

function App() {
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const errors = useSelector((state) => state.auth.errorMessage);
  const success = useSelector((state) => state.auth.successMessage);
  const dispatch = useDispatch();

  return (
    <div id="wrapper" className="container-fluid p-0 bg-light">
      <div className="error-component d-flex flex-column align-items-end justify-content-center">
        {Object.values(errors).map((err) => {
          return (
            <div
              className="alert alert-danger alert-dismissible fade show m-0"
              role="alert"
              key={err}
            >
              <p className="m-0 me-5">{err}</p>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                onClick={() => {
                  dispatch(setErrorMessage({}));
                }}
              ></button>
            </div>
          );
        })}
        {Object.values(success).map((scs) => {
          return (
            <div
              className="alert alert-success alert-dismissible fade show m-0"
              role="alert"
              key={scs}
            >
              <p className="m-0 me-5">{scs}</p>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                onClick={() => {
                  dispatch(setSuccessMessage({}));
                }}
              ></button>
            </div>
          );
        })}
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={!isAuth ? <Home /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
