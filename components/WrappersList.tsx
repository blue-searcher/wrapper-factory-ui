import WrapperCard from "./WrapperCard"
import { useTotalWrappersCount } from "../hooks"
import Link from 'next/link'
import Alert from "react-bootstrap/Alert"

export default function WrappersList() {
  const totalWrappers: number = useTotalWrappersCount()

  const wrapperIds: number[] = Array.from(Array(totalWrappers + 1).keys()).sort((a: number, b: number) => b - a)

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

      {wrapperIds.length <= 0 && (
        <Alert 
          className="my-4 text-center "
          variant="primary"
        >
          <span>{"There are no wrappers yet."}</span>
          {" 🪄 "}
          <Link href={"/factory"}>
            {"Create the first one"}
          </Link>
        </Alert>
      )}
    </div>
  )
}
