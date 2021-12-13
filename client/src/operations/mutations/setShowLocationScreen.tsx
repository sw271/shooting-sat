import { ReactiveVar } from "@apollo/client";

export const setShowLocationScreen = (showLocationScreenVar: ReactiveVar<boolean>) => {
  return (showLocationScreen: boolean) => {
    showLocationScreenVar(showLocationScreen);
  }
}