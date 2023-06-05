import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userAuth } from "../../state/index";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isValidCredentials, setIsValidCredentials] = useState(true);

  const loginValues = { email: "", password: "" };

  const loginValuesValidation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:3001/api/1.0/auth", {
        ...values,
      });
      dispatch(userAuth(response.data));
      navigate("/dashboard");
    } catch (err) {
      setIsValidCredentials(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Formik
        initialValues={loginValues}
        validationSchema={loginValuesValidation}
        onSubmit={handleSubmit}
      >
        <Form>
          <fieldset className="d-flex flex-column">
            <legend className="fs-3 fw-bold mb-4">
              Login to your VPASS account
            </legend>
            {!isValidCredentials && (
              <div className="text-danger fs-4">
                Incorrect credentials, please try again
              </div>
            )}
            <div className="mb-1">
              <label htmlFor="email" className="form-label fs-5">
                Email
              </label>
              <Field name="email" type="email" className="form-control fs-3" />
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
                Login
              </button>
            </div>
          </fieldset>
        </Form>
      </Formik>
    </div>
  );
}

export default Home;
