import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { Col, Container, Row } from "react-bootstrap"
import Courses from "./courses/Courses"
import Users from "./users/Users"
import Enrollments from "./enrollments/Enrollments"
import Files from "./files/Files"
import Reviews from "./reviews/Reviews"
import Professors from "./users/Professors"
import Students from "./users/Students"
import LogoutButton from "./auth/LogoutButton"

// const BASE_URL = import.meta.env.VITE_FRONTEND_URL

function Profilo() {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()

	// Verifica l'ID utente e reindirizza a /login se non è loggato
	useEffect(() => {
		if (user.id === -1) {
			navigate("/login")
		}
	}, [user, navigate])

	// Determina il contenuto da mostrare in base al ruolo dell'utente
	const renderContent = () => {
		switch (user.role) {
			case "Student":
				return (
					<>
						<Enrollments userId={user.id}></Enrollments>
						<Reviews userId={user.id}></Reviews>
					</>
				)
			case "Professor":
				return (
					<>
						<Courses userId={user.id}></Courses>
					</>
				)
			case "Admin":
				return (
					<>
						<Users></Users>
						<Professors></Professors>
						<Students></Students>
						<Courses></Courses>
						<Enrollments></Enrollments>
						<Files></Files>
						<Reviews></Reviews>
					</>
				)
			default:
				return (
					<h2>
						Descrizione base, questo non dovrebbe essere mostrato :(
					</h2>
				)
		}
	}

	return (
		<>
			<h1>
				ID: {user.id} {user.email} ({user.role})
			</h1>
			<Container fluid="md">
				<Row>
					<Users userIdProp={user.id}></Users>
				</Row>
				<br></br>
				<Row>
					<Col>{renderContent()}</Col>
				</Row>
			</Container>
			<br />
			<LogoutButton />
		</>
	)
}

export default Profilo
