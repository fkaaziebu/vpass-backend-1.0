import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Password() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState({ password: "*".repeat(31) });

  async function loadPassword() {
    const response = await axios.get(
      "http://localhost:3001/api/1.0/password/" + id + "/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.data.password;
    setPassword(data);
  }

  useEffect(() => {
    try {
      loadPassword();
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <div className="d-flex justify-content-between bg-white rounded-5 p-4">
        <h1 className="display-5">View or delete this password</h1>
      </div>
      <div className="d-flex flex-column justify-content-between bg-white rounded-5 p-4 my-5">
        <form>
          <div className="mb-3">
            <label htmlFor="description" className="form-label fs-2">
              Description
            </label>
            <input
              type="text"
              className="form-control fs-3"
              id="description"
              value={password.description}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fs-2">
              Password
            </label>
            <input
              type="text"
              className="form-control fs-3"
              id="password"
              value={password.password}
              disabled
            />
          </div>
          <div className="d-grid mt-3">
            <button type="button" className="btn btn-info mt-3 fs-4">
              View Password
            </button>
          </div>
          <div className="d-grid mt-3">
            <button type="button" className="btn btn-danger mt-3 fs-4">
              Delete Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Password;
