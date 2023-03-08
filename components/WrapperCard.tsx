import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { useContractRead, useContractReads, useToken } from 'wagmi'
import { BigNumber } from "ethers"
import { WRAPPER_TYPES } from "../constants"
import Badge from "react-bootstrap/Badge"

interface Props {
  wrapperId: number,
}

type BaseWrapperInfo = {
  wrapperId: number,
  
  address: string,
  wrapperType: number,
  wrapperName: string,
  wrapperSymbol: string,
  wrapperDecimals: number

  token: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number
}

type TokenData = {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
}

type ReadOutput<T> = {
  data: T | undefined,
  isLoading: boolean,
  isError: boolean,
}

type WrapperTypeProps = {
  baseInfo: BaseWrapperInfo | undefined,
}

function FixedRatioWrapper({
  baseInfo,
}: WrapperTypeProps) {
  const fixedRatioRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: baseInfo.address as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'ratio',
      },

      {
        address: baseInfo.address as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'getWrapAmountOut',
        args: [BigNumber.from(10).pow(baseInfo.tokenDecimals)]
      },
      {
        address: baseInfo.address as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'getUnwrapAmountOut',
        args: [BigNumber.from(10).pow(baseInfo.wrapperDecimals)]
      },
    ],
    enabled: Boolean(baseInfo.address)
  })

  const wrapper = WRAPPER_TYPES.find(el => el.id === baseInfo.wrapperId);

  console.log("baseInfo", baseInfo)
  console.log(fixedRatioRead?.data)

  return (
    <div className="border-left border p-2 py-3 my-2">
      <div className="d-flex justify-content-between">
        <div>
          <h5 className="d-inline-block">{wrapper.icon + " " + baseInfo.wrapperSymbol}</h5>
          {" "}
          <span className="text-muted">{baseInfo.wrapperName}</span>
        </div>
        <div style={{ width: 120 }} className="text-center">
          <h5><Badge pill text={"dark"} bg={wrapper.color}>{wrapper.name}</Badge></h5>
        </div>
      </div>
    </div>
  )
}

function SharesBasedWrapper({
  baseInfo,
}: WrapperTypeProps) {
  return (
    <div>
      TODO Shares based wrapper
    </div>
  )
}

function formatBaseWrapperInfo(
  readOutput: ReadOutput<Array<any>>, 
  tokenReadOutput: ReadOutput<TokenData>,
  wrapperId: number,
  address: string
): BaseWrapperInfo | undefined {
  if (readOutput?.data && tokenReadOutput?.data) {
    const result: BaseWrapperInfo = {
      address: address,
      wrapperId: wrapperId,
      wrapperType: readOutput.data?.[0].toNumber(),
      
      wrapperName: readOutput.data?.[2],
      wrapperSymbol: readOutput.data?.[3],
      wrapperDecimals: readOutput.data?.[4],

      token: readOutput.data[1],
      tokenName: tokenReadOutput?.data?.name,
      tokenSymbol: tokenReadOutput?.data?.symbol,
      tokenDecimals: tokenReadOutput?.data?.decimals,
    }
    return result;
  }

  return undefined;
}

export default function WrapperCard({
  wrapperId,
}: Props) {
  const wrapperByIdRead: ReadOutput<string> = useContractRead({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: WRAPPER_FACTORY_ABI,
    functionName: "wrapperById",
    args: [wrapperId]
  })

  //Fetch common properties between all wrapper instances
  const baseWrapperInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: wrapperByIdRead?.data as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'WRAPPER_TYPE',
      },
      {
        address: wrapperByIdRead?.data as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'WRAPPED',
      },
      {
        address: wrapperByIdRead?.data as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'name',
      },
      {
        address: wrapperByIdRead?.data as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'symbol',
      },
      {
        address: wrapperByIdRead?.data as `0x${string}`,
        abi: FIXED_RATIO_ABI,
        functionName: 'decimals',
      },
    ],
    enabled: Boolean(wrapperByIdRead?.data),
  })

  const tokenRead: ReadOutput<TokenData> = useToken({ 
    address: baseWrapperInfoRead?.data?.[1],
    enabled: Boolean(baseWrapperInfoRead?.data?.[1]),
  })

  const baseInfo: BaseWrapperInfo = formatBaseWrapperInfo(
    baseWrapperInfoRead, 
    tokenRead,
    wrapperId,
    wrapperByIdRead?.data
  )

  return (
    <div>
      {baseInfo?.wrapperType === 0 ? (
        <FixedRatioWrapper
          baseInfo={baseInfo}
        />
      ) : baseInfo?.wrapperType === 1 ? (
        <SharesBasedWrapper
          baseInfo={baseInfo}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
