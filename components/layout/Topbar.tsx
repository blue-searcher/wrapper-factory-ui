import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { useState } from "react"

export default function Topbar() {
  const { isConnected } = useAccount()

  return (
    <Navbar expand="md">
      <Container>
        <Navbar.Brand href="#">
          <div className="font-weight-bold">Wrapper Factory</div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="text-center justify-content-center">
          <Nav 
            className="text-uppercase" 
            defaultActiveKey={"factory"}
          > 
            <Nav.Link 
              className={"px-3 py-2 border-top border-bottom border-1 border-primary"}
              eventKey={"factory"}
              href="/factory"
            >
              <span>🏭 Factory</span>
            </Nav.Link>
            <Nav.Link 
              className={"px-3 py-2"}
              eventKey={"wrappers"}
              href="/wrappers"
            >
              <span>🔎 Wrappers</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Nav.Item>
          <ConnectKitButton />
        </Nav.Item>
      </Container>
    </Navbar>
  )
}
