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
import Swal from "sweetalert2";
import { getMe } from "../features/authSlice";

const Sensor = () => {
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

  const [sensors, setSensor] = useState([]);

  useEffect(() => {
    getSensors();
  }, []);

  const getSensors = async () => {
    const response = await api.get(`/master-sensors`);
    setSensor(response.data);
  };

  const Delete = async (sensor) => {
    if (user && user.user.role_id === 1) {
      await api.delete(`/master-sensors/hard/${sensor}`).then((response) => {
        console.log(response);
      });
    } else if (user && user.user.role_id === 2) {
      await api.delete(`/master-sensors/soft/${sensor}`).then((response) => {
        console.log(response);
      });
    }
  };

  const deleteSensor = (sensor) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this sensor?",
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
            text: "Sensor has been deleted.",
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
      field: "sensor",
      headerName: "Sensor",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "sensor_name",
      headerName: "Sensor Name",
      flex: 0.4,
      cellClassName: "name-column--cell",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0.4,
      cellClassName: "name-column--cell",
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    ...(user && user.user.role_id !== 3
      ? [
          {
            field: "Edit",
            headerName: "Edit",
            flex: 0.2,
            renderCell: ({ row: { sensor } }) => {
              return (
                <Link to={`/editSensor/${sensor}`}>
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
          {
            field: "Delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: ({ row: { sensor } }) => {
              return (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    deleteSensor(sensor);
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

  const getRowId = (row) => row.sensor;

  return (
    <Box m="20px">
      <Header title=" Master Sensor" subtitle="List of Sensor" />

      {user && user.user.role_id !== 3 && (
        <Button variant="contained" color="success" href="./addSensor">
          <AddIcon /> Add Data
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
          rows={sensors}
          columns={columns}
          getRowId={getRowId}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Sensor;
