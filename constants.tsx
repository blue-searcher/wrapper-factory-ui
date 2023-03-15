import { BigNumber } from "ethers"
import { WrapperType } from "./types"

export const FACTORY_ADDRESS: `0x${string}` = "0x19C719029B34Ee15d5a12C8c95d09Ba35De62547"
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
    description: "Fixed Ratio is a wrapper ERC20 token which can be exchanged at a predetermineed exchange rate without any fee or slippage.",
  },
  {
    id: "shares",
    name: "Shares Based",
    icon: "📈",
    color: "info",
    description: "Lorem ipsum Shares Based",
  },
]
