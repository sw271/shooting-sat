import { setLocation } from "./setLocation";
import { setShowLocationScreen } from "./setShowLocationScreen"
import { locationVar, locationScreenVar } from "../../cache";

export const mutations = {
  setLocation: setLocation(locationVar),
  setShowLocationScreen: setShowLocationScreen(locationScreenVar)
}