import { useApolloClient } from "@apollo/client";
import { EEventType } from "../models/ISatelliteEvent";
import { ISatellitePass } from "../models/ISatellitePass";
import { SatellitePassTable } from "../components/SatellitePassTable";
import { AppBar, Box, Button, ButtonGroup, Container } from "@mui/material";
import { ILocation } from "../models/ILocation"
import { mutations } from "../operations/mutations";
import { useGetEvents, useGetSatellitesInfo } from "../operations/queries";
import { SatelliteMapView } from "../components/SatelliteMapView";



interface Props2 {
  location: ILocation;
}
const App: React.FC<Props2> = (props) => {
  const q = useGetSatellitesInfo();
  const { loading, error, data } = useGetEvents({
    lat: props.location.latitude,
    lng: props.location.longitude,
  });
  if (loading || q.loading) return <p>Loading...</p>;
  if (error || !data || q.error || !q.data) return <p>Error :(</p>;

  const passes: ISatellitePass[] = [];
  if (q.data) {
    data.getEvents.satelliteEvents.forEach((sat) => {
      let riseDatetime: Date | undefined = undefined;
      let riseAzimuth: number | undefined = undefined;
      sat.events.forEach((e) => {
        if (e.type === EEventType.RISE) {
          riseDatetime = new Date(e.dateUtc);
          riseAzimuth = e.azimuth;
        } else if (
          e.type === EEventType.SET &&
          riseDatetime !== undefined &&
          riseAzimuth !== undefined
        ) {
          const info = q.data?.getSatellitesInfo.info.find(x => x.id === sat.satelliteId);
          passes.push({
            name: info ? info.name : sat.satelliteId,
            riseDatetime,
            riseAzimuth,
            setDatetime: new Date(e.dateUtc),
            setAzimuth: e.azimuth,
          });
          riseDatetime = undefined;
          riseAzimuth = undefined;
        }
      });
    });
  }

  passes.sort((a, b) => a.riseDatetime.valueOf() - b.riseDatetime.valueOf());

  return (
    <div className="App">
      <SatellitePassTable data={passes} />
    </div>
  );
}

interface Props {
  location: ILocation;
  setShowLocationScreen: () => void;
}

export const SatellitesScreen: React.FC<Props> = (props) => {
  const client = useApolloClient();
  return (
    <div>
      <ButtonGroup fullWidth>
        <Button
          onClick={() => {
            mutations.setLocation(undefined);
            client.resetStore();
          }}
        >Forget Me</Button>
        <Button
          onClick={() => {
            mutations.setShowLocationScreen(true);
            client.resetStore();
          }}
        >Change Location</Button>
      </ButtonGroup>
      <AppBar
        position="sticky"
      >
        <SatelliteMapView location={props.location} />
      </AppBar>
      <Container>
        <Box sx={{ my: 2 }}>
          <App location={props.location} />
        </Box>
      </Container>
    </div>
  )
};

