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
import FIXED_RATIO_ABI from "../../abi/FixedRatio.json"
import { UNIT } from "../../constants"
import { useContractRead, usePrepareContractWrite, useWaitForTransaction, useContractWrite, useAccount } from 'wagmi'
import { useAmountsOut, useRatio } from "../../hooks"
import { WrapUnwrapFormParams, WrapperInfo, AccountResult, AmountsOut, WrapOperationType } from "../../types"
import { FaExternalLinkAlt } from 'react-icons/fa'
import { EXPLORER_ADDRESS_BASE_LINK } from "../../constants"
import ConnectWallet from "../ConnectWallet"

interface Props {
  info: WrapperInfo,
  onSubmit: (data: WrapUnwrapFormParams) => Promise<void>,
  functionName: WrapOperationType
}

interface ReportProps {
  info: WrapperInfo,
  amountIn: BigNumber,
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
          <span>{amountsOut?.wrap?.div(BigNumber.from(10).pow(info?.wrapper?.decimals || 0))?.toString() || "0"}</span>
          {" "}
          <span>{info?.wrapper.symbol}</span>
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
          <span>{amountsOut?.unwrap?.div(BigNumber.from(10).pow(info?.token?.decimals || 0))?.toString() || "0"}</span>
          {" "}
          <span>{info?.token.symbol}</span>
        </div>
      </div>
    </div>
  )
}

const getMaxAmount = (wrapOperationType: WrapOperationType, info: WrapperInfo): number => {
  const tokenType = wrapOperationType === "wrap" ? "token" : "wrapper"
  return info?.[tokenType]?.balance?.div(BigNumber.from(10).pow(info?.[tokenType]?.decimals || 0))?.toNumber()
}

const isApproveRequired = (amount: number, info: WrapperInfo): boolean => {
  return info?.tokenAllowance?.eq(BigNumber.from(0)) 
    || BigNumber.from(amount).mul(BigNumber.from(10).pow(info?.token.decimals || 0))
      .gt(info?.tokenAllowance || BigNumber.from(0))
}

const valueToBigNumber = (
  amount: number, 
  operation: WrapOperationType, 
  info: WrapperInfo
): BigNumber => {
  if (operation === "wrap") {
    return BigNumber.from(amount).mul(BigNumber.from(10).pow(info?.token?.decimals || 0))
  }
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(info?.wrapper?.decimals || 0))
}

export default function WrapUnwrapForm({
  info,
  functionName,
  onSubmit,
}: Props) {
  const accountResult: AccountResult = useAccount()

  const initialValues: WrapUnwrapFormParams = {
    amount: 0,
    receiver: accountResult?.address,
    functionName: functionName,
  } 

  const validation = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .test('positive', 'Must be positive number', (val: number) => val > 0)
      .test('cantExceedBalance', "Can't exceed balance", (val: number) => {
        if (val) {
          if (functionName === "wrap") {
            return BigNumber.from(val).mul(BigNumber.from(10).pow(info?.token?.decimals || 0)).lte(info?.token?.balance)
          }
          return BigNumber.from(val).mul(BigNumber.from(10).pow(info?.wrapper?.decimals || 0)).lte(info?.wrapper?.balance)
        }
      }),
    receiver: Yup.string().required()
  })

  const { config } = usePrepareContractWrite({
    address: info?.token?.address,
    abi: FIXED_RATIO_ABI,
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
                <div className="d-flex">
                  <div className="w-100">
                    <Field
                      type="number"
                      name="amount"
                      component={Input}
                      label="Amount"
                      placeholder={"Amount"}
                      endAdornment={
                        <Button 
                          variant="light"
                          className="text-uppercase text-primary"
                          onClick={() => {
                            setFieldValue("amount", getMaxAmount(values.functionName, info))
                          }}
                        >
                          Max
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {values.functionName === "wrap" ? (
              <WrapReport
                info={info}
                amountIn={BigNumber.from(values.amount).mul(BigNumber.from(10).pow(info?.token?.decimals || 0))}
              />
            ) : (
              <UnwrapReport
                info={info}
                amountIn={BigNumber.from(values.amount).mul(BigNumber.from(10).pow(info?.wrapper?.decimals || 0))}
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
