import { useEffect } from "react"
import { Formik, Form, Field, useFormikContext } from 'formik'
import * as Yup from 'yup'
import Input from "./Input"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import { MaxUint256 } from "@ethersproject/constants"
import { toast } from 'react-toastify'
import Spinner from "react-bootstrap/Spinner"
import { BigNumber } from "ethers"
import WRAPPER_TOKEN_ABI from "../../abi/WrapperToken.json"
import { UNIT } from "../../constants"
import { useContractRead, usePrepareContractWrite, useWaitForTransaction, useContractWrite, useAccount } from 'wagmi'
import { useAmountsOut } from "../../hooks"
import { WrapUnwrapFormParams, WrapperInfo, AccountResult, AmountsOut, WrapOperationType } from "../../types"
import { FaExternalLinkAlt } from 'react-icons/fa'
import { EXPLORER_ADDRESS_BASE_LINK } from "../../constants"
import ConnectWallet from "../ConnectWallet"
import BigDecimalInput from "./BigDecimalInput"
import { parseUnits, formatUnits } from "@ethersproject/units"

interface Props {
  info: WrapperInfo,
  onSubmit: (data: WrapUnwrapFormParams) => Promise<void>,
  functionName: WrapOperationType
}

interface ReportProps {
  info: WrapperInfo,
  amountIn: BigNumber,
}

interface BalanceProps {
  info: WrapperInfo,
  functionName: WrapOperationType,
}

function WrapReport({
  info, 
  amountIn
}: ReportProps) {
  const amountsOut: AmountsOut = useAmountsOut(info?.wrapper?.address, amountIn, undefined)

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">You will receive</span>
        <div>
          <span>{formatUnits(amountsOut?.wrap || "0", info?.wrapper?.decimals || 0)}</span>
          {" "}
          <span>{info?.wrapper?.symbol}</span>
        </div>
      </div>
    </div>
  )
}

function UnwrapReport({
  info, 
  amountIn
}: ReportProps) {
  const amountsOut: AmountsOut = useAmountsOut(info?.wrapper?.address, undefined, amountIn)

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">You will receive</span>
        <div>
          <span>{formatUnits(amountsOut?.unwrap || "0", info?.token?.decimals || 0)}</span>
          {" "}
          <span>{info?.token?.symbol}</span>
        </div>
      </div>
    </div>
  )
}

function Balance({
  info, 
  functionName
}: BalanceProps) {
  return (
    <div>
      {functionName === "wrap" ? (
        <div>
          <span>Balance:</span>
          {" "}
          <span>{formatUnits(info?.token?.balance || "0", info?.token?.decimals || 0)}</span>
          {" "}
          <span>{info?.token?.symbol}</span>
        </div>
      ) : (
        <div>
          <span>Balance:</span>
          {" "}
          <span>{formatUnits(info?.wrapper?.balance || "0", info?.wrapper?.decimals || 0)}</span>
          {" "}
          <span>{info?.wrapper?.symbol}</span>
        </div>
      )}
    </div>
  )
}

const isApproveRequired = (amount: BigNumber, info: WrapperInfo): boolean => {
  return info?.tokenAllowance?.eq(BigNumber.from(0)) 
    || amount.gt(info?.tokenAllowance || BigNumber.from(0))
}

export default function WrapUnwrapForm({
  info,
  functionName,
  onSubmit,
}: Props) {
  const accountResult: AccountResult = useAccount()

  const initialValues: WrapUnwrapFormParams = {
    amount: BigNumber.from(0),
    receiver: accountResult?.address,
    functionName: functionName,
  } 

  const validation = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .test('positive', 'Must be positive number', (val: number) => val > 0),
    receiver: Yup.string().required()
  })

  const { config } = usePrepareContractWrite({
    address: info?.token?.address,
    abi: WRAPPER_TOKEN_ABI,
    functionName: 'approve',
    args: [
      info?.wrapper?.address,
      MaxUint256
    ],
    onError(error: any) {
      toast.error("Error preparing approve transaction")
    },
  })
  const { data, write } = useContractWrite({
    ...config,
    onError(error: any) {
      toast.error("Approve transaction has been rejected")
    },
    onSuccess(data: any) {
      toast.info("Transaction has been submitted. Waiting for confirmation...")
    }
  })

  useWaitForTransaction({
    hash: data?.hash,
    enabled: Boolean(data?.hash && data?.hash.length > 3),
    onSuccess(data: any) {
      toast.success("Transaction has been confirmed")
    },
    onError(error: any) {
      toast.error("Error on approve transaction")
    },
  })

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validation}
        validateOnBlur
        validateOnChange
        validateOnMount
        onSubmit={ async (values, { setSubmitting }) => {
          await onSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ isValid, isSubmitting, values, setFieldValue }) => (
          <Form>
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <a
                href={EXPLORER_ADDRESS_BASE_LINK + info?.wrapper?.address}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="p-1 font-weight-bold"><FaExternalLinkAlt /></span>
              </a>
            </div>

            <div className="form-group py-2 row">
              <div className="col-12">
                <div className="w-100 text-muted" style={{ textAlign: "right" }}>
                  <Balance 
                    info={info}
                    functionName={values.functionName}
                  />
                </div>
                <BigDecimalInput
                  name="amount"
                  decimals={values.functionName === "wrap" ? info?.token?.decimals : info?.wrapper?.decimals}
                  onChange={(v: BigNumber) => setFieldValue("amount", v)}
                  defaultValue={"0"}
                  max={values.functionName === "wrap" ? info?.token?.balance : info?.wrapper?.balance}
                />
              </div>
            </div>

            {values.functionName === "wrap" ? (
              <WrapReport
                info={info}
                amountIn={values.amount}
              />
            ) : (
              <UnwrapReport
                info={info}
                amountIn={values.amount}
              />
            )}
              
            <div className="mt-4">
              {(accountResult?.isConnecting || !accountResult?.isConnected || accountResult?.isReconnecting) ? (
                <div className="d-flex">
                  <>
                    <ConnectWallet 
                      variant="primary"
                      className="w-100 py-3 font-weight-bold" 
                    />  
                  </>
                </div>
              ) : (
                <>
                  {(values.functionName === "wrap" && isApproveRequired(values.amount, info)) ? (
                    <Button 
                      variant="primary"
                      type="button"
                      disabled={!write}
                      onClick={() => write?.()}
                      className="w-100 py-3 text-uppercase font-weight-bold"
                    >
                      {"⚠️ "}
                      Approve
                    </Button>
                  ) : (
                    <>
                      {values.functionName === "wrap" ? (
                        <Button 
                          variant="primary"
                          type="submit"
                          className="w-100 py-3 text-uppercase font-weight-bold"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting && (
                            <>
                              <Spinner animation="border" size="sm" />
                              {"  "}
                            </>
                          )}
                          {"📥  "}
                          Wrap
                        </Button>
                      ) : (
                        <Button 
                          variant="primary"
                          type="submit"
                          className="w-100 py-3 text-uppercase font-weight-bold"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting && (
                            <>
                              <Spinner animation="border" size="sm" />
                              {"  "}
                            </>
                          )}
                          {"📤  "}
                          Unwrap
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
