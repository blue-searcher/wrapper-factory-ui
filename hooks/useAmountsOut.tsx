import { useEffect, useState } from "react"
import { ReadOutput, AmountsOut } from "../types"
import { useContractReads } from "wagmi"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { toast } from 'react-toastify'

export function useAmountsOut(
  address: `0x${string}`,
  tokenAmountIn: BigNumber | undefined,
  wrapperAmountIn: BigNumber | undefined,
): AmountsOut {
  const [amountsOut, setAmountsOut] = useState<AmountsOut>()

  let contractCalls = []
  if (tokenAmountIn) {
    contractCalls.push({
      address: address,
      abi: FIXED_RATIO_ABI,
      functionName: 'getWrapAmountOut',
      args: [tokenAmountIn]
    })
  }
  if (wrapperAmountIn) {
    contractCalls.push({
      address: address,
      abi: FIXED_RATIO_ABI,
      functionName: 'getUnwrapAmountOut',
      args: [wrapperAmountIn]
    })
  }

  const amountsOutRead: ReadOutput<Array<any>> = useContractReads({
    contracts: contractCalls,
    enabled: Boolean(address && contractCalls.length > 0),
    onError(error: any) {
      toast.error("Error fetching amounts out")
    },
  })

  useEffect(() => {
    const result: AmountsOut = {
      wrap: amountsOutRead?.data?.[0],
      unwrap: amountsOutRead?.data?.[1],
    }

    setAmountsOut(result)
  }, [amountsOutRead?.data])

  return amountsOut
}
