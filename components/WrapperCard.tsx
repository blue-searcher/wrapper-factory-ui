import { FACTORY_ADDRESS } from "../constants"
import WRAPPER_FACTORY_ABI from "../abi/WrapperFactory.json"
import WRAPPER_TOKEN_ABI from "../abi/WrapperToken.json"
import { useContractRead, useContractReads, useToken, erc20ABI } from 'wagmi'
import { BigNumber } from "ethers"
import { UNIT } from "../constants"
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import Link from 'next/link'
import { useWrapperInfo, useWrapperById, useAmountsOut } from "../hooks"
import { WrapperInfo, AmountsOut, WrapperListFilter } from "../types"
import { BsFillArrowRightCircleFill } from "react-icons/bs"
import { parseUnits, formatUnits } from "@ethersproject/units"
import { TbArrowsMoveHorizontal } from 'react-icons/tb'

interface Props {
  wrapperId: number,
  filter: WrapperListFilter,
}

const canBeRendered = (info: WrapperInfo, filter: WrapperListFilter): boolean => {
  if (filter === "all") {
    return true
  }

  return info?.wrapper?.balance?.gt(0)
}

export default function WrapperCard({
  wrapperId,
  filter,
}: Props) {
  const address: `0x${string}` = useWrapperById(wrapperId)
  const info = useWrapperInfo(address, false)

  const amountsOut: AmountsOut = useAmountsOut(
    info?.wrapper?.address,
    parseUnits("1", info?.token?.decimals || 0),
    parseUnits("1", info?.wrapper?.decimals || 0)
  )

  return (
    <>
      {info && canBeRendered(info, filter) && (
        <Card 
          className="my-2" 
          style={{
            borderTop: "1px solid #dee2e6",
            borderRight: "1px solid #dee2e6",
            borderBottom: "1px solid #dee2e6",
            borderLeft: "5px solid var(--bs-warning)",
            position: "relative",
            borderRadius: "0 5px 5px 0",
          }}
        >
          <Link 
            href={"/wrappers/" + info?.wrapper?.address}
            style={{ textDecoration: "none" }}
          > 
            <Card.Header className="m-0 p-2 d-flex justify-content-between" style={{cursor:"pointer" }}>
              <div>
                <h5 className="d-inline-block">
                  {info?.wrapper?.symbol}
                </h5>
                {" - "}
                <span className="text-muted">{info?.wrapper?.name}</span>
              </div>
              <div className="d-flex justify-content-center">
                <div className="px-2">
                  {info?.wrapper?.balance?.gt(0) && (
                    <span>{"⭐️ "}</span>
                  )}
                </div>
              </div>
            </Card.Header>
          </Link>

          <Card.Body>  
            <Link 
              href={"/wrappers/" + info?.wrapper?.address}
            > 
              <div 
                className="p-1"
                style={{ cursor: "pointer", position: "absolute", bottom: 0, right: 0 }}
              >
                <h4 className="d-inline-block"><BsFillArrowRightCircleFill /></h4>
              </div>
            </Link>

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
                        <h2 className="d-inline-block text-primary"><TbArrowsMoveHorizontal /></h2>
                      </div>

                      <div>
                        <div className="d-flex flex-column">
                          <h6 className="d-inline-block text-center">{formatUnits(amountsOut?.wrap || "0", info?.wrapper?.decimals || 0)}</h6>
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
                    <h5 className={"pt-1 d-inline-block text-center"}>{formatUnits(info?.liquidity || "0", info?.token?.decimals || 0)}</h5>
                    {" "}
                    <span className="text-muted">{info?.token?.symbol || ""}</span>

                    {info?.wrapper?.balance?.gt(0) && (
                      <>  
                        <br/>
                        <span className="text-muted">
                          <span>{"Your balance: "}</span>
                          <span>{formatUnits(info?.wrapper?.balance || "0", info?.wrapper?.decimals || 0)}</span>
                          <span>{" "}</span>
                          <span>{info?.wrapper?.symbol}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </Card.Body>
        </Card>
      )}
    </>
  )
}
