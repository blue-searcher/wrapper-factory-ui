import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { useContractRead, useContractReads, useToken, erc20ABI } from 'wagmi'
import { BigNumber } from "ethers"
import { WRAPPER_TYPES } from "../constants"
import Badge from "react-bootstrap/Badge"
import Link from 'next/link'

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

function formatAmount(amount: BigNumber | undefined, decimals: number): string {
  if (amount) {
    return amount.div(BigNumber.from(10).pow(decimals)).toString()
  }
  return "0"
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

      {
        address: baseInfo.token as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [baseInfo.address as `0x${string}`]
      },
    ],
    enabled: Boolean(baseInfo.address)
  })

  const wrapper = WRAPPER_TYPES.find(el => el.id === baseInfo.wrapperType);

  const style = {
    card: {
      borderTop: "1px solid #dee2e6",
      borderRight: "1px solid #dee2e6",
      borderBottom: "1px solid #dee2e6",
      borderLeft: "5px solid #ffc107",
      cursor: "pointer"
    }
  }

  return (
    <Link 
      href={"/wrappers/" + baseInfo.address}
    >
      <div className="p-2 py-3 my-2" style={style.card}>
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

        <div className="row">
          <div className="col-12 col-md-12 col-lg-8 ">
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <span className="text-muted">Wrap</span>

                <div className="d-flex justify-content-around">
                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{"1"}</h6>
                      <h6 className="d-inline-block">{baseInfo.tokenSymbol}</h6>
                    </div>
                  </div>

                  <div className="px-4">
                    <h2 className="d-inline-block text-primary">{" ↔️ "}</h2>
                  </div>

                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{formatAmount(fixedRatioRead?.data?.[1], baseInfo.wrapperDecimals)}</h6>
                      <h6 className="d-inline-block">{baseInfo.wrapperSymbol}</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-muted">Unwrap</span>

                <div className="d-flex justify-content-around">
                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{"1"}</h6>
                      <h6 className="d-inline-block">{baseInfo.wrapperSymbol}</h6>
                    </div>
                  </div>

                  <div className="px-4">
                    <h2 className="d-inline-block text-primary">{" ↔️ "}</h2>
                  </div>

                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{formatAmount(fixedRatioRead?.data?.[2], baseInfo.tokenDecimals)}</h6>
                      <h6 className="d-inline-block">{baseInfo.tokenSymbol}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-4 text-center">
            <div className="h-100 d-flex align-items-center justify-content-center">
              <div>
                <span className="text-muted">Liquidity</span>
                <br/>
                <h5 className={"pt-1 d-inline-block"}>{formatAmount(fixedRatioRead?.data?.[3], baseInfo.tokenDecimals)}</h5>
                {" "}
                <span className="text-muted">{baseInfo.tokenSymbol}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
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

  console.log("baseInfo", baseInfo)

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
