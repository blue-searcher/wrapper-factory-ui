type WrapperInfo = { 
  id: number,
  name: string,
  icon: string,
  description: string,
}

export const types: WrapperInfo[] = [
  {
    id: 0,
    name: "Fixed Ratio",
    icon: "🔒",
    description: "Fixed Ratio is a wrapper ERC20 token which can be exchanged at a predetermineed exchange rate without any fee or slippage.",
  },
  {
    id: 1,
    name: "Shares Based",
    icon: "📈",
    description: "Lorem ipsum Shares Based",
  },
];
