import { useState } from "react";
import { types } from "../wrapperTypes.tsx";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

interface Props {
  onChange: (id: Number) => void,
}

export default function WrapperTypeSelector({
  onChange
}: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <ButtonGroup 
      className="w-100 border-bottom border-1 border-dark"
      style={{ borderRadius: 0 }}
    >
      {types.map((type) => (
        <ToggleButton
          key={type.id}
          id={`wrapper-type-radio-${type.id}`}
          variant="light"
          className={"p-0 py-3 text-center m-0 " + (selected === type.id ? "border-bottom border-5 border-primary" : "")}
          value={type.id}
          type="radio"
          style={{ 
            borderRadius: 0, 
            backgroundColor: "transparent",
          }}
          checked={selected === type.id}
          onChange={(e) => {
            const newValue = parseInt(e.currentTarget.value)
            
            setSelected(newValue)
            onChange(newValue)
          }}
        >  
          {type.icon}
          <br/>
          {type.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  )
}
