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
import { useGetLocation, useGetSelectedSatellitePass, useGetWeather } from "../operations/queries";
import { ILocation } from "../models/ILocation";

interface Props {
  data: ISatellitePass[];
  location: ILocation;
}
const HOUR_IN_SECS = 60 * 60;
export const SatellitePassTable: React.FC<Props> = (props) => {
  const q = useGetSelectedSatellitePass();
  const w = useGetWeather({ lat: props.location.latitude, lng: props.location.longitude });
  const selected = q.data?.selectedSatellitePass;

  const getCloudCover = (riseTs: number, setTs: number) => {
    if (!w.data || !w.data.getWeather || w.data.getWeather.hourly.length === 0) return "-";
    const riseTsSeconds = riseTs / 1000;
    const setTsSeconds = setTs / 1000;
    let cloud: { worst: number, best: number } | null = null;
    for (let i = 0; i < w.data.getWeather.hourly.length; i++) {
      const thisW = w.data.getWeather.hourly[i];
      if (riseTsSeconds < thisW.ref_time + HOUR_IN_SECS && setTsSeconds >= thisW.ref_time) {
        cloud = {
          best: (cloud === null || thisW.clouds < cloud.best) ? thisW.clouds : cloud.best,
          worst: (cloud === null || thisW.clouds > cloud.worst) ? thisW.clouds : cloud.worst
        }
      }
    }

    if (cloud === null) {
      return "-";
    }
    if (cloud.best === cloud.worst) return cloud.best.toString();
    return `${cloud.best}-${cloud.worst}`;
  }

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
            const riseTs = d.riseDatetime.valueOf();
            const setTs = d.setDatetime.valueOf();
            const duration = setTs - riseTs;
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
                <TableCell>{getCloudCover(riseTs, setTs)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
