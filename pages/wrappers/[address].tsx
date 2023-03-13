import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import { useRouter } from 'next/router'
import { useState } from "react"
import Card from "react-bootstrap/Card"
import OperationSelector from "../../components/OperationSelector"
import WrapUnwrapForm from "../../components/form/WrapUnwrapForm"
import { useWaitForTransaction } from 'wagmi'
import { prepareWriteContract, writeContract, SendTransactionResult } from '@wagmi/core'
import FIXED_RATIO_ABI from "../../abi/FixedRatio.json"
import UserBalances from "../../components/UserBalances"
import { ReadOutput, WrapUnwrapFormParams } from "../../types"
import { useWrapperInfo } from "../../hooks"

export default function Wrapper() {
  const router = useRouter()
  const { address } = router.query

  const [operation, setOperation] = useState<number>(0)
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
      address: address,
      abi: FIXED_RATIO_ABI,
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
            <OperationSelector 
              value={operation} 
              onChange={(id: number) => setOperation(id)} 
            />
          </div>

          <div>
            <WrapUnwrapForm 
              info={info}
              functionName={operation === 0 ? "wrap" : "unwrap"}
              onSubmit={onSubmit}
            />
          </div>
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
