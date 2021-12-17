import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ISatellitePass } from "../models/ISatellitePass";
import prettyMilliseconds from "pretty-ms";
import { UpdatingTableCell } from "./UpdatingTimeTableCell";
import { mutations } from "../operations/mutations";
import { useGetSelectedSatellitePass } from "../operations/queries";

interface Props {
  data: ISatellitePass[];
}
export const SatellitePassTable: React.FC<Props> = (props) => {
  const q = useGetSelectedSatellitePass();
  const selected = q.data?.selectedSatellitePass;
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
            const duration = d.setDatetime.valueOf() - d.riseDatetime.valueOf();
            return (
              <TableRow
                key={d.name + d.riseDatetime.toISOString()}
                onClick={() => {
                  mutations.setSelectedSatellitePass(d)
                }}
                selected={selected && selected.name === d.name && selected.riseDatetime === d.riseDatetime}
              >
                <UpdatingTableCell
                  to={d.riseDatetime.valueOf()} />
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
