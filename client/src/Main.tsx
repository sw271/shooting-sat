import { LocationScreen } from "./screens/LocationScreen";
import { Box, Container, CssBaseline } from "@mui/material";
import { SatellitesScreen } from "./screens/SatellitesScreen";
import { useGetLocation, useGetShowLocation } from "./operations/queries";

export const Main = () => {

  const locationQuery = useGetLocation();
  const showLocationScreenQuery = useGetShowLocation();

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
