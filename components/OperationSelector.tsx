import ButtonGroup from "react-bootstrap/ButtonGroup"
import ToggleButton from "react-bootstrap/ToggleButton"

interface Props {
  value: number,
  onChange: (operationId: number) => void,
}

export default function OperationSelector({
  value,
  onChange
}: Props) {

  return (
    <ButtonGroup 
      className="bg-light border border-1 w-50"
      style={{ borderRadius: "50px" }}
    >
      <ToggleButton
        type="checkbox"
        variant={value === 0 ? "primary" : "light"}
        checked={value === 0}
        value={"0"}
        onClick={() => onChange(0)}
        className="py-2 w-50"
        style={{  borderRadius: "50px" }}
      >
        {"📥 Wrap"}
      </ToggleButton>

      <ToggleButton
        type="checkbox"
        variant={value === 1 ? "primary" : "light"}
        checked={value === 1}
        value={"1"}
        onClick={() => onChange(1)}
        className="py-2 w-50"
        style={{ borderRadius: "50px" }}
      >
        {"📤 Unwrap"}
      </ToggleButton>
    </ButtonGroup>
  )
}
