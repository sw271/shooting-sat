import {
  useQuery,
  gql,
} from "@apollo/client";
import {
  EEventType,
  IGetEventsPayload,
} from "../interfaces/ISatelliteEvent";
import { ISatellitePass } from "../interfaces/ISatellitePass";
import { SatellitePassTable } from "../components/SatellitePassTable";
import { useEffect } from "react";
import { Map, Marker } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import { ILocation } from "../interfaces/ILocation";
import { AppBar, Box, Container, Toolbar } from "@mui/material";


const GET_EVENTS = gql`
  query GetEvents($lat: Float!, $lng: Float!, $dateFromIncUtc: String) {
    getEvents(
      input: { lat: $lat, lng: $lng, dateFromIncUtc: $dateFromIncUtc }
    ) {
      dateFromIncUtc
      dateToExcUtc
      satelliteEvents {
        satelliteId
        events {
          dateUtc
          type
          azimuth
          altitude
        }
      }
    }
  }
`;

interface Props2 {
  location: ILocation;
}
const App: React.FC<Props2> = (props) => {
  useEffect(() => {
    if (data) {
      const firstDate = new Date(data.getEvents.dateFromIncUtc).valueOf();
      const lastDate = new Date(data.getEvents.dateToExcUtc).valueOf();
      if (lastDate - firstDate < 1000 * 60 * 60 * 24) {
        fetchMore({
          variables: {
            lat: props.location.latitude,
            lng: props.location.longitude,
            dateFromIncUtc: data.getEvents.dateToExcUtc,
          },
        });
      }
    }
  });
  const { loading, error, data, fetchMore } = useQuery<{
    getEvents: IGetEventsPayload;
  }>(GET_EVENTS, {
    variables: {
      lat: props.location.latitude,
      lng: props.location.longitude,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  console.log(data);
  const passes: ISatellitePass[] = [];
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
        passes.push({
          name: sat.satelliteId,
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

  return (
    <div>
      <AppBar
        position="sticky"
      >
        <Map
          provider={stamenToner}
          height={300}
          defaultCenter={[props.location.latitude, props.location.longitude]} defaultZoom={18}
        >
          <Marker width={50} anchor={[props.location.latitude, props.location.longitude]} />
        </Map>
      </AppBar>
      <Container>
        <Box sx={{ my: 2 }}>
          <App location={props.location} />
        </Box>
      </Container>
    </div>
  )
};

