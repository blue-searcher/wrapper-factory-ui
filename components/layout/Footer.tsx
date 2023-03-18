import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { ConnectKitButton } from 'connectkit'
import { FaGithub } from 'react-icons/fa'
import { FaEthereum } from 'react-icons/fa'
import { EXPLORER_ADDRESS_BASE_LINK, FACTORY_ADDRESS } from "../../constants"

export default function Footer() {
  return (
    <Navbar 
      className="w-100 text-center"
    >
      <Container>
        <Navbar.Collapse className="text-center justify-content-center">
          <div className="px-4">
            <a
              href="https://github.com/blue-searcher/wrapper-factory"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark"
            >
              <h3><FaGithub /></h3>
            </a>
          </div>
          <div className="px-4">
            <a
              href={EXPLORER_ADDRESS_BASE_LINK + FACTORY_ADDRESS}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark"
            >
              <h3><FaEthereum /></h3>
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
