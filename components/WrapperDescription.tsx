import { WRAPPER_TYPES } from "../constants"

interface Props {
  wrapperId: number,
}

export default function WrapperDescription({
  wrapperId
}: Props) {
  const wrapper = WRAPPER_TYPES.find(el => el.id === wrapperId);

  return (
    <div className="text-justify mt-2 text-muted px-4 py-3 ">
      {"📙 " + (wrapper?.description || "")}
    </div>
  )
}
