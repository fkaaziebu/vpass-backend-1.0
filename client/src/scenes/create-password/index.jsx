import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import generateString from "./generateString";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setErrorMessage,
  setSuccessMessage,
  passwordListing,
} from "../../state/index";

function CreatePass() {
  // eslint-disable-next-line no-unused-vars
  const [_, setPasswordT] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createPassValues = {
    description: "",
    password: "",
    length: 4,
    numeric: true,
    uppercase: false,
    lowercase: false,
    symbols: false,
  };

  const loginValuesValidation = Yup.object().shape({
    description: Yup.string().required("Password description required"),
    password: Yup.string().required("Password is required"),
    length: Yup.number(),
    numeric: Yup.boolean(),
    uppercase: Yup.boolean(),
    lowercase: Yup.boolean(),
    symbols: Yup.boolean(),
  });

  async function handleFetchPassword() {
    const response = await axios.get(
      "https://vpass-backend.onrender.com/api/1.0/passwords/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.data.passwords;
    dispatch(passwordListing(data));
  }

  const handleSubmit = async (values) => {
    const { description, password } = values;
    setIsLoading(true);
    try {
      await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/users/create-password/" +
          user.id,
        {
          description,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSuccessMessage({ message: "Password created successfully" }));
      handleFetchPassword();
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
      navigate("/");
    }
    setIsLoading(false);
    values.description = "";
    values.password = "";
    values.length = 4;
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-3" id="exampleModalLabel">
          Create Password
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <div className="d-flex justify-content-center align-items-center flex-column">
        <Formik
          initialValues={createPassValues}
          validationSchema={loginValuesValidation}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="d-flex justify-content-center container-fluid container-md p-0 p-md-3">
              <fieldset className="d-flex flex-column">
                <div className="mb-1">
                  <label htmlFor="description" className="form-label fs-5">
                    Password Description
                  </label>
                  <Field
                    name="description"
                    type="text"
                    className="form-control fs-3"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="description"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fs-5">
                    Generated Password
                  </label>
                  <Field
                    name="password"
                    type="text"
                    className="form-control fs-3"
                    disabled
                  />
                  <ErrorMessage
                    component="div"
                    className="text-danger"
                    name="password"
                  />
                </div>

                <div className="d-flex mb-3 align-items-center">
                  <label for="length" className="form-label fs-5 me-3">
                    Length
                  </label>
                  <Field
                    name="length"
                    type="range"
                    min="4"
                    max="32"
                    className="form-range fs-3 mx-3"
                  />
                  <span className="input-group-text ms-3">{values.length}</span>
                </div>
                <div className="d-flex mb-3 justify-content-start align-items-center form-check form-switch ps-0">
                  <Field
                    name="numeric"
                    id="numeric"
                    type="checkbox"
                    role="switch"
                    className="form-check-input fs-3 ms-0"
                  />
                  <label for="numeric" className="form-check-label fs-5 ms-3">
                    Include numbers
                  </label>
                </div>
                <div className="d-flex mb-3 justify-content-start align-items-center form-check form-switch ps-0">
                  <Field
                    name="uppercase"
                    id="uppercase"
                    type="checkbox"
                    role="switch"
                    className="form-check-input fs-3 ms-0"
                  />
                  <label for="uppercase" className="form-check-label fs-5 ms-3">
                    Include uppercase letters
                  </label>
                </div>
                <div className="d-flex mb-3 justify-content-start align-items-center form-check form-switch ps-0">
                  <Field
                    name="lowercase"
                    id="lowercase"
                    type="checkbox"
                    role="switch"
                    className="form-check-input fs-3 ms-0"
                  />
                  <label for="lowercase" className="form-check-label fs-5 ms-3">
                    Include lowercase letters
                  </label>
                </div>
                <div className="d-flex mb-3 justify-content-start align-items-center form-check form-switch ps-0">
                  <Field
                    name="symbols"
                    id="symbols"
                    type="checkbox"
                    role="switch"
                    className="form-check-input fs-3 ms-0"
                  />
                  <label for="symbols" className="form-check-label fs-5 ms-3">
                    Include symbols
                  </label>
                </div>
                <div className="d-grid mt-3">
                  <button
                    type="button"
                    className="btn btn-info mt-3 fs-5"
                    onClick={() => {
                      setPasswordT(
                        generateString(values.length, {
                          numeric: values.numeric,
                          lowercase: values.lowercase,
                          uppercase: values.uppercase,
                          symbols: values.symbols,
                        })
                      );

                      values.password = generateString(values.length, {
                        numeric: values.numeric,
                        lowercase: values.lowercase,
                        uppercase: values.uppercase,
                        symbols: values.symbols,
                      });
                    }}
                  >
                    Generate Password
                  </button>
                </div>

                <div className="d-grid mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary fs-4"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    {isLoading ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreatePass;
