import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { getLabels } from "../../utils/common";

export default function FieldSelect({ title, defaultValue, values, onSelect }) {
  const handleChange = (e) => {
    onSelect({ [`${title.toLowerCase()}`]: e.target.value });
  };

  return (
    <Box>
      <FormControl sx={{ width: "100%", mb: 2 }} size="small">
        <InputLabel id="demo-select-small">{title}</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={defaultValue}
          label={title}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {values.map((value, index) => (
            <MenuItem key={index} value={value}>
              {getLabels(title)[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
