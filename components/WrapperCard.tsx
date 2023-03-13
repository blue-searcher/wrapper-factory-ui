import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { useContractRead, useContractReads, useToken, erc20ABI } from 'wagmi'
import { BigNumber } from "ethers"
import { WRAPPER_TYPES } from "../constants"
import Badge from "react-bootstrap/Badge"
import Link from 'next/link'
import { useWrapperInfo, useWrapperById, useAmountsOut } from "../hooks"
import { WrapperInfo, AmountsOut } from "../types"

interface Props {
  wrapperId: number,
}

type WrapperTypeProps = {
  info: WrapperInfo | undefined,
}

function formatAmount(amount: BigNumber | undefined, decimals: number): string {
  if (amount) {
    return amount.div(BigNumber.from(10).pow(decimals)).toString()
  }
  return "0"
}

function FixedRatioWrapper({
  info,
}: WrapperTypeProps) {
  const amountsOut: AmountsOut = useAmountsOut(
    info?.wrapper.address,
    BigNumber.from(10).pow(info.token.decimals),
    BigNumber.from(10).pow(info.wrapper.decimals)
  )

  const wrapper = WRAPPER_TYPES.find(el => el.id === info.wrapperType);

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
      href={"/wrappers/" + info.wrapper.address}
    >
      <div className="p-2 py-3 my-2" style={style.card}>
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="d-inline-block">{wrapper.icon + " " + info.wrapper.symbol}</h5>
            {" "}
            <span className="text-muted">{info.wrapper.name}</span>
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
                      <h6 className="d-inline-block">{info.token.symbol}</h6>
                    </div>
                  </div>

                  <div className="px-4">
                    <h2 className="d-inline-block text-primary">{" ↔️ "}</h2>
                  </div>

                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{formatAmount(amountsOut?.wrap, info.wrapper.decimals)}</h6>
                      <h6 className="d-inline-block">{info.wrapper.symbol}</h6>
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
                      <h6 className="d-inline-block">{info.wrapper.symbol}</h6>
                    </div>
                  </div>

                  <div className="px-4">
                    <h2 className="d-inline-block text-primary">{" ↔️ "}</h2>
                  </div>

                  <div>
                    <div className="d-flex flex-column">
                      <h6 className="d-inline-block text-center">{formatAmount(amountsOut?.unwrap, info.token.decimals)}</h6>
                      <h6 className="d-inline-block">{info.token.symbol}</h6>
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
                <h5 className={"pt-1 d-inline-block"}>{formatAmount(info.liquidity, info.token.decimals)}</h5>
                {" "}
                <span className="text-muted">{info.token.symbol}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}

function SharesBasedWrapper({
  info,
}: WrapperTypeProps) {
  return (
    <div>
      TODO Shares based wrapper
    </div>
  )
}

export default function WrapperCard({
  wrapperId,
}: Props) {
  const address: `0x${string}` = useWrapperById(wrapperId)
  const wrapperInfo: WrapperInfo = useWrapperInfo(address)

  return (
    <div>
      {wrapperInfo?.wrapperType === 0 ? (
        <FixedRatioWrapper
          info={wrapperInfo}
        />
      ) : wrapperInfo?.wrapperType === 1 ? (
        <SharesBasedWrapper
          info={wrapperInfo}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
