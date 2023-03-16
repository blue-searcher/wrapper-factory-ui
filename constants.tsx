import { BigNumber } from "ethers"
import { WrapperType } from "./types"

export const FACTORY_ADDRESS: `0x${string}` = "0xdD71F555DF632a553d60a7917E1d7cf6C3f06F16"
export const EXPLORER_TX_BASE_LINK: string = "https://goerli.etherscan.io/tx/"
export const EXPLORER_ADDRESS_BASE_LINK: string = "https://goerli.etherscan.io/address/"

export const UNIT: BigNumber = BigNumber.from(10).pow(18)

export type WrapperTypeInfo = { 
  id: WrapperType,
  name: string,
  icon: string,
  color: string,
  description: string,
}

export const WRAPPER_TYPES: WrapperTypeInfo[] = [
  {
    id: "fixed",
    name: "Fixed Ratio",
    icon: "🔒",
    color: "warning",
    description: "Fixed Ratio is an ERC20 wrapper token which can be exchanged at a fixed exchange rate to the supplied token without any fee or slippage. ",
  },
  {
    id: "shares",
    name: "Shares Based",
    icon: "📈",
    color: "info",
    description: "Shares Based is an ERC20 wrapper token which transform a rebasing token to a standard non-rebasing token implementing a shares based mechanism.",
  },
]
