import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SatellitePass } from "../interfaces/SatelitePass";

interface Props {
  data: SatellitePass[];
}

export const SatellitePassTable: React.FC<Props> = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center" colSpan={3}>
              Rise
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Time (local)</TableCell>
            <TableCell>Duration (mins)</TableCell>
            <TableCell>Azimuth (degrees)</TableCell>
            <TableCell>Cloud Cover (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((d) => (
            <TableRow key={d.name + d.riseDatetime.toISOString()}>
              <TableCell>{d.name} </TableCell>
              <TableCell>{d.riseDatetime.toLocaleString()} </TableCell>
              <TableCell>
                {d.setDatetime !== undefined
                  ? (d.setDatetime.valueOf() - d.riseDatetime.valueOf()) /
                    1000 /
                    60
                  : "-"}
              </TableCell>
              <TableCell>{d.riseAzimuth} </TableCell>
              <TableCell>{d.cloudCover || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
