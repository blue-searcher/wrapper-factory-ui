import { useEffect, useState } from "react"
import { ReadOutput, WrapperInfo, TokenData, AccountResult } from "../types"
import { useContractReads, useToken, erc20ABI, useAccount } from "wagmi"
import WRAPPER_TOKEN_ABI from "../abi/WrapperToken.json"
import { toast } from 'react-toastify'

function formatWrapperInfo(
  baseWrapperInfoRead: ReadOutput<Array<any>>, 
  additionalWrapperInfoRead: ReadOutput<Array<any>>,
  address: `0x${string}`
): WrapperInfo | undefined {
  if (baseWrapperInfoRead?.data && additionalWrapperInfoRead?.data) {
    const wrapperTokenData: TokenData = {
      address: address,
      name: baseWrapperInfoRead.data?.[1],
      symbol: baseWrapperInfoRead.data?.[2],
      decimals: baseWrapperInfoRead.data?.[3],
      balance: baseWrapperInfoRead.data?.[4],
    }

    const tokenData: TokenData = {
      address: baseWrapperInfoRead.data?.[0],
      name: additionalWrapperInfoRead.data?.[0],
      symbol: additionalWrapperInfoRead.data?.[1],
      decimals: additionalWrapperInfoRead.data?.[2],
      balance: additionalWrapperInfoRead.data?.[4],
    }

    const result: WrapperInfo = {
      wrapper: wrapperTokenData,
      token: tokenData,

      liquidity: additionalWrapperInfoRead.data?.[3],
      tokenAllowance: additionalWrapperInfoRead.data?.[5],
    }
    return result;
  }

  return undefined;
}

export function useWrapperInfo(address: `0x${string}`, watch: boolean = true): WrapperInfo {
  const [info, setInfo] = useState<WrapperInfo>()

  const accountResult: AccountResult = useAccount()

  const baseWrapperInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: address,
        abi: WRAPPER_TOKEN_ABI,
        functionName: 'WRAPPED',
      },
      {
        address: address,
        abi: WRAPPER_TOKEN_ABI,
        functionName: 'name',
      },
      {
        address: address,
        abi: WRAPPER_TOKEN_ABI,
        functionName: 'symbol',
      },
      {
        address: address,
        abi: WRAPPER_TOKEN_ABI,
        functionName: 'decimals',
      },
      {
        address: address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [accountResult?.address]
      },
    ],
    enabled: Boolean(address),
    watch: watch,
    onError(error: any) {
      toast.error("Error fetching wrapper information")
    },
  })

  const additionalWrapperInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [accountResult?.address]
      },
      {
        address: baseWrapperInfoRead?.data?.[0],
        abi: erc20ABI,
        functionName: 'allowance',
        args: [
          accountResult?.address,
          address
        ]
      },
    ],
    enabled: Boolean(baseWrapperInfoRead?.data?.[0]),
    watch: watch,
    onError(error: any) {
      toast.error("Error fetching token information")
    },
  })

  useEffect(() => {
    const result: WrapperInfo = formatWrapperInfo(
      baseWrapperInfoRead, 
      additionalWrapperInfoRead,
      address
    )
    setInfo(result)
  }, [
    baseWrapperInfoRead?.data,
    additionalWrapperInfoRead?.data,
    accountResult?.address
  ])

  return info
}
