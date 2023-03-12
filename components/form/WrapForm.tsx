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
import { useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi'

export type WrapperInfo = {
  address: string,
  wrapperSymbol: string,
  wrapperDecimals: number
  wrapperBalance: BigNumber,

  token: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenBalance: BigNumber,

  allowance: BigNumber,
  liquidity: BigNumber,
}

interface Props {
  info: WrapperInfo,
}

type WrapParams = {
  amount: number,
}

interface ReportProps {
  info: WrapperInfo,
  amountIn: BigNumber,
}

type ReadOutput<T> = {
  data: T | undefined,
  isLoading: boolean,
  isError: boolean,
}

function Report({
  info, 
  amountIn
}: ReportProps) {
  const amountOutRead: ReadOutput<BigNumber> = useContractRead({
    address: info?.address as `0x${string}`,
    abi: FIXED_RATIO_ABI, //The kind of wrapper abi used here doesn't matter
    functionName: "getWrapAmountOut",
    args: [amountIn],
    enabled: Boolean(amountIn && amountIn.gt(0))
  })

  const ratioRead: ReadOutput<BigNumber> = useContractRead({
    address: info?.address as `0x${string}`,
    abi: FIXED_RATIO_ABI, //The kind of wrapper abi used here doesn't matter
    functionName: "ratio"
  })

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">You will receive</span>
        <div>
          {amountOutRead?.isLoading ? (
            <Spinner size="sm"/>
          ) : (
            <span>{amountOutRead?.data?.div(BigNumber.from(10).pow(info?.wrapperDecimals || 0))?.toString() || "0"}</span>
          )}
          {" "}
          <span>{info?.wrapperSymbol}</span>
        </div>
      </div>
      <div className="d-flex justify-content-between my-2">
        <span className="text-muted">Ratio</span>
        <div>
          {ratioRead?.isLoading ? (
            <Spinner size="sm"/>
          ) : (
            <span>{"1 : " + (ratioRead?.data?.div(BigNumber.from(10).pow(18))?.toString() || "-")}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WrapForm({
  info,
}: Props) {
  const initialValues: WrapParams = {
    amount: 0,
  }

  const validation = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .test('positive', 'Must be positive number', (val: number) => val > 0),
  })

  const { config } = usePrepareContractWrite({
    address: info?.token as `0x${string}`,
    abi: FIXED_RATIO_ABI,
    functionName: 'approve',
    args: [
      info?.address as `0x${string}`,
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
                            setFieldValue("amount", info?.tokenBalance.div(BigNumber.from(10).pow(info?.tokenDecimals)))
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

            <Report
              info={info}
              amountIn={BigNumber.from(values.amount).mul(BigNumber.from(10).pow(info?.tokenDecimals || 1))}
            />

            <div className="mt-4">
              {BigNumber.from(values.amount).mul(info?.tokenDecimals || 0).lt(info?.allowance || BigNumber.from(0)) ? (
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
