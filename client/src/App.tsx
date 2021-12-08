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

function App() {
  useEffect(() => {
    if (data) {
      const firstDate = new Date(data.getEvents.dateFromIncUtc).valueOf();
      const lastDate = new Date(data.getEvents.dateToExcUtc).valueOf();
      if (lastDate - firstDate < 1000 * 60 * 60 * 24) {
        fetchMore({
          variables: {
            lat: LAT,
            lng: LNG,
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
      lat: LAT,
      lng: LNG,
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

const AppProvider: React.FC = () => (
  <ApolloProvider client={client}>
    <div>
      <Map
        provider={stamenToner}
        height={300}
        // width={300}
        defaultCenter={[LAT, LNG]} defaultZoom={18}
      >
        <Marker width={50} anchor={[LAT, LNG]} />
        {/* <Overlay
          offset={[150, 150]}

        >
          <svg width={300} height={300}>
            <defs>
              <mask id="hole">
                <rect width="100%" height="100%" fill="white" />
                <circle r="100" cx="150" cy="150" fill="black" />
              </mask>
            </defs>
            <rect id="donut" width="1000%" height="1000%" mask="url(#hole)" />
          </svg>
        </Overlay> */}
      </Map>
    </div>
    <App />
  </ApolloProvider>
);

export default AppProvider;
