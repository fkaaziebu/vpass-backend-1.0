import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  userAuth,
  setErrorMessage,
  setSuccessMessage,
} from "../../state/index";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loginValues = { email: "", password: "" };
  const registerValues = {
    username: "",
    email: "",
    password: "",
  };

  const loginValuesValidation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email required"),
    password: Yup.string().required("Password is required"),
  });

  const registerValuesValidation = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLoginSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/auth",
        {
          ...values,
        }
      );
      dispatch(userAuth(response.data));
      navigate("/dashboard");
      dispatch(setSuccessMessage({ message: "Login Successful" }));
      dispatch(setErrorMessage({}));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
      // console.log(err.data.message)
    }
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/users",
        {
          ...values,
        }
      );
      dispatch(userAuth(response.data));
      dispatch(
        setSuccessMessage({
          message:
            "User created successfully, please login with your email and password",
        })
      );
      navigate("/");
      setIsLogin(true);
    } catch (err) {
      dispatch(setErrorMessage(err.response.data.validationErrors));
      // console.log(err.data.message)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(setErrorMessage({}));
    dispatch(setSuccessMessage({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-75">
      <Formik
        initialValues={isLogin ? loginValues : registerValues}
        validationSchema={
          isLogin ? loginValuesValidation : registerValuesValidation
        }
        onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
      >
        <Form>
          <fieldset className="d-flex flex-column p-4">
            {isLogin && (
              <>
                <legend className="fs-3 fw-bold mb-4">
                  Login to your VPASS account
                </legend>
                <div className="mb-1">
                  <label htmlFor="email" className="form-label fs-5">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fs-5">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="password"
                  />
                </div>

                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-primary fs-4">
                    {isLoading ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </>
            )}

            {!isLogin && (
              <>
                <legend className="fs-3 fw-bold mb-4">
                  Create a VPASS account
                </legend>
                <div className="mb-1">
                  <label htmlFor="username" className="form-label fs-5">
                    Username
                  </label>
                  <Field
                    name="username"
                    type="username"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="username"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fs-5">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fs-5">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="password"
                  />
                </div>

                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-primary fs-4">
                    {isLoading ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </>
            )}
            <div className="mx-2 my-4">
              {isLogin && (
                <a className="" href="#home" onClick={() => setIsLogin(false)}>
                  Don't have an account yet?, Click this link to create a VPASS
                  account
                </a>
              )}
              {!isLogin && (
                <a className="" href="#home" onClick={() => setIsLogin(true)}>
                  Already have an account?, Click this link to login to your
                  VPASS account
                </a>
              )}
            </div>
          </fieldset>
        </Form>
      </Formik>
    </div>
  );
}

export default Home;
