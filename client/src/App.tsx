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

const client = new ApolloClient({
  uri: "http://localhost:8000",
  cache: new InMemoryCache(),
});

const LAT = 51.454514;
const LNG = -2.58791;

const GET_EVENTS = gql`
  query GetEvents($lat: Float!, $lng: Float!) {
    getEvents(input: { lat: $lat, lng: $lng }) {
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
  const { loading, error, data } = useQuery<{
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
    <App />
  </ApolloProvider>
);

export default AppProvider;
