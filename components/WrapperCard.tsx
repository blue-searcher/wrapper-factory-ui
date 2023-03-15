import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import FIXED_RATIO_ABI from "../abi/FixedRatio.json"
import { useContractRead, useContractReads, useToken, erc20ABI } from 'wagmi'
import { BigNumber } from "ethers"
import { WRAPPER_TYPES, WrapperTypeInfo } from "../constants"
import Badge from "react-bootstrap/Badge"
import Link from 'next/link'
import { useWrapperInfo, useWrapperById, useAmountsOut } from "../hooks"
import { WrapperInfo, AmountsOut } from "../types"
import { BsFillArrowRightCircleFill } from "react-icons/bs"

interface Props {
  wrapperId: number,
}

function formatAmount(amount: BigNumber | undefined, decimals: number): string {
  if (amount) {
    return amount.div(BigNumber.from(10).pow(decimals || 0)).toString()
  }
  return "0"
}

export default function WrapperCard({
  wrapperId,
}: Props) {
  const address: `0x${string}` = useWrapperById(wrapperId)
  const info = useWrapperInfo(address, false)

  const amountsOut: AmountsOut = useAmountsOut(
    info?.wrapper?.address,
    BigNumber.from(10).pow(info?.token?.decimals || 0),
    BigNumber.from(10).pow(info?.wrapper?.decimals || 0)
  )

  const wrapper: WrapperTypeInfo = WRAPPER_TYPES.find(el => el.id === info?.type);

  const style = {
    card: {
      borderTop: "1px solid #dee2e6",
      borderRight: "1px solid #dee2e6",
      borderBottom: "1px solid #dee2e6",
      borderLeft: "5px solid var(--bs-" + (wrapper?.color || "primary") + ")",
      cursor: "pointer",
      position: "relative",
    }
  }

  return (
    <>
      {info && (
        <Link 
          href={"/wrappers/" + info?.wrapper?.address}
        > 
          <div className="p-2 py-3 my-2" style={style.card}>
            <div 
              className="p-1"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            >
              <h5 className="d-inline-block"><BsFillArrowRightCircleFill /></h5>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <h5 className="d-inline-block">
                  {wrapper?.icon + " " + info?.wrapper?.symbol}
                </h5>
                {" "}
                <span className="text-muted">{info?.wrapper?.name}</span>
              </div>
              <div style={{ width: 120 }} className="text-center">
                <h5><Badge pill text={"dark"} bg={wrapper?.color || "primary"}>{wrapper?.name || ""}</Badge></h5>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12 col-md-6">
                <div className="d-flex justify-content-around">
                  <div className="text-center">
                    <div className="d-flex justify-content-around">
                      <div>
                        <div className="d-flex flex-column">
                          <h6 className="d-inline-block text-center">{"1"}</h6>
                          <h6 className="d-inline-block">{info?.token?.symbol || ""}</h6>
                        </div>
                      </div>

                      <div className="px-4">
                        <h2 className="d-inline-block text-primary">{" ↔️ "}</h2>
                      </div>

                      <div>
                        <div className="d-flex flex-column">
                          <h6 className="d-inline-block text-center">{formatAmount(amountsOut?.wrap, info?.wrapper?.decimals)}</h6>
                          <h6 className="d-inline-block">{info?.wrapper?.symbol || ""}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="h-100 d-flex align-items-center justify-content-center text-center">
                  <div>
                    <span className="text-muted">Liquidity</span>
                    <br/>
                    <h5 className={"pt-1 d-inline-block text-center"}>{formatAmount(info?.liquidity, info?.token?.decimals)}</h5>
                    {" "}
                    <span className="text-muted">{info?.token?.symbol || ""}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Link>
      )}
    </>
  )
}
