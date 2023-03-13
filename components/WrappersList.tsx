import WrapperCard from "./WrapperCard"
import { useTotalWrappersCount } from "../hooks"

export default function WrappersList() {
  const totalWrappers: number = useTotalWrappersCount()

  console.log("totalWrappers", totalWrappers)
  
  const wrapperIds = Array.from(Array(totalWrappers + 1).keys()).sort((a: number, b: number) => b - a)

  return (
    <div className="row">
      {wrapperIds.map((wrapperId: number) => (
        <div 
          className="col-12"
          key={"wrapper-card-" + wrapperId} 
        >
          <WrapperCard 
            wrapperId={wrapperId} 
          />
        </div>
      ))}
    </div>
  )
}
