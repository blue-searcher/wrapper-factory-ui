import { useEffect, useState } from "react"
import { Field } from 'formik'
import * as Yup from 'yup'
import Input from "./Input"
import Button from "react-bootstrap/Button"
import { BigNumber } from "ethers"
import { parseUnits, formatUnits } from "@ethersproject/units"

interface Props {
  name: string
  defaultValue?: string
  onChange: (v: BigNumber) => void,
  decimals: number
  max?: BigNumber
}

export default function BigDecimalInput(props: Props) {
  const {
    name,
    defaultValue = "0",
    decimals = 0,
    onChange,
    max,
    ...rest
  } = props

  const [bgValue, setBgValue] = useState<BigNumber>(BigNumber.from(defaultValue).pow(decimals))
  const [value, setValue] = useState<string>(defaultValue)

  useEffect(() => {
    try {
      const newBgValue: BigNumber = parseUnits(value, decimals)
      setBgValue(newBgValue)
    } catch(e: any) {
      setValue(defaultValue)
      setBgValue(parseUnits(defaultValue, decimals))
    }
  }, [value])

  useEffect(() => {
    onChange(bgValue)
  }, [bgValue])

  return (
    <div>
      <Field
        type="string"
        variant="outlined"
        name={name}
        value={value}
        component={Input}
        onChange={(e) => {
          setValue(e.target.value.replaceAll(",", "."))
        }}
        endAdornment={max ? (
          <>
            <Button 
              variant="light"
              className="text-uppercase text-primary"
              onClick={() => {
                setValue(formatUnits(max, decimals))
              }}
            >
              Max
            </Button>
          </>
        ) : undefined}
        {...rest}
      />
    </div>
  )
}
