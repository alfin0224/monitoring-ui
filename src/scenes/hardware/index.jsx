import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../../api/configApi.js";
import { getMe } from "../features/authSlice";

const Hardware = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/signin");
    }
  }, [isError, navigate]);

  const handleClick = (event, cellValues) => {
    // console.log(cellValues.row);
  };

  const [hardwares, setHardware] = useState([]);

  useEffect(() => {
    getHardwares();
  }, []);

  const getHardwares = async () => {
    const response = await api.get(`/hardware`);
    setHardware(response.data);
  };

  const Delete = async (hardware) => {
    if (user && user.user.role_id === 1) {
      await api.delete(`/hardware/hard/${hardware}`).then((response) => {
        console.log(response);
      });
    } else if (user && user.user.role_id === 2) {
      await api.delete(`/hardware/soft/${hardware}`).then((response) => {
        console.log(response);
      });
    }
  };

  const deleteHardware = (sensor) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this hardware?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f29727",
        cancelButtonColor: "#48ca40",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Delete(sensor);
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Hardware has been deleted.",
            timer: 3000,
          }).then((result) => {
            if (result) {
              navigate(0);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "hardware",
      headerName: "Hardware",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "timezone",
      headerName: "Time Zone",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "local_time",
      headerName: "Local Time",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "latitude",
      headerName: "Latitude",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "longitude",
      headerName: "Longitude",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "Edit",
      Header: "Edit",
      flex: 0.3,
      renderCell: ({ row: { hardware } }) => {
        return (
          <Link to={`/editHardware/${hardware}`}>
            <Button
              variant="contained"
              color="warning"
              onClick={(event) => {
                handleClick(event);
              }}
            >
              <EditIcon />
            </Button>
          </Link>
        );
      },
    },
    ...(user && user.user.role_id !== 3
      ? [
          {
            field: "Delete",
            Header: "Delete",
            flex: 0.2,
            renderCell: ({ row: { hardware } }) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    deleteHardware(hardware);
                  }}
                >
                  <DeleteIcon />
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  const getRowId = (row) => row.hardware;

  return (
    <Box m="20px">
      <Header title="Hardware" subtitle="List of Hardware" />
      {user && user.user.role_id !== 3 && (
        <Button variant="contained" color="success" href="./addHardware">
          <AddIcon />
          Add Data
        </Button>
      )}
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "1px solid gray",
            textAlign: "center",
            "& .center-text": {
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            },
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "2px solid gray",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
            borderTop: "2px solid gray",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "2px solid gray",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={hardwares}
          columns={columns}
          getRowId={getRowId}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Hardware;
