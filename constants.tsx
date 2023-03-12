
export const FACTORY_ADDRESS: string = "0x19C719029B34Ee15d5a12C8c95d09Ba35De62547"
export const EXPLORER_TX_BASE_LINK: string = "https://goerli.etherscan.io/tx/"

type WrapperInfo = { 
  id: number,
  name: string,
  icon: string,
  color: string,
  description: string,
}

export const WRAPPER_TYPES: WrapperInfo[] = [
  {
    id: 0,
    name: "Fixed Ratio",
    icon: "🔒",
    color: "warning",
    description: "Fixed Ratio is a wrapper ERC20 token which can be exchanged at a predetermineed exchange rate without any fee or slippage.",
  },
  {
    id: 1,
    name: "Shares Based",
    icon: "📈",
    color: "info",
    description: "Lorem ipsum Shares Based",
  },
]
