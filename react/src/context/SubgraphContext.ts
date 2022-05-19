import { createContext } from "react";
import { Mainnet } from "../config";

const SubgraphContext = createContext(Mainnet.chainId);

export default SubgraphContext;
