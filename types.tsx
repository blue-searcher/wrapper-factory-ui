

export type ReadOutput<T> = {
  data: T | undefined,
  isLoading: boolean,
  isError: boolean,
}

export type AccountResult = {
  address: `0x${string}`,
  isConnecting: boolean,
  isDisconnected: boolean,
  isConnected: boolean,
}

export type TokenData = {
  address: `0x${string}`,
  name: string,
  symbol: string,
  decimals: number,
  balance: BigNumber,
}

export type WrapperInfo = {
  wrapperId?: number,
  wrapperType: number,
  
  wrapper: TokenData,
  token: TokenData,

  liquidity: BigNumber,
  tokenAllowance: BigNumber
}

export type AmountsOut = {
  wrap: BigNumber,
  unwrap: BigNumber,
}
