import "./App.css";
import { generateMockData } from "./mock/mockdata";
import { SatellitePassTable } from "./components/SatellitePassTable";

const mockData = generateMockData();

function App() {
  return (
    <div className="App">
      <SatellitePassTable data={mockData} />
    </div>
  );
}

export default App;
