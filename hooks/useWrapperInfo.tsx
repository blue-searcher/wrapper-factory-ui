import { useEffect, useState } from "react"
import { ReadOutput, WrapperInfo, TokenData, AccountResult } from "../types"
import { useContractReads, useToken, erc20ABI, useAccount } from "wagmi"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { toast } from 'react-toastify'

function formatWrapperInfo(
  baseWrapperInfoRead: ReadOutput<Array<any>>, 
  additionalWrapperInfoRead: ReadOutput<Array<any>>,
  address: `0x${string}`
): WrapperInfo | undefined {
  if (baseWrapperInfoRead?.data && additionalWrapperInfoRead?.data) {
    const wrapperTokenData: TokenData = {
      address: address,
      name: baseWrapperInfoRead.data?.[2],
      symbol: baseWrapperInfoRead.data?.[3],
      decimals: baseWrapperInfoRead.data?.[4],
      balance: baseWrapperInfoRead.data?.[5],
    }

    const tokenData: TokenData = {
      address: baseWrapperInfoRead.data?.[1],
      name: additionalWrapperInfoRead.data?.[0],
      symbol: additionalWrapperInfoRead.data?.[1],
      decimals: additionalWrapperInfoRead.data?.[2],
      balance: baseWrapperInfoRead.data?.[4],
    }

    const result: WrapperInfo = {
      wrapperType: baseWrapperInfoRead.data?.[0].toNumber(),
      
      wrapper: wrapperTokenData,
      token: tokenData,

      liquidity: additionalWrapperInfoRead.data?.[3],
      tokenAllowance: additionalWrapperInfoRead.data?.[5],
    }
    return result;
  }

  return undefined;
}

export function useWrapperInfo(address: `0x${string}`): WrapperInfo {
  const [wrapperInfo, setWrapperInfo] = useState<WrapperInfo>()

  const accountResult: AccountResult = useAccount()

  const baseWrapperInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'WRAPPER_TYPE',
      },
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'WRAPPED',
      },
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'name',
      },
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'symbol',
      },
      {
        address: address,
        abi: FIXED_RATIO_ABI,
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
    onError(error: any) {
      toast.error("Error fetching wrapper information")
    },
  })

  const additionalWrapperInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [accountResult?.address]
      },
      {
        address: baseWrapperInfoRead?.data?.[1],
        abi: erc20ABI,
        functionName: 'allowance',
        args: [
          accountResult?.address,
          address
        ]
      },
    ],
    enabled: Boolean(baseWrapperInfoRead?.data?.[1]),
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
    setWrapperInfo(result)
  }, [baseWrapperInfoRead?.data, additionalWrapperInfoRead?.data, accountResult?.data])

  return wrapperInfo
}
