import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  passwordListing,
  setErrorMessage,
  setSuccessMessage,
} from "../../state/index";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ViewModal from "./ViewModal";
import DeleteModal from "./DeleteModal";

function PasswordListing() {
  const passwords = useSelector((state) => state.auth.passwords);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passId, setPassId] = useState("");

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

  useEffect(() => {
    try {
      handleFetchPassword();
      dispatch(setErrorMessage({}));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
      dispatch(setSuccessMessage({}));
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sending of OTP
  const sendOTP = async (id) => {
    try {
      await axios.post(
        "https://vpass-backend.onrender.com/api/1.0/otp/" + id + "/" + user.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSuccessMessage({ message: "OTP code sent successfully" }));
    } catch (err) {
      dispatch(setErrorMessage({ message: err.response.data.message }));
    }
  };

  const columns = [
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    { field: "createdAt", headerName: "Date Created", flex: 2 },
    {
      field: "view-delete",
      headerName: "View / Delete",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row: { id } }) => {
        return (
          <>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="border border-0"
            >
              <Box
                m="0"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor="#0C134F"
                borderRadius="4px"
                sx={{
                  cursor: "pointer",
                }}
                onClick={async () => {
                  setPassId(id);
                  await sendOTP(id);
                }}
              >
                <Typography color={"#ffffff"}>
                  <VisibilityIcon />
                </Typography>
              </Box>
            </button>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
              className="ms-2 border border-0"
            >
              <Box
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor="#F24C3D"
                borderRadius="4px"
                sx={{
                  cursor: "pointer",
                }}
                onClick={async () => {
                  setPassId(id);
                  await sendOTP(id);
                }}
              >
                <Typography color={"#ffffff"}>
                  <DeleteOutlineIcon />
                </Typography>
              </Box>
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div className="d-flex flex-column justify-content-between bg-white rounded-5 p-4 mt-5">
      <div>
        <h3>All Passwords</h3>
      </div>
      <div className="line-div my-5" />
      <Box
        m="0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          },
          "& .name-column--cell": {
            color: "#2e7c67",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          rows={passwords}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>

      {/* View Modal */}
      <ViewModal passId={passId} />

      {/* Delete Modal */}
      <DeleteModal passId={passId} />
    </div>
  );
}

export default PasswordListing;
