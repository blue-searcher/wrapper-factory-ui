import { useEffect } from "react"
import { Formik, Form, Field, useFormikContext } from 'formik'
import * as Yup from 'yup'
import Input from "./Input"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import { useToken } from 'wagmi'
import { AddressZero } from "@ethersproject/constants"
import { toast } from 'react-toastify'
import Spinner from "react-bootstrap/Spinner"

export type FixedWrapperDeployParams = {
  tokenAddress: string,
  name: string,
  symbol: string,
  decimals: number,

  tokenAmount: number,
  wrapperAmount: number,
}

interface Props {
  onSubmit: (data: FixedWrapperDeployParams) => Promise<void>,
}

//0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e - YFI mainnet
//0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6 - weth goerli
//0x582072589dA9Dc9de7cb14aB98bd550A531909c4 - test token goerli
function InnerForm() {
  const { values, setFieldValue, isValid, isSubmitting } = useFormikContext<FixedWrapperDeployParams>();

  //TODO Do not fetch if tokenAddress is less than 42 chars 
  const tokenResult = useToken({ 
    address: values.tokenAddress as `0x${string}`,
    onError(error: any) {
      toast.error("Error fetching token information")
    },
  })
  const token = tokenResult?.data

  useEffect(() => {
    if (token) {
      setFieldValue("symbol", "w" + token?.symbol)
      setFieldValue("name", "Wrapped " + token?.name)
      setFieldValue("decimals", token?.decimals)
    }
  }, [token])

  return (
   <Form>
    <div className="form-group py-2 row">
      <div className="col-12">
        <Field
          type="text"
          name="tokenAddress"
          component={Input}
          label="Token address"
          placeholder={AddressZero}
        />
      </div>
    </div>

    <div className="form-group py-2 row">
      <div className="col-12 col-md-12 col-lg-6">
        <Field
          type="text"
          name="name"
          component={Input}
          label="Name"
          placeholder="Wrapped TOKEN"
        />
      </div>
      <div className="col-6 col-md-8 col-lg-4">
        <Field
          type="text"
          name="symbol"
          component={Input}
          label="Symbol"
          placeholder="wTOKEN"
        />
      </div>
      <div className="col-6 col-md-4 col-lg-2">
        <Field
          type="number"
          name="decimals"
          component={Input}
          label="Decimals"
          placeholder={"18"}
        />
      </div>
    </div>

    <div className="form-group py-4">
      <label>Ratio</label>
      <div className="d-flex justify-content-between text-center">
        <div>
          <Field
            type="number"
            variant="outlined"
            name="tokenAmount"
            component={Input}
            className="p-0 text-center"
          />
          <br/>
          <span className="font-weight-bold">{token?.symbol || "TOKEN"}</span>
        </div>

        <div className="w-50">
          <h2 className="text-primary">{"↔️"}</h2>
        </div>

        <div>
          <Field
            type="number"
            variant="outlined"
            name="wrapperAmount"
            component={Input}
          />
          <br/>
          <span className="font-weight-bold">{values?.symbol || "WRAPPER"}</span>
        </div>
      </div>
    </div>

    <div className="mt-4">
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
        {"🚀  "}
        Deploy
      </Button>
    </div>

   </Form>
  )
}


export default function FactoryFixedWrapperForm({
  onSubmit
}: Props) {

  const initialValues: FixedWrapperDeployParams = {
    tokenAddress: "",
    name: "",
    symbol: "",
    decimals: 18,

    tokenAmount: 1,
    wrapperAmount: 1,
  }

  const validation = Yup.object().shape({
    tokenAddress: Yup.string().required("Token address is required")
      .test('len', 'Must be exactly 42 characters', (val: string) => val.length === 42),
    name: Yup.string().required("Name is required"),
    symbol: Yup.string().required("Symbol is required"),
    decimals: Yup.number().integer()
      .required("Decimals are required")
      .min(0, "Lower value allowed is 0")
      .min(18, "Greatest value allowed is 18"),
    tokenAmount: Yup.number()
      .test('positive', 'Must be positive number', (val: number) => val > 0),
    wrapperAmount: Yup.number()
      .test('positive', 'Must be positive number', (val: number) => val > 0),
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
        <InnerForm/>
     </Formik>
    </div>
  )
}
