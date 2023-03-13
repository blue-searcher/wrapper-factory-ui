import { useEffect, useState } from "react"
import { ReadOutput } from "../types"
import { useContractRead } from "wagmi"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import { toast } from 'react-toastify'
import { FACTORY_ADDRESS } from "../constants"
import { BigNumber } from "ethers"

export function useTotalWrappersCount(): number {
  const [count, setCount] = useState<number>(0)

  const nextIdRead: ReadOutput<BigNumber> = useContractRead({
    address: FACTORY_ADDRESS,
    abi: WRAPPER_FACTORY_ABI,
    functionName: "nextId",
    onError(error: any) {
      toast.error("Error fetching wrappers count")
    },
  })

  useEffect(() => {
    const totalWrappers: number = nextIdRead && nextIdRead.data ? (Math.max(nextIdRead.data.toNumber() - 1, 0)) : 0
    setCount(totalWrappers)
  }, [nextIdRead?.data])

  return count
}
