import { TableCell, Tooltip, Typography } from "@mui/material";
import prettyMilliseconds from "pretty-ms";
import { useEffect, useState } from "react";

interface Props {
  to: number;
}
const generateLabel = (time: number) => time < 0 ? "now" : prettyMilliseconds(time, { compact: true });
const MS_1SEC = 1000;
const MS_1MIN = MS_1SEC * 60;
const MS_1HR = MS_1MIN * 60;
const MS_1DAY = MS_1HR * 24;

export const UpdatingTableCell: React.FC<Props> = (props) => {
  const [timeleft, setTimeleft] = useState(props.to - Date.now());
  useEffect(() => {
    // let interval: NodeJS.Timeout | null = null;
    if (timeleft > 0) {
      let timems: number;
      if (timeleft > MS_1DAY + MS_1HR) {
        timems = MS_1HR;
      }
      else if (timeleft > MS_1HR + 10 * MS_1MIN) {
        timems = 10 * MS_1MIN;
      }
      else if (timeleft > MS_1MIN) {
        timems = MS_1MIN;
      }
      else {
        timems = MS_1SEC;
      }
      console.log("Creating interval with:", timems)

      const interval = setInterval(() => {
        console.log("executing interval")
        setTimeleft(props.to - Date.now());
      }, timems);
      return () => clearInterval(interval);
    }

    // const timer = setTimeout(() => {
    //   console.log("Updating timeleft")
    //   setTimeleft(props.to - Date.now());
    // }, 1000);
    // return () => clearTimeout(timer);
  }, [timeleft])
  return <TableCell>
    <Tooltip title={new Date(props.to).toLocaleString()}>
      <Typography>
        {generateLabel(timeleft)}

      </Typography>
    </Tooltip></TableCell>
}