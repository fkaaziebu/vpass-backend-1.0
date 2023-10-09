import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./scenes/home/index";
import Dashboard from "./scenes/dashboard/index";
import Navbar from "./scenes/global/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { setErrorMessage, setSuccessMessage } from "./state";


function App() {
  const dispatch = useDispatch();
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const errors = useSelector((state) => state.auth.errorMessage);
  const success = useSelector((state) => state.auth.successMessage);

  const errorMsg = (err) => {
    toast.error(err, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    dispatch(setErrorMessage({}));
  };

  const successMsg = (scs) => {
    toast.success(scs, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    dispatch(setSuccessMessage({}));
  };

  return (
    <div id="wrapper" className="container-fluid p-0 bg-light">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="toast-container position-fixed bottom-0 start-0 p-3">
        {Object.values(errors).map((err) => {
          return errorMsg(err);
        })}
        {Object.values(success).map((scs) => {
          return successMsg(scs);
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
