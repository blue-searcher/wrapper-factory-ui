import { useState, useEffect } from "react"
import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import WrapperTypeSelector from "../../components/WrapperTypeSelector"
import WrapperDescription from "../../components/WrapperDescription"
import FactoryFixedWrapperForm from "../../components/form/FactoryFixedWrapperForm"
import { FixedWrapperDeployParams } from "../../components/form/FactoryFixedWrapperForm"
import Card from "react-bootstrap/Card"
import { FACTORY_ADDRESS, EXPLORER_TX_BASE_LINK, UNIT } from "../../constants"
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
  const [wrapperId, setWrapperId] = useState<number>(0)
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

  const onSubmit = async (data: FixedWrapperDeployParams): Promise<void> => {
    setDeployTxHash("0x0")
    setCreatedWrapperAddress("0x0")

    return prepareWriteContract({
      address: FACTORY_ADDRESS,
      abi: WRAPPER_FACTORY_ABI,
      functionName: 'deployFixedRatio',
      args: [
        data.tokenAddress,
        BigNumber.from(data.wrapperAmount).div(data.tokenAmount).mul(UNIT),
        data.name,
        data.symbol,
        BigNumber.from(data.decimals)
      ],
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
          <div className="w-100" >
            <WrapperTypeSelector onChange={(id: number) => setWrapperId(id)} />
            <WrapperDescription wrapperId={wrapperId} />
          </div>

          <Card.Body className="px-4">
            <div>
              {wrapperId === 0 ? (
                <FactoryFixedWrapperForm onSubmit={onSubmit} />
              ) : (
                <span>TODO</span>
              )}
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
