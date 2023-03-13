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
import { useContractRead, usePrepareContractWrite, useContractWrite, useAccount } from 'wagmi'
import { useAmountsOut, useRatio } from "../../hooks"
import { WrapUnwrapFormParams, AccountResult, WrapOperationType } from "../../utils"

interface Props {
  info: WrapperInfo,
  onSubmit: (data: WrapUnwrapFormParams) => Promise<void>,
  functionName: WrapOperationType
}

interface ReportProps {
  functionName: WrapOperationType,
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
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">Ratio</span>
        <div>
          <span>{"1 : TODO"}</span>
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
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">Ratio</span>
        <div>
          <span>{"1 : TODO"}</span>
        </div>
      </div>
    </div>
  )
}

const getMaxAmount = (wrapOperationType: WrapOperationType, info: WrapperInfo): BigNumber => {
  const tokenType = wrapOperationType === "wrap" ? "wrapper" : "token"
  return info?.[tokenType]?.balance?.div(BigNumber.from(10).pow(info?.[tokenType]?.decimals || 0))
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
      .test('positive', 'Must be positive number', (val: number) => val > 0),
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
  const { write } = useContractWrite({
    ...config,
    onError(error: any) {
      toast.error("Approve transaction has been rejected")
    },
    onSuccess(data: any) {
      toast.info("Transaction has been submitted. Waiting for confirmation...")
    }
  })

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        validateOnMount
        onSubmit={ async (values, { setSubmitting }) => {
          await onSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ isValid, isSubmitting, values, setFieldValue }) => (
          <Form>
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
              {BigNumber.from(values.amount).mul(info?.token.decimals || 0).lt(info?.tokenAllowance || BigNumber.from(0)) ? (
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
                  type="button"
                  disabled={!write || !isValid || isSubmitting}
                  onClick={() => write?.()}
                  className="w-100 py-3 text-uppercase font-weight-bold"
                >
                  {isSubmitting && (
                    <>
                      <Spinner animation="border" size="sm" />
                      {"  "}
                    </>
                  )}
                  {"⚠️ "}
                  Approve
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
