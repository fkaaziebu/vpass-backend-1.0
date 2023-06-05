import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home/index";
import Dashboard from "./scenes/dashboard/index";
import Navbar from "./scenes/global/Navbar";
import CreatePass from "./scenes/create-password";
import { useSelector } from "react-redux";
import Password from "./scenes/view-password";

function App() {
  // const isAuth = Boolean(useSelector((state) => state.auth.user));
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const error = useSelector((state) => state.auth.errorMessage);

  return (
    <div id="wrapper" className="container-fluid p-0 bg-light">
      <BrowserRouter>
        <Navbar />
        {error && (
          <div className="d-flex align-items-center justify-content-center container-fluid">
            <p className="text-danger fs-4 w-75 text-center border border-3 p-3">
              {error}
            </p>
          </div>
        )}
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
