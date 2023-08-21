import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/laporan";
import Sensor from "./scenes/sensor";
import AddSensor from "./scenes/sensor/addSensor";
import EditSensor from "./scenes/sensor/editSensor";
import Hardware from "./scenes/hardware";
import AddHardware from "./scenes/hardware/addHardware";
import EditHardware from "./scenes/hardware/editHardware";
import HardwareDetail from "./scenes/hardwareDetail";
import AddHardwareDetail from "./scenes/hardwareDetail/addHardwareDetail";
import EditHardwareDetail from "./scenes/hardwareDetail/editHardwareDetail";
import SignIn from "./scenes/signin";
import SignUp from "./scenes/signup";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <div>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

// Component for the authenticated app with sidebar and top bar
function AuthenticatedApp() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sensors" element={<Sensor />} />
          <Route path="/addSensor" element={<AddSensor />} />
          <Route path="/editSensor/:id" element={<EditSensor />} />
          <Route path="/hardware" element={<Hardware />} />
          <Route path="/addHardware" element={<AddHardware />} />
          <Route path="/editHardware/:id" element={<EditHardware />} />
          <Route path="/hardwareDetail" element={<HardwareDetail />} />
          <Route path="/addHardwareDetail" element={<AddHardwareDetail />} />
          <Route path="/editHardwareDetail/:id" element={<EditHardwareDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
