import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

function CollapsibleExample() {
	const { user } = useContext(UserContext)
	return (
		<Navbar expand="lg" bg="primary" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">Share-Hub Unina</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						{/* <Nav.Link href="/enrollments">Iscrizioni</Nav.Link>
						<Nav.Link href="/reviews">Recensioni</Nav.Link>
						<Nav.Link href="/hhshshshs">404test</Nav.Link> */}
					</Nav>
					<Nav>
						<Nav.Link href="/professors">Professori</Nav.Link>
						<Nav.Link href="/courses">Corsi</Nav.Link>
						{user.id === -1 ? (
							<Nav.Link eventKey={2} href="/login">
								<u>
									<strong>Login</strong>
								</u>
							</Nav.Link>
						) : (
							<Nav.Link eventKey={2} href="/profile">
								<u>
									<strong>Profilo ({user.role})</strong>
								</u>
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CollapsibleExample
