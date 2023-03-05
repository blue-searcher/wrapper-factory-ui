import { types } from "../wrapperTypes.tsx";

interface Props {
  wrapperId: Number,
}

export default function WrapperDescription({
  wrapperId
}: Props) {
  const wrapper = types.find(el => el.id === wrapperId);

  return (
    <div className="text-justify mt-2 text-muted px-4 py-3 ">
      {"📙 " + (wrapper?.description || "")}
    </div>
  )
}
