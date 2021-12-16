import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ISatellitePass } from "../models/ISatellitePass";
import prettyMilliseconds from "pretty-ms";

interface Props {
  data: ISatellitePass[];
}

export const SatellitePassTable: React.FC<Props> = (props) => {
  const timeNow = Date.now();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell>In</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Expected Cloud Cover (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((d) => {
            const timeUntil = d.riseDatetime.valueOf() - timeNow;
            const duration = d.setDatetime.valueOf() - d.riseDatetime.valueOf();
            return (
              <TableRow key={d.name + d.riseDatetime.toISOString()}>
                <TableCell>{timeUntil < 0 ? "now" : prettyMilliseconds(timeUntil, { compact: true })}</TableCell>
                <TableCell>{d.name} </TableCell>
                <TableCell>{prettyMilliseconds(duration, { compact: true })}</TableCell>
                <TableCell>{"-"}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
