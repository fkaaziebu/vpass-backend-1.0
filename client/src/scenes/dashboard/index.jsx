import React, { useEffect } from "react";
import Welcome from "./Welcome";
import PasswordListing from "./PasswordListing";
import { useDispatch } from "react-redux";
import { setErrorMessage } from "../../state/index";

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setErrorMessage(""));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container-fluid p-4">
      <div className="container-lg container-lg-fluid">
        <Welcome />
        <PasswordListing />
      </div>
    </div>
  );
}

export default Dashboard;
