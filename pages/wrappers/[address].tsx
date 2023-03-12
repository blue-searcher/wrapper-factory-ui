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

type ReadOutput<T> = {
  data: T | undefined,
  isLoading: boolean,
  isError: boolean,
}

type AccountResult = {
  address: string,
  isConnecting: boolean,
  isDisconnected: boolean,
  isConnected: boolean,
}

function formatWrapperInfo(
  wrapperByAddressRead: ReadOutput<string>, 
  baseInfoRead: ReadOutput<Array<any>>,
  address: string
): WrapperInfo | undefined {
  if (wrapperByAddressRead?.data && baseInfoRead?.data) {
    const result: WrapperInfo = {
      address: address,
      wrapperDecimals: baseInfoRead.data?.[4],
      wrapperSymbol: baseInfoRead.data?.[5],
      wrapperBalance: baseInfoRead.data?.[3],

      token: wrapperByAddressRead?.data,
      tokenBalance: baseInfoRead.data?.[0],
      tokenDecimals: baseInfoRead?.data?.[1],
      tokenSymbol: baseInfoRead?.data?.[2],

      allowance: baseInfoRead?.data?.[6],
      liquidity: baseInfoRead?.data?.[7],
    }
    return result;
  }

  return undefined;
}

export default function Wrapper() {
  const router = useRouter()
  const { address } = router.query
  const [operation, setOperation] = useState<number>(0)

  const accountResult: AccountResult = useAccount()

  const wrapperByAddressRead: ReadOutput<string> = useContractRead({
    address: address as `0x${string}`,
    abi: FIXED_RATIO_ABI, //The kind of wrapper abi used here doesn't matter
    functionName: "WRAPPED"
  })

  const baseInfoRead: ReadOutput<Array<any>> = useContractReads({
    contracts: [
      {
        address: wrapperByAddressRead?.data as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [accountResult.address as `0x${string}`]
      },
      {
        address: wrapperByAddressRead?.data as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals'
      },
      {
        address: wrapperByAddressRead?.data as `0x${string}`,
        abi: erc20ABI,
        functionName: 'symbol'
      },

      {
        address: address as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [accountResult.address as `0x${string}`]
      },
      {
        address: address as `0x${string}`,
        abi: erc20ABI,
        functionName: 'decimals'
      },
      {
        address: address as `0x${string}`,
        abi: erc20ABI,
        functionName: 'symbol'
      },

      {
        address: wrapperByAddressRead?.data as `0x${string}`,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [
          accountResult.address as `0x${string}`,
          address as `0x${string}`
        ]
      },
      {
        address: wrapperByAddressRead?.data as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      }
    ],
    enabled: Boolean(wrapperByAddressRead?.data && accountResult?.address)
  })

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
                info={formatWrapperInfo(wrapperByAddressRead, baseInfoRead, address)}
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
