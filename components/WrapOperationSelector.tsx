import ButtonGroup from "react-bootstrap/ButtonGroup"
import ToggleButton from "react-bootstrap/ToggleButton"
import { WrapOperationType } from "../types"

interface Props {
  value: WrapOperationType,
  onChange: (operationType: WrapOperationType) => void,
}

export default function OperationSelector({
  value,
  onChange
}: Props) {

  return (
    <div className="row">
      <div className="col-0 col-md-0 col-lg-2"></div>
      <div className="col-12 col-md-12 col-lg-8">
        <ButtonGroup 
          className="bg-light border border-1 w-100"
          style={{ borderRadius: "50px" }}
        >
          <ToggleButton
            type="checkbox"
            variant={value === "wrap" ? "primary" : "light"}
            checked={value === "wrap"}
            value={"wrap"}
            onClick={() => onChange("wrap")}
            className="py-2 w-50"
            style={{  borderRadius: "50px" }}
          >
            {"📥 Wrap"}
          </ToggleButton>

          <ToggleButton
            type="checkbox"
            variant={value === "unwrap" ? "primary" : "light"}
            checked={value === "unwrap"}
            value={"unwrap"}
            onClick={() => onChange("unwrap")}
            className="py-2 w-50"
            style={{ borderRadius: "50px" }}
          >
            {"📤 Unwrap"}
          </ToggleButton>
        </ButtonGroup>
      </div>
      <div className="col-0 col-md-0 col-lg-2"></div>
    </div>
  )
}
