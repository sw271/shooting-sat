import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ISatellitePass } from "../interfaces/ISatellitePass";

interface Props {
  data: ISatellitePass[];
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
            <TableCell align="center" colSpan={3}>
              Set
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Azimuth</TableCell>
            <TableCell>Elevation</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Azimuth</TableCell>
            <TableCell>Elevation</TableCell>
            <TableCell>Cloud Cover</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((d) => (
            <TableRow key={d.name + d.rise.timestamp.toISOString()}>
              <TableCell>{d.name} </TableCell>
              <TableCell>{d.rise.timestamp.toISOString()} </TableCell>
              <TableCell>{d.rise.azimuth} </TableCell>
              <TableCell>{d.rise.elevation} </TableCell>
              <TableCell>{d.set.timestamp.toISOString()} </TableCell>
              <TableCell>{d.set.azimuth} </TableCell>
              <TableCell>{d.set.elevation} </TableCell>
              <TableCell>{d.weather.cloudCover}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
