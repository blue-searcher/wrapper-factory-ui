import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useAccount } from 'wagmi'
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import ConnectWallet from "../ConnectWallet"

type Page = {
  href: string,
  name: string,
  icon: string
}

const PAGES: Page[] = [
  {
    href: "/wrappers",
    name: "Wrappers",
    icon: "🔎"
  },
  {
    href: "/factory",
    name: "Factory",
    icon: "🏭"
  },
]

export default function Topbar() {
  const { isConnected } = useAccount()
  
  const router = useRouter()

  const [activePage, setActivePage] = useState("")

  useEffect(() => {
    PAGES.forEach((p: Page) => {
      if (router.pathname && router.pathname.includes(p.href)) {
        setActivePage(p.name)
      }
    })
  }, [router])

  const getPageLinkClassNames = (key: string) => {
    if (key === activePage) {
      return "border-bottom border-3 border-primary font-weight-bold text-dark"
    }
    return ""
  }

  return (
    <Navbar expand="md" style={{ marginBottom: 50 }}>
      <Container>
        <Navbar.Brand href="#">
          <div className="font-weight-bold">Wrapper Factory</div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="text-center justify-content-center">
          <Nav className="text-uppercase"> 
            {PAGES.map((p: Page) => (
              <Nav.Link 
                className={"px-3 py-2 " + getPageLinkClassNames(p.name)}
                href={p.href}
                key={"page_" + p.name}
              >
                <span>{p.icon + " " + p.name}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>

        <Nav.Item>
          <ConnectWallet />
        </Nav.Item>
      </Container>
    </Navbar>
  )
}
