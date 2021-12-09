import "./App.css";
// import { generateMockData } from "./mock/mockdata";
// import { SatellitePassTable } from "./components/SatellitePassTable";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
// import { ISatellitePass } from "./interfaces/ISatellitePass";
// import { SatellitePass } from "./interfaces/SatelitePass";
import {
  EEventType,
  IGetEventsPayload,
  // ISatelliteEvent,
} from "./interfaces/ISatelliteEvent";
import { ISatellitePass } from "./interfaces/ISatellitePass";
import { SatellitePassTable } from "./components/SatellitePassTable";
import { useEffect, useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import { LocationScreen } from "./screens/LocationScreen";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";


const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getEvents: {
          keyArgs: false,
          merge(existing: IGetEventsPayload, incoming: IGetEventsPayload) {
            if (!existing) return incoming;
            const ret: IGetEventsPayload = {
              ...existing,
              dateToExcUtc: incoming.dateToExcUtc,
              satelliteEvents: existing.satelliteEvents.map((x) => {
                return {
                  satelliteId: x.satelliteId,
                  events: [...x.events],
                };
              }),
            };

            incoming.satelliteEvents.forEach((e) => {
              const found = ret.satelliteEvents.find(
                (x) => x.satelliteId === e.satelliteId
              );
              if (found) {
                found.events.push(...e.events);
              } else {
                ret.satelliteEvents.push(e);
              }
            });

            return ret;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:8000",
  cache,
});

const LAT = 51.454514;
const LNG = -2.58791;

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

interface Props {
  latitude: number;
  longitude: number;
}
const App: React.FC<Props> = (props) => {
  useEffect(() => {
    if (data) {
      const firstDate = new Date(data.getEvents.dateFromIncUtc).valueOf();
      const lastDate = new Date(data.getEvents.dateToExcUtc).valueOf();
      if (lastDate - firstDate < 1000 * 60 * 60 * 24) {
        fetchMore({
          variables: {
            lat: props.latitude,
            lng: props.longitude,
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
      lat: props.latitude,
      lng: props.longitude,
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

const AppProvider2: React.FC = () => {

  const [position, setPosition] = useState<GeolocationPosition | undefined>(undefined);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("got pos", pos)
        setPosition(pos);
        // alert(`lat: ${pos.coords.latitude}, lng ${pos.coords.longitude}`)
      },
      (error) => {
        console.log("Handle no goeloaction")
        console.log("posError", error)
        setPosition({
          coords: {
            latitude: LAT,
            longitude: LNG,
            accuracy: 1,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        })
      },
      {
        enableHighAccuracy: true,

      }
    )

    const id = navigator.geolocation.watchPosition((pos) => {
      console.log("got pos", pos)
      setPosition(pos);
      // alert(`lat: ${pos.coords.latitude}, lng ${pos.coords.longitude}`)
    })

    return () => navigator.geolocation.clearWatch(id)
  }, [])
  console.log("from state", position)

  if (!position) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>lat: {position.coords.latitude}</div>
      <div>lon: {position.coords.longitude}</div>
      <div>acc: {position.coords.accuracy}</div>
    </div>
  )

  // return (
  //   <ApolloProvider client={client}>
  //     <div>
  //       <Map
  //         provider={stamenToner}
  //         height={300}
  //         // width={300}
  //         defaultCenter={[position.coords.latitude, position.coords.longitude]} defaultZoom={18}
  //       >
  //         <Marker width={50} anchor={[position.coords.latitude, position.coords.longitude]} />
  //         {/* <Overlay
  //         offset={[150, 150]}

  //       >
  //         <svg width={300} height={300}>
  //           <defs>
  //             <mask id="hole">
  //               <rect width="100%" height="100%" fill="white" />
  //               <circle r="100" cx="150" cy="150" fill="black" />
  //             </mask>
  //           </defs>
  //           <rect id="donut" width="1000%" height="1000%" mask="url(#hole)" />
  //         </svg>
  //       </Overlay> */}
  //       </Map>
  //     </div>
  //     <App latitude={position.coords.latitude} longitude={position.coords.longitude} />
  //   </ApolloProvider>
  // )
};

const theme = createTheme();
const AppProvider = () => {
  const [position, setPosition] = useState<GeolocationPosition | undefined>(undefined);

  return (
    <ThemeProvider theme={theme} >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {position ? <div>Next</div> : <LocationScreen />}
        </Box>
      </Container>

    </ThemeProvider>)
}

export default AppProvider;
