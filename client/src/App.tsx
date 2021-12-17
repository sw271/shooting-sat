import { ApolloClient, ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { cache } from "./cache";
import { Main } from "./Main";

const client = new ApolloClient({
  uri: "http://localhost:8000",
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
