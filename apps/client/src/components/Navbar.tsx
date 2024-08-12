import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

function CollapsibleExample() {
	return (
		<Navbar bg="primary" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">Share-Hub Unina</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/users">Professori</Nav.Link>
						<Nav.Link href="/courses">Corsi</Nav.Link>
						<Nav.Link href="/hhshshshs">404test</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link eventKey={2} href="/login">
							Login
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CollapsibleExample
