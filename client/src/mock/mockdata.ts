import { ISatellitePass } from "../interfaces/ISatellitePass";

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;
const generateAzimuth = () => randomBetween(0, 360);
const generateElevation = () => randomBetween(0, 90);
const generateSateliteDurationMillis = () => randomBetween(0, 15) * 60 * 1000;
const date1 = new Date(2021, 10, 1);
const date2 = new Date(2021, 10, 3);
const names = ["sat1", "sat2", "fine", "solar", "h1 3e"];
const getName = () => names[Math.floor(Math.random() * names.length)];

const generateSatelitePass = (): ISatellitePass => {
  const riseEpoch = randomBetween(date1.valueOf(), date2.valueOf());
  const setEpoch = riseEpoch + generateSateliteDurationMillis();
  return {
    name: getName(),
    rise: {
      timestamp: new Date(riseEpoch),
      azimuth: generateAzimuth(),
      elevation: generateElevation(),
    },
    set: {
      timestamp: new Date(setEpoch),
      azimuth: generateAzimuth(),
      elevation: generateElevation(),
    },
    weather: {
      cloudCover: randomBetween(0, 100),
    },
  };
};

export const generateMockData = () =>
  Array.from(Array(100))
    .map((_) => generateSatelitePass())
    .sort((a, b) => a.rise.timestamp.valueOf() - b.rise.timestamp.valueOf());
