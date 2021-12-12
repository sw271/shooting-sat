import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache
} from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { initializeCache } from "./cache";
import { Main } from "./Main";



const theme = createTheme();
const AppProvider = () => {
  const [client, setClient] = useState<ApolloClient<unknown> | undefined>(undefined);
  useEffect(() => {
    const genClient = async () => {
      console.log("generating client");
      const cache = await initializeCache();
      const client = new ApolloClient({
        uri: "http://localhost:8000",
        cache,
      });
      setClient(client);
    }
    genClient();
  }, []);

  if (!client) {
    return (<div>Loading...</div>)
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme} >
        <Main />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default AppProvider;
