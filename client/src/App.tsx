import { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { IGetEventsPayload } from "./interfaces/ISatelliteEvent";
import { LocationScreen } from "./screens/LocationScreen";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ILocation } from "./interfaces/ILocation";
import { SatellitesScreen } from "./screens/SatellitesScreen";


const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getEvents: {
          keyArgs: false,
          merge(existing: IGetEventsPayload, incoming: IGetEventsPayload) {
            if (!existing) return incoming;
            const ret: IGetEventsPayload = {
              ...existing,
              dateToExcUtc: incoming.dateToExcUtc,
              satelliteEvents: existing.satelliteEvents.map((x) => {
                return {
                  satelliteId: x.satelliteId,
                  events: [...x.events],
                };
              }),
            };

            incoming.satelliteEvents.forEach((e) => {
              const found = ret.satelliteEvents.find(
                (x) => x.satelliteId === e.satelliteId
              );
              if (found) {
                found.events.push(...e.events);
              } else {
                ret.satelliteEvents.push(e);
              }
            });

            return ret;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:8000",
  cache,
});

const theme = createTheme();
const AppProvider = () => {
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [showLocationScreen, setShowLocationScreen] = useState<boolean>(false);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme} >
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
              showLocationScreen || !location
            ) ? (
              <LocationScreen
                location={location}
                setLocation={setLocation}
              />
            ) : (
              <SatellitesScreen
                location={location}
                setShowLocationScreen={() => setShowLocationScreen(true)}
              />
            )}
          </Box>
        </Container>

      </ThemeProvider>
    </ApolloProvider>
  )
}

export default AppProvider;
