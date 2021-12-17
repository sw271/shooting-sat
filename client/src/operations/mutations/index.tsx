import { setLocation } from "./setLocation";
import { setShowLocationScreen } from "./setShowLocationScreen"
import { setSelectedSatellitePass } from "./setSelectedSatellitePass"
import { locationVar, locationScreenVar, selectedSatellitePassVar } from "../../cache";

export const mutations = {
  setLocation: setLocation(locationVar),
  setShowLocationScreen: setShowLocationScreen(locationScreenVar),
  setSelectedSatellitePass: setSelectedSatellitePass(selectedSatellitePassVar)
}