import { useEffect, useState } from "react"
import { ReadOutput, AmountsOut } from "../types"
import { useContractReads } from "wagmi"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { toast } from 'react-toastify'

export function useAmountsOut(
  address: `0x${string}`,
  tokenAmountIn: BigNumber,
  wrapperAmountIn: BigNumber,
): AmountsOut {
  const [amountsOut, setAmountsOut] = useState<AmountsOut>()

  const amountsOutRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'getWrapAmountOut',
        args: [tokenAmountIn]
      },
      {
        address: address,
        abi: FIXED_RATIO_ABI,
        functionName: 'getUnwrapAmountOut',
        args: [wrapperAmountIn]
      },
    ],
    enabled: Boolean(address),
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
