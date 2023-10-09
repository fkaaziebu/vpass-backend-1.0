import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  passwordListing,
  setErrorMessage,
  setSuccessMessage,
  userAuth,
} from "../../state/index";
import { Box, LinearProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ViewModal from "./ViewModal";
import DeleteModal from "./DeleteModal";
import OTPModal from "./OTPModal";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function PasswordListing() {
  const passwords = useSelector((state) => state.auth.passwords);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passId, setPassId] = useState("");
  const [modalId, setModalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFetchPassword() {
    setIsLoading(true);
    try {
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
      dispatch(setErrorMessage({}));
    } catch (err) {
      if (err.response) {
        dispatch(setErrorMessage({ message: err.response.data.message }));
        dispatch(setSuccessMessage({}));
        dispatch(userAuth({}));
        navigate("/");
      } else if (err.request) {
        dispatch(setErrorMessage({ message: "Network error, reconnect" }));
      } else {
        dispatch(setErrorMessage({ message: err.message }));
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    handleFetchPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      cellClassName: "description-column--cell",
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      flex: 2,
      cellClassName: "created-column--cell",
      renderCell: ({ row: { createdAt } }) => {
        return (
          <>
            <div>{dayjs(createdAt).fromNow()}</div>
          </>
        );
      },
    },
    {
      field: "view-delete",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row: { id } }) => {
        return (
          <>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
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
                  setModalId("2");
                }}
              >
                <Typography color={"#ffffff"}>
                  <VisibilityIcon
                    sx={{
                      fontSize: "2rem",
                    }}
                  />
                </Typography>
              </Box>
            </button>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
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
                  setModalId("4");
                }}
              >
                <Typography color={"#ffffff"}>
                  <DeleteOutlineIcon
                    sx={{
                      fontSize: "2rem",
                    }}
                  />
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
      <div className="d-flex justify-content-between">
        <h3 className="text-deepblue">All Passwords</h3>
        <button
          className="btn btn-deepblue rounded-pill pe-4 text-light fs-3 d-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal3"
        >
          <AddIcon
            sx={{
              fontSize: "40px",
            }}
          />{" "}
          New
        </button>
      </div>
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
          "& .description-column--cell": {
            color: "#2e7c67",
            fontSize: "1.5rem",
          },
          "& .created-column--cell": {
            color: "#0c134f",
            fontSize: "1rem",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
            fontSize: "1.7rem",
            color: "#0c134f",
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
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: LinearProgress,
          }}
          loading={isLoading}
        />
      </Box>

      {/* View Modal */}
      <ViewModal passId={passId} />

      {/* Delete Modal */}
      <DeleteModal passId={passId} />

      {/* OTP Sending Modal */}
      <OTPModal passId={passId} modalId={modalId} />
    </div>
  );
}

export default PasswordListing;

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton
        sx={{
          color: "#0c134f",
        }}
      />
      <GridToolbarFilterButton
        sx={{
          color: "#0c134f",
        }}
      />
    </GridToolbarContainer>
  );
};
