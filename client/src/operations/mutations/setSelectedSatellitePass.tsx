import { ReactiveVar } from "@apollo/client";
import { ISatellitePass } from "../../models/ISatellitePass";

export const setSelectedSatellitePass = (selectedSatellitePassVar: ReactiveVar<ISatellitePass | undefined>) => {
  return (selectedSatellitePass: ISatellitePass | undefined) => {
    selectedSatellitePassVar(selectedSatellitePass);
  }
}