import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import { useRouter } from 'next/router'
import { useState } from "react"
import Card from "react-bootstrap/Card"
import WrapOperationSelector from "../../components/WrapOperationSelector"
import WrapUnwrapForm from "../../components/form/WrapUnwrapForm"
import { useWaitForTransaction } from 'wagmi'
import { prepareWriteContract, writeContract, SendTransactionResult } from '@wagmi/core'
import WRAPPER_TOKEN_ABI from "../../abi/WrapperToken.json"
import { WrapUnwrapFormParams, WrapperInfo, WrapOperationType } from "../../types"
import { useWrapperInfo } from "../../hooks"
import { EXPLORER_TX_BASE_LINK } from "../../constants"
import { toast } from 'react-toastify'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { BigNumber } from "ethers"

export default function Wrapper() {
  const router = useRouter()
  const { address } = router.query

  const [wrapOperation, setWrapOperation] = useState<WrapOperationType>("wrap")
  const [txHash, setTxHash] = useState<`0x${string}`>("0x0")

  const info: WrapperInfo = useWrapperInfo(address as `0x${string}`)

  const { data } = useWaitForTransaction({
    hash: txHash,
    enabled: Boolean(txHash && txHash.length > 3),
    onSuccess(data: any) {
      toast.success("Transaction has been confirmed")
    },
    onError(error: any) {
      toast.error("Error on wrap/unwrap transaction")
    },
  })

  const onSubmit = async (data: WrapUnwrapFormParams): Promise<void> => {
    setTxHash("0x0")

    return prepareWriteContract({
      address: address as `0x${string}`,
      abi: WRAPPER_TOKEN_ABI,
      functionName: data.functionName,
      args: [
        data.amount,
        data.receiver
      ],
    })
    .then((config) => {
      return writeContract(config)
      .then((result: SendTransactionResult) => {
        toast.info("Transaction has been submitted. Waiting for confirmation...")
        setTxHash(result.hash)
      })
      .catch((error: any) => {
        toast.warning("Transaction has been rejected")
      })
    })
    .catch((error: any) => {
      toast.error("Error preparing wrap/unwrap transaction")
    })
  }

  return (
    <ContentWrapper
      title="Wrapper"
      description="Wrap or unwrap your assets."
    > 
      <CenteredContent size="sm">
        <Card className="p-4">
          <div className="py-4 px-2 text-center">
            <WrapOperationSelector 
              value={wrapOperation} 
              onChange={(operationType: WrapOperationType) => setWrapOperation(operationType)} 
            />
          </div>

          <div>
            <WrapUnwrapForm 
              info={info}
              functionName={wrapOperation}
              onSubmit={onSubmit}
            />
          </div>

          {(Boolean(txHash) && txHash.length > 3 && !data) && (
            <Alert 
              className="my-4 text-center "
              variant="info"
            >
              <Spinner size="sm" />
              {" "}
              <span>Your transaction has been submitted.</span>
              {" 🔗"}
              <a
                href={EXPLORER_TX_BASE_LINK + txHash}
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
              <span>{"✅ Your "}</span>
              <span>{wrapOperation}</span>
              <span>{" transaction has been confirmed."}</span>
            </Alert>
          )}
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
