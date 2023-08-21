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
import api from "../../api/configApi.js";
import { getMe } from "../features/authSlice";
import Swal from "sweetalert2";

const HardwareDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isError } = useSelector((state) => state.auth);

  // console.log(user);

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

  const [hardwareDetails, setHardwareDetail] = useState([]);

  useEffect(() => {
    getHardwareDetails();
  }, []);

  const getHardwareDetails = async () => {
    const response = await api.get(`/hardware-details`);
    setHardwareDetail(response.data);
  };

  const Delete = async (id) => {
    if (user && user.user.role_id === 1) {
      await api.delete(`/hardware-details/hard/${id}`).then((response) => {
        console.log(response);
      });
    } else if (user && user.user.role_id === 2) {
      await api.delete(`/hardware-details/soft/${id}`).then((response) => {
        console.log(response);
      });
    }
  };

  const deleteHardwareDetail = (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this hardware detail?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f29727",
        cancelButtonColor: "#48ca40",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Delete(id);
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Hardware Detail has been deleted.",
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
      field: "id",
      headerName: "ID",
      flex: 0.1,
      cellClassName: "id",
    },
    {
      field: "hardware",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.hardware,
      headerName: "Hardware",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "location",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.location,
      headerName: "Location",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "timezone",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.timezone,
      headerName: "Time Zone",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "local_time",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.local_time,
      headerName: "Local Time",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "latitude",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.latitude,
      headerName: "Latitude",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "longitude",
      valueGetter: (hardwareDetails) => hardwareDetails.row.hardware.longitude,
      headerName: "Longitude",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "sensor",
      valueGetter: (hardwareDetails) => hardwareDetails.row.sensor.sensor,
      headerName: "Sensor",
      flex: 0.1,
      cellClassName: "name-column--cell",
    },
    {
      field: "sensor_name",
      valueGetter: (hardwareDetails) => hardwareDetails.row.sensor.sensor_name,
      headerName: "Sensor Name",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "Edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: ({ row: { id } }) => {
        return (
          <Link to={`/editHardwareDetail/${id}`}>
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
            renderCell: ({ row: { id } }) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    deleteHardwareDetail(id);
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

  return (
    <Box m="20px">
      <Header title=" Hardware Detail" subtitle="List of Hardware Detail" />
      {user && user.user.role_id !== 3 && (
        <Button variant="contained" color="success" href="./addHardwareDetail">
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
          rows={hardwareDetails}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default HardwareDetail;
