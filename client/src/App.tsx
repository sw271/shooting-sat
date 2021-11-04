import "./App.css";
// import { generateMockData } from "./mock/mockdata";
import { SatellitePassTable } from "./components/SatellitePassTable";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { ISatellitePass } from "./interfaces/ISatellitePass";
import { SatellitePass } from "./interfaces/SatelitePass";

const client = new ApolloClient({
  uri: "http://localhost:8000",
  cache: new InMemoryCache(),
});

const LAT = 51.454514;
const LNG = -2.58791;

const GET_PASSES = gql`
  query GetPasses($lat: Float!, $lng: Float!) {
    getPasses(input: { lat: $lat, lng: $lng }) {
      passes {
        name
        riseDatetime
        riseAzimuth
        setDatetime
        setAzimuth
        cloudCover
      }
    }
  }
`;

// const mockData = generateMockData();

function App() {
  const { loading, error, data } = useQuery<{
    getPasses: { passes: ISatellitePass[] };
  }>(GET_PASSES, {
    variables: {
      lat: LAT,
      lng: LNG,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  console.log(data);

  return (
    <div className="App">
      <SatellitePassTable
        data={data.getPasses.passes.map((x) => new SatellitePass(x))}
      />
    </div>
  );
}

const AppProvider: React.FC = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default AppProvider;
