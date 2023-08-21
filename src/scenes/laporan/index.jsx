import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/configApi.js";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { getMe } from "../features/authSlice";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF);

const getColorForSensor = (index) => {
  const colors = [
    tokens("dark").greenAccent[500],
    tokens("dark").blueAccent[300],
    tokens("dark").redAccent[200],
  ];
  return colors[index % colors.length];
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartLoaded, setChartLoaded] = useState(false);
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hardwareId, setHardwareId] = useState("");
  const [location, setLocation] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [lastSend, setLastSend] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [minValue, setMinValue] = useState("");
  const [sensorData, setSensorData] = useState([]);
  const [hardwareSensors, setHardwareSensors] = useState([]);
  const [hardwares, setHardwares] = useState([]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/signin");
    }
  }, [isError, navigate]);

  useEffect(() => {
    const getHardwareSensors = async () => {
      const response = await api.get(`/hardware-sensors`);
      setHardwareSensors(response.data);
    };

    getHardwareSensors();
  }, []);

  useEffect(() => {
    const getHardwares = async () => {
      const response = await api.get(`/hardware`);
      setHardwares(response.data);
    };

    getHardwares();
  }, []);

  const sensorNames = hardwareSensors[hardwareId] || [];

  const lineChartData = sensorNames.map((sensorName, sensorIndex) => {
    return {
      id: sensorName,
      color: getColorForSensor(sensorIndex),
      data: Object.keys(sensorData).map((dateTime) => ({
        x: dateTime,
        y: sensorData[dateTime][sensorIndex],
      })),
    };
  });

  const handleChartLoad = () => {
    setChartLoaded(true);
  };

  const exportToPDF = () => {
    // if (chartRef.current && chartLoaded) {
    // const canvas = chartRef.current.chartInstance.canvas;
    // const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();

    // doc.addImage(imgData, 'PNG', 10, 10, 190, 100);

    doc.autoTable({
      head: [["Nomor", "Local Time", ...sensorNames]],
      body: Object.keys(sensorData).map((dateTime, index) => [
        index + 1,
        dateTime,
        ...sensorData[dateTime],
      ]),
    });
    doc.save("sensor_data.pdf");
    // }
  };

  const handleSearch = () => {
    api
      .post("/data/search", {
        from_date: fromDate,
        to_date: toDate,
        hardware_id: hardwareId,
      })
      .then((response) => {
        const data = response.data;
        setLocation(data.data.Location);
        setCoordinate(data.data.Coordinate);
        setLastSend(data.data["Last Send"]);
        setMaxValue(data.data["Maximal Value"]);
        setMinValue(data.data["Minimal Value"]);
        setSensorData(data.sensor_data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/signin");
    }
  }, [isError, navigate]);

  console.log(coordinate);

  return (
    <Box
      m="20px"
      sx={{
        zoom: isMobile ? "60%" : "100%",
      }}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Report" subtitle="Welcome to admin dashboard"></Header>
        <Box></Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn={isMobile ? "span 6" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div>
            <label>Date From: </label>
            <input
              className="form-control"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </Box>
        <Box
          gridColumn={isMobile ? "span 6" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div>
            <label>Date End: </label>
            <input
              className="form-control"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </Box>
        <Box
          gridColumn={isMobile ? "span 6" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <label>Hardware: </label>
            <select
              value={hardwareId}
              onChange={(e) => setHardwareId(e.target.value)}
              className="form-control"
            >
              <option value="">Choose Hardware</option>
              {/* <option value="4001">4001</option>
              <option value="4002">4002</option>
              <option value="4003">4003</option> */}
              {hardwares.map((hardware, index) => (
                <option key={hardware.hardware} value={hardware.hardware}>
                  {hardware.hardware}
                </option>
              ))}
            </select>
          </Box>
        </Box>
        <Box
          gridColumn={isMobile ? "span 6" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <button
            onClick={handleSearch}
            className="btn btn-secondary"
          >
            Load Data
          </button>
        </Box>

        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            location={`Location: ${location}`}
            coordinate={`Coordinate: ${coordinate}`}
            lastSend={`Last Send: ${lastSend}`}
            maxValue={`Maximal Value: ${maxValue}`}
            minValue={`Minimal Value: ${minValue}`}
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              ></Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              ></Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart
              isDashboard={true}
              data={lineChartData}
              ref={chartRef}
              onLoad={handleChartLoad}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[700]}`}
            colors={colors.grey[100]}
            p="15px"
          ></Box>
          <Box className="table-responsive-md">
            <table id="sensor-table" className="table table-striped">
              <thead>
                <tr scope="row">
                  <th scope="col">Nomor</th>
                  <th scope="col">Local Time</th>
                  {sensorNames.map((sensorName, index) => (
                    <th scope="col" key={index}>
                      {sensorName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(sensorData).map((dateTime, index) => (
                  <tr key={index} scope="row">
                    <td>{index + 1}</td>
                    <td>{dateTime}</td>
                    {sensorNames.map((sensorName, sensorIndex) => (
                      <td key={sensorIndex}>
                        {sensorData[dateTime][sensorIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box p="10px" m="10px">
            <ReactHTMLTableToExcel
              id="export-excel"
              className="btn btn-success"
              table="sensor-table"
              filename="sensor-data"
              sheet="sheet1"
              buttonText="Export to Excel"
            />
            <button style={{margin: '10px'}} className="btn btn-danger" onClick={exportToPDF}>
              Export to PDF
            </button>
          </Box>
        </Box>

        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              ></Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              ></Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <GeographyChart isDashboard={true} coordinate={coordinate} />
          </Box>
        </Box>
      </Box>
      <br />
      <br />
      <br />
      <Box maxWidth="460px"></Box>
    </Box>
  );
};

export default Dashboard;
