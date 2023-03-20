import ContentWrapper from "../../components/layout/ContentWrapper"
import CenteredContent from "../../components/layout/CenteredContent"
import WrappersList from "../../components/WrappersList"

export default function Wrappers() {
  return (
    <ContentWrapper
      title="Wrappers"
      description="List of wrapper tokens created by Factory."
    > 
      <CenteredContent size="md">
    	  <WrappersList />
      </CenteredContent>
    </ContentWrapper>
  )
}
