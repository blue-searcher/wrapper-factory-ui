import { useEffect, useState } from "react"
import { ReadOutput } from "../types"
import { useContractRead } from "wagmi"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import { toast } from 'react-toastify'
import { FACTORY_ADDRESS } from "../constants"

export function useWrapperById(wrapperId: number): `0x${string}` {
  const [address, setAddress] = useState<`0x${string}`>()

  const wrapperByIdRead: ReadOutput<`0x${string}`> = useContractRead({
    address: FACTORY_ADDRESS,
    abi: WRAPPER_FACTORY_ABI,
    functionName: "wrapperById",
    args: [wrapperId]
  })

  useEffect(() => {
    setAddress(wrapperByIdRead?.data)
  }, [wrapperByIdRead?.data])

  return address
}
