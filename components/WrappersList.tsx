import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import { useContractRead } from 'wagmi'
import WrapperCard from "./WrapperCard"
import { toast } from 'react-toastify'
import { BigNumber } from "ethers"

type NextIdReadOutput = {
  data: BigNumber | undefined,
  isLoading: boolean,
  isError: boolean,
}

export default function WrappersList() {
  const nextIdRead: NextIdReadOutput = useContractRead({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: WRAPPER_FACTORY_ABI,
    functionName: "nextId",
    onError(error: any) {
      toast.error("Error fetching wrappers count")
    },
  })

  const totalWrappers: number = nextIdRead && nextIdRead.data ? (Math.max(nextIdRead.data.toNumber() - 1, 0)) : 0;

  return (
    <div className="row">
      {Array.from(Array(totalWrappers + 1).keys()).map((wrapperId: number) => (
        <div 
          className="col-12"
          key={"wrapper-card-" + wrapperId} 
        >
          <WrapperCard 
            wrapperId={wrapperId} 
          />
        </div>
      ))}
    </div>
  )
}
