import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { WrapperListFilter } from "../types"

interface Props {
  value: WrapperListFilter,
  onChange: (filter: WrapperListFilter) => void,
}

export default function WrappersFilter({
  value,
  onChange
}: Props) {
  return (
    <div className="my-4 w-100 text-center">
      <div className="row">
        <div className="col-0 col-md-2 col-lg-3 col-xl-4"></div>
        <div className="col-12 col-md-8 col-lg-6 col-xl-4">
          <ButtonGroup className="w-100">
            <ToggleButton
              id="filter-all"
              variant={value === "all" ? "outline-primary" : "outline-secondary"}
              value={"all"}
              type="radio"
              checked={value === "all"}
              onChange={(e) => onChange(e.currentTarget.value as WrapperListFilter) }
              className="w-50"
            >  
               🔎 All
            </ToggleButton>

            <ToggleButton
              id="filter-owned"
              variant={value === "owned" ? "outline-primary" : "outline-secondary"}
              value={"owned"}
              type="radio"
              checked={value === "owned"}
              onChange={(e) => onChange(e.currentTarget.value as WrapperListFilter) }
              className="w-50"
            >  
              💼 Owned
            </ToggleButton>
          </ButtonGroup>  
        </div>
        <div className="col-0 col-md-2 col-lg-3 col-xl-4"></div>
      </div>
    </div>
  )
}
