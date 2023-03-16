import WrapperCard from "./WrapperCard"
import { useTotalWrappersCount } from "../hooks"
import Link from 'next/link'
import Alert from "react-bootstrap/Alert"
import WrappersFilter from "./WrappersFilter"
import { WrapperListFilter } from "../types"
import { useState } from "react"

export default function WrappersList() {
  const [filter, setFilter] = useState<WrapperListFilter>("all");

  const totalWrappers: number = useTotalWrappersCount()

  const wrapperIds: number[] = Array.from(Array(totalWrappers).keys()).sort((a: number, b: number) => b - a)

  return (
    <div>
      <WrappersFilter 
        value={filter}
        onChange={(f: WrapperListFilter) => setFilter(f)}
      />

      <div className="row">
        {wrapperIds.map((wrapperId: number) => (
          <div 
            className="col-12"
            key={"wrapper-card-" + wrapperId} 
          >
            <WrapperCard 
              wrapperId={wrapperId}
              filter={filter} 
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
    </div>
  )
}
