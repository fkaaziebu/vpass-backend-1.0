import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home/index";
import Dashboard from "./scenes/dashboard/index";
import Navbar from "./scenes/global/Navbar";
import CreatePass from "./scenes/create-password";
import { useDispatch, useSelector } from "react-redux";
import Password from "./scenes/view-password";
import { setErrorMessage } from "../src/state/index";

function App() {
  // const isAuth = Boolean(useSelector((state) => state.auth.user));
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const error = useSelector((state) => state.auth.errorMessage);
  const dispatch = useDispatch();

  return (
    <div id="wrapper" className="container-fluid p-0 bg-light">
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show fs-5 p-2 text-center container-fluid"
          role="alert"
        >
          {error}
          <button
            type="button"
            class="btn-close p-2"
            aria-label="Close"
            onClick={() => {
              dispatch(setErrorMessage(""));
            }}
          ></button>
        </div>
      )}
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
