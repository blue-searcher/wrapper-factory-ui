import { useState } from "react"
import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import WrapperTypeSelector from "../../components/WrapperTypeSelector"
import WrapperDescription from "../../components/WrapperDescription"
import FactoryFixedWrapperForm from "../../components/form/FactoryFixedWrapperForm"
import { FixedWrapperDeployParams } from "../../components/form/FactoryFixedWrapperForm"
import Card from "react-bootstrap/Card"
import { FACTORY_ADDRESS } from "../../constants"
import WRAPPER_FACTORY_ABI from "../../abi/WrapperFactory.json"
import { prepareWriteContract, writeContract, SendTransactionResult } from '@wagmi/core'
import { BigNumber } from "ethers"
import { toast } from 'react-toastify'

export default function Factory() {
  const [wrapperId, setWrapperId] = useState<Number>(0)

  const onSubmit = async (data: FixedWrapperDeployParams): Promise<void> => {
    return prepareWriteContract({
      address: FACTORY_ADDRESS as `0x${string}`,
      abi: WRAPPER_FACTORY_ABI,
      functionName: 'deployFixedRatio',
      args: [
        data.tokenAddress,
        BigNumber.from(data.wrapperAmount).div(data.tokenAmount).mul("1000000000000000000"),
        data.name,
        data.symbol,
        BigNumber.from(data.decimals)
      ],
    })
    .then((config) => {
      return writeContract(config)
      .then((result: SendTransactionResult) => {
        toast.info("Transaction has been submitted. Waiting for confirmation...")
        console.log(result)
      })
      .catch((error: any) => {
        toast.warning("Transaction has been rejected")
      })
    })
    .catch((error: any) => {
      toast.error("Error preparing transaction")
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
            <WrapperTypeSelector onChange={(id: Number) => setWrapperId(id)} />
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
          </Card.Body>
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
