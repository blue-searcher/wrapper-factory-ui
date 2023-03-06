import { getDefaultClient } from 'connectkit'
import { createClient } from 'wagmi'
import { mainnet, goerli } from "wagmi/chains";

//const chains = [mainnet];
const chains = [goerli];

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'Wrapper Factory',
    chains,
  }),
)
