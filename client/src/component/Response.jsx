import React from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Response() {
  const notify = () => toast("Wow so easy !");
  return (
    <div>
      <button className="btn btn-primary" onClick={notify}>Notify !</button>
      <ToastContainer />
    </div>
  );
}

export default Response;
