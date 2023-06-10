import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home/index";
import Dashboard from "./scenes/dashboard/index";
import Navbar from "./scenes/global/Navbar";
import CreatePass from "./scenes/create-password";
import { useDispatch, useSelector } from "react-redux";
import Password from "./scenes/view-password";
import { setErrorMessage, setSuccessMessage } from "../src/state/index";

function App() {
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const errors = useSelector((state) => state.auth.errorMessage);
  const success = useSelector((state) => state.auth.successMessage);
  const dispatch = useDispatch();

  return (
    <div id="wrapper" className="container-fluid p-0 bg-light">
      {Object.values(errors).map((err) => {
        return (
          <div
            className="alert alert-danger alert-dismissible fade show fs-5 p-2 m-0 text-center container-fluid"
            role="alert"
          >
            {err}
            <button
              type="button"
              class="btn-close p-2"
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
            className="alert alert-success alert-dismissible fade show fs-5 p-2 text-center container-fluid"
            role="alert"
          >
            {scs}
            <button
              type="button"
              class="btn-close p-2"
              aria-label="Close"
              onClick={() => {
                dispatch(setSuccessMessage({}));
              }}
            ></button>
          </div>
        );
      })}
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
          <Route
            path="/create-password"
            element={isAuth ? <CreatePass /> : <Navigate to="/" />}
          />
          <Route
            path="/view-password/:id"
            element={isAuth ? <Password /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
