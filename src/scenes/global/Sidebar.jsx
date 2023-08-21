import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EdgesensorHighOutlinedIcon from "@mui/icons-material/EdgesensorHighOutlined";
import HardwareOutlinedIcon from "@mui/icons-material/HardwareOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const { user } = useSelector((state) => state.auth);
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[500]} !important`,
          display: isMobile && isCollapsed ? "none" : "block",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 33px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#d1a362 !important",
        },
        "& .pro-menu-item.active": {
          color: "#b58d53 !important",
        },
        height: isMobile ? "940px" : "full-height",
      }}
    >
      <ProSidebar
        sx={{
          height: isMobile ? "940px" : "full-height",
        }}
        collapsed={isMobile || isCollapsed}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  TATONAS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                ></Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box
            paddingLeft={isMobile ? undefined : isCollapsed ? undefined : "10%"}
          >
            <Item
              title="Report"
              to="/report"
              icon={<DescriptionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Sensor"
              to="/sensors"
              icon={<EdgesensorHighOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Hardware"
              to="/hardware"
              icon={<HardwareOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Hardware Detail"
              to="/hardwareDetail"
              icon={<DisplaySettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
