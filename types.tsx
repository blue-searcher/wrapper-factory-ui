import { BigNumber } from "ethers"

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
  isReconnecting: boolean,
}

export type TokenData = {
  address: `0x${string}`,
  name: string,
  symbol: string,
  decimals: number,
  balance: BigNumber,
}

export type WrapperType = "fixed" | "shares"

export type WrapperInfo = {
  wrapperId?: number,
  type: WrapperType,
  
  wrapper: TokenData,
  token: TokenData,

  liquidity: BigNumber,
  tokenAllowance: BigNumber
}

export type AmountsOut = {
  wrap: BigNumber,
  unwrap: BigNumber,
}

export type WrapOperationType = "wrap" | "unwrap"

export type WrapUnwrapFormParams = {
  amount: number,
  receiver: `0x${string}`,
  functionName: WrapOperationType,
}

export type WrapperDeployParams = {
  type: WrapperType,

  tokenAddress: `0x${string}`,
  name: string,
  symbol: string,
  decimals: number,

  tokenAmount: number,
  wrapperAmount: number,
}
