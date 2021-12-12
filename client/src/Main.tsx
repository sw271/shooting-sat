import { useState } from "react";
import { LocationScreen } from "./screens/LocationScreen";
import { Box, Container, CssBaseline } from "@mui/material";
import { ILocation } from "./interfaces/ILocation";
import { SatellitesScreen } from "./screens/SatellitesScreen";
import { GET_LOCATION } from "./operations/queries/getLocation";
import { useQuery } from "@apollo/client";
import { GET_SHOW_LOCATION_SCREEN } from "./operations/queries/getShowLocationScreen";
import { useGetLocation, useGetShowLocation } from "./operations/queries";

export const Main = () => {

  const locationQuery = useGetLocation();
  const showLocationScreenQuery = useGetShowLocation();
  console.log("Location", locationQuery.data)
  console.log("showLocationScreenQuery", showLocationScreenQuery.data)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {(
          showLocationScreenQuery.data?.showLocationScreen || locationQuery.data?.location === undefined
        ) ? (
          <LocationScreen
            location={locationQuery.data && locationQuery.data.location}
            setLocation={() => { }}
          />
        ) : (
          <SatellitesScreen
            location={locationQuery.data.location}
            setShowLocationScreen={() => { }}
          />
        )}
      </Box>
    </Container>
  )
}
