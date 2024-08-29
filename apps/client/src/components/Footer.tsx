import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

function CollapsibleExample() {
	return (
		<Navbar bg="light" data-bs-theme="light" className="mt-auto">
			<Container>
				{/* <Navbar.Brand href="/">Share-Hub Unina</Navbar.Brand> */}
				<Nav className="me-auto">
					<Navbar.Text className="ms-auto">
						<p className="mb-0">
							&copy; {new Date().getFullYear()} Share-Hub Unina.
							Created by Antonio Sposito
							<br />
							Distributed under the{" "}
							<a
								href="https://opensource.org/licenses/MIT"
								target="_blank"
								rel="noopener noreferrer"
							>
								MIT License
							</a>
							.
						</p>
					</Navbar.Text>
				</Nav>
				<Nav>
					<Nav.Link href="https://github.com/AntonioSposito/share-hub-unina/">
						Github Repo
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	)
}

export default CollapsibleExample
