import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { NavDropdown } from "react-bootstrap"
import LogoutLink from "./auth/LogoutLink"

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

						{user.role === "Admin" && (
							<>
								<Nav.Link href="/courses">Corsi</Nav.Link>
								<Nav.Link href="/enrollments">
									Iscrizioni
								</Nav.Link>
								<Nav.Link href="/files">File</Nav.Link>
								<Nav.Link href="/reviews">Recensioni</Nav.Link>
							</>
						)}
						{user.id === -1 ? (
							<Nav.Link eventKey={2} href="/login">
								<u>
									<strong>Login</strong>
								</u>
							</Nav.Link>
						) : (
							<>
								<NavDropdown
									title={
										<u>
											<strong>{user.email}</strong>
										</u>
									}
									id="basic-nav-dropdown"
								>
									{" "}
									<NavDropdown.Item href="/profile">
										Profilo
									</NavDropdown.Item>
									{(user.role === "Professor" ||
										user.role === "Admin") && (
										<NavDropdown.Item
											href={"/courses?userId=" + user.id}
										>
											Corsi
										</NavDropdown.Item>
									)}
									{(user.role === "Student" ||
										user.role === "Admin") && (
										<>
											<NavDropdown.Item
												href={
													"/enrollments?userId=" +
													user.id
												}
											>
												Iscrizioni
											</NavDropdown.Item>
											<NavDropdown.Item
												href={
													"/reviews?userId=" + user.id
												}
											>
												Recensioni
											</NavDropdown.Item>
										</>
									)}
									<NavDropdown.Divider />
									<NavDropdown.Item>
										<LogoutLink></LogoutLink>
									</NavDropdown.Item>
								</NavDropdown>
								{/* <Nav.Link eventKey={2} href="/profile">
									<u>
										<strong>{user.email}</strong>
									</u>
								</Nav.Link> */}
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CollapsibleExample
