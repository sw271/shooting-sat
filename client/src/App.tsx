import { ApolloClient, ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { cache } from "./cache";
import { Main } from "./Main";

if (!process.env.REACT_APP_API_ENDPOINT) {
  throw new Error("Please set API endpoint");
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT,
  cache,

});
const theme = createTheme();

const AppProvider = () => {

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme} >
        <Main />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default AppProvider;
