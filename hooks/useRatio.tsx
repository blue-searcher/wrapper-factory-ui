import { useEffect, useState } from "react"
import { ReadOutput, AmountsOut } from "../types"
import { UNIT } from "../constants"
import { useContractRead } from "wagmi"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { toast } from 'react-toastify'

export function useRatio(address: `0x${string}`): number {
  const [ratio, setRatio] = useState<number>()

  const ratioRead: ReadOutput<BigNumber> = useContractRead({
    address: address,
    abi: FIXED_RATIO_ABI,
    functionName: "ratio",
    onError(error: any) {
      toast.error("Error fetching ratio")
    },
  })

  useEffect(() => {
    setRatio(ratioRead?.data?.div(UNIT)?.toNumber())
  }, [ratioRead?.data])

  return ratio
}
