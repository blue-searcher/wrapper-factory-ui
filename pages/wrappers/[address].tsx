import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import { useRouter } from 'next/router'
import { useState } from "react"
import Card from "react-bootstrap/Card"
import OperationSelector from "../../components/OperationSelector"
import WrapForm from "../../components/form/WrapForm"
import { WrapperInfo } from "../../components/form/WrapForm"
import { useContractReads, useContractRead, erc20ABI, useAccount } from 'wagmi'
import FIXED_RATIO_ABI from "../../abi/FixedRatio.json"
import UserBalances from "../../components/UserBalances"
import { ReadOutput, AccountResult } from "../../types"
import { useWrapperInfo } from "../../hooks"

export default function Wrapper() {
  const router = useRouter()
  const { address } = router.query
  const [operation, setOperation] = useState<number>(0)

  const info: WrapperInfo = useWrapperInfo(address as `0x${string}`)

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
            {operation === 0 ? (
              <WrapForm 
                info={info}
              />
            ) : (
              <>TODO</>
            )}
          </div>
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
