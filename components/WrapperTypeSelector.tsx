import { useState } from "react";
import { WRAPPER_TYPES, WrapperTypeInfo } from "../constants"
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { WrapperType } from "../types"

interface Props {
  value: WrapperType,
  onChange: (id: WrapperType) => void,
}

export default function WrapperTypeSelector({
  value,
  onChange
}: Props) {
  return (
    <ButtonGroup 
      className="w-100 border-bottom border-1 border-dark"
      style={{ borderRadius: 0 }}
    >
      {WRAPPER_TYPES.map((type: WrapperTypeInfo) => (
        <ToggleButton
          key={type.id}
          id={`wrapper-type-radio-${type.id}`}
          variant="light"
          className={"p-0 py-3 text-center m-0 " + (value === type.id ? "border-bottom border-5 border-primary" : "")}
          value={type.id}
          type="radio"
          style={{ 
            borderRadius: 0, 
            backgroundColor: "transparent",
          }}
          checked={value === type.id}
          onChange={(e) => onChange(e.currentTarget.value as WrapperType) }
        >  
          {type.icon}
          <br/>
          {type.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  )
}
