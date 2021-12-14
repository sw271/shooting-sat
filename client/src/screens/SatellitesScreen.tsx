import {
  useQuery,
  gql,
  useApolloClient,
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
import { AppBar, Box, Button, ButtonGroup, Container, Toolbar } from "@mui/material";
import { ZOOM_WHEN_LOCATED } from "./LocationScreen";
import { Location } from "../models/Location"
import { mutations } from "../operations/mutations";
import { InvariantError } from "@apollo/client/utilities/globals";

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
  location: Location;
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
        })
          .catch(e => {
            if (e instanceof InvariantError) {
              if (e.message === "Store reset while query was in flight (not completed in link chain)") {
                // pass: this is ok, we have probably hit the "forgert me button"
                console.log("Error caught while restting store");
                return;
              }
            }
            throw e;
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
  location: Location;
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
          onClick={() => mutations.setShowLocationScreen(true)}
        >Change Location</Button>
      </ButtonGroup>
      <AppBar
        position="sticky"
      >
        <Map
          provider={stamenToner}
          height={300}
          defaultCenter={[props.location.latitude, props.location.longitude]} defaultZoom={ZOOM_WHEN_LOCATED}
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

