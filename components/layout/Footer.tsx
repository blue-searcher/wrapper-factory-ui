import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { ConnectKitButton } from 'connectkit'
import { FaGithub } from 'react-icons/fa'
import { FaEthereum } from 'react-icons/fa'

export default function Footer() {
  return (
    <Navbar 
      className="w-100 text-center"
    >
      <Container>
        <Navbar.Collapse className="text-center justify-content-center">
          <div className="px-4">
            <a
              href="https://github.com/blue-searcher/wrapped-factory"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark"
            >
              <h3><FaGithub /></h3>
            </a>
          </div>
          <div className="px-4">
            <a
              href="https://goerli.etherscan.io/address/0x23b1ee0f7dab3a47c0326c75b339a6af53379278"
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
