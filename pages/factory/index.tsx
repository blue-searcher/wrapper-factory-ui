import { useState } from "react"
import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import WrapperTypeSelector from "../../components/WrapperTypeSelector"
import WrapperDescription from "../../components/WrapperDescription"
import FactoryFixedWrapperForm from "../../components/form/FactoryFixedWrapperForm"
import Card from "react-bootstrap/Card"

export default function Factory() {
  const [wrapperId, setWrapperId] = useState<Number>(0)

  return (
    <ContentWrapper
      title="Factory"
      description="Create a new wrapper token."
    > 
      <CenteredContent>
        <Card className="p-0 m-0">
          <div className="w-100" >
            <WrapperTypeSelector onChange={(id: Number) => setWrapperId(id)} />
            <WrapperDescription wrapperId={wrapperId} />
          </div>

          <Card.Body className="px-4">
            <div>
              {wrapperId === 0 ? (
                <FactoryFixedWrapperForm />
              ) : (
                <span>TODO</span>
              )}
            </div>
          </Card.Body>
        </Card>
      </CenteredContent>
    </ContentWrapper>
  )
}
