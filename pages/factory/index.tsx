import { useState, useEffect } from "react"
import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import WrapperDeployForm from "../../components/form/WrapperDeployForm"
import Card from "react-bootstrap/Card"
import { FACTORY_ADDRESS, EXPLORER_TX_BASE_LINK, UNIT } from "../../constants"
import { WrapperDeployParams } from "../../types"
import WRAPPER_FACTORY_ABI from "../../abi/WrapperFactory.json"
import { prepareWriteContract, writeContract, SendTransactionResult } from '@wagmi/core'
import { useWaitForTransaction } from 'wagmi'
import { BigNumber } from "ethers"
import * as ethers from "ethers"
import { toast } from 'react-toastify'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Link from 'next/link'

export default function Factory() {
  const [deployTxHash, setDeployTxHash] = useState<`0x${string}`>("0x0")
  const [createdWrapperAddress, setCreatedWrapperAddress] = useState<`0x${string}`>("0x0")

  const { data } = useWaitForTransaction({
    hash: deployTxHash,
    enabled: Boolean(deployTxHash && deployTxHash.length > 3),
    onSuccess(data: any) {
      toast.success("Transaction has been confirmed")
    },
    onError(error: any) {
      toast.error("Error on deploy transaction")
    },
  })

  useEffect(() => {
    if (data) {
      const iface = new ethers.utils.Interface(WRAPPER_FACTORY_ABI);
      const newWrapperLog = iface.parseLog(data.logs?.[0])

      setCreatedWrapperAddress(newWrapperLog?.args?.wrapper)
    }
  }, [data])

  const onSubmit = async (data: WrapperDeployParams): Promise<void> => {
    setDeployTxHash("0x0")
    setCreatedWrapperAddress("0x0")

    return prepareWriteContract({
      address: FACTORY_ADDRESS,
      abi: WRAPPER_FACTORY_ABI,
      functionName: "deploy",
      args: [
        data.tokenAddress,
        data.wrapperAmount.mul(UNIT).div(data.tokenAmount),
        data.name,
        data.symbol,
        BigNumber.from(data.decimals)
      ]
    })
    .then((config) => {
      return writeContract(config)
      .then((result: SendTransactionResult) => {
        toast.info("Transaction has been submitted. Waiting for confirmation...")
        setDeployTxHash(result.hash)
      })
      .catch((error: any) => {
        toast.warning("Transaction has been rejected")
      })
    })
    .catch((error: any) => {
      toast.error("Error preparing deploy transaction")
    })
  }

  return (
    <ContentWrapper
      title="Factory"
      description="Create a new wrapper token."
    > 
      <CenteredContent size="sm">
        <Card className="p-0 m-0">
          <div className="w-100 text-justify p-4 pb-2">
            📙 A wrapper token is an ERC20 that can be exchanged at a fixed ratio to the supplied token.
          </div>

          <hr/>

          <Card.Body className="px-4">
            <div>
              <WrapperDeployForm 
                onSubmit={onSubmit} 
              />
            </div>

            {(Boolean(deployTxHash) && deployTxHash.length > 3 && !data) && (
              <Alert 
                className="my-4 text-center "
                variant="info"
              >
                <Spinner size="sm" />
                {" "}
                <span>Your transaction has been submitted.</span>
                {" 🔗"}
                <a
                  href={EXPLORER_TX_BASE_LINK + deployTxHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Check status on etherscan.</span>
                </a>
              </Alert>
            )}

            {data && (
              <Alert 
                className="my-4 text-center "
                variant="success"
              >
                ✅ Your wrapper contract has been created.
                {" "}
                <Link
                  href={"/wrappers/" + createdWrapperAddress}
                >
                  Go wrap your assets!
                </Link>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
