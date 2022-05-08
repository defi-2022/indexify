import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Mainnet, Optimism, Polygon } from "@usedapp/core";

export const CLIENTS = {
  [Mainnet.chainName]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  }),
  [Optimism.chainName]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  }),
  [Polygon.chainName]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  }),
};
