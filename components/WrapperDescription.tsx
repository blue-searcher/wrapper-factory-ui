import { WRAPPER_TYPES, WrapperTypeInfo } from "../constants"
import { WrapperType } from "../types"

interface Props {
  type: WrapperType
}

export default function WrapperDescription({
  type
}: Props) {
  const wrapper: WrapperTypeInfo = WRAPPER_TYPES.find(el => el.id === type);

  return (
    <div className="text-justify mt-2 text-muted px-4 py-3 ">
      {"📙 " + (wrapper?.description || "")}
    </div>
  )
}
