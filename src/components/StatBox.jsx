import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ location, coordinate, lastSend, maxValue, minValue }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {location}
          </Typography>
        </Box>
      </Box>
      <Box display="grid" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.grey[100] }}>
          {coordinate}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: colors.grey[100] }}
        >
          {lastSend}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: colors.grey[100] }}
        >
          {maxValue}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: colors.grey[100] }}
        >
          {minValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
