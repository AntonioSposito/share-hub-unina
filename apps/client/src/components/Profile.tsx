import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import { Col, Container, Row } from "react-bootstrap"
import Courses from "./Courses"
import Users from "./Users"
import Enrollments from "./Enrollments"
import Files from "./Files"
import Reviews from "./Reviews"
import Professors from "./Professors"
import Students from "./Students"
import AddCourse from "./addCourse"

const BASE_URL = import.meta.env.VITE_FRONTEND_URL

function Profilo() {
	const { user, setUser } = useContext(UserContext)
	const navigate = useNavigate()
	const [showAddCourseForm, setShowAddCourseForm] = useState(false) // Stato per la visibilità del form

	// Funzione per gestire il logout
	const handleLogout = async () => {
		try {
			// Esegui una richiesta GET a /api/auth/signout
			const response = await fetch("/api/auth/signout", {
				method: "GET",
				credentials: "include", // Invia i cookie insieme alla richiesta, se necessario
			})

			if (response.ok) {
				// Se la richiesta ha successo, reimposta lo stato dell'utente
				setUser({
					id: -1,
					email: "prova@dominio.it",
					role: "NESSUN_RUOLO",
				})
				// Rimuove l'utente dal sessionStorage
				sessionStorage.removeItem("user")
			} else {
				console.error("Logout fallito:", response.statusText)
			}
		} catch (error) {
			console.error("Errore durante il logout:", error)
		}
	}

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
					</>
				)
			case "Professor":
				return (
					<>
						<Courses userId={user.id}></Courses>
						<Button
							variant="primary"
							onClick={() =>
								setShowAddCourseForm(!showAddCourseForm)
							} // Alterna la visibilità del form
						>
							{showAddCourseForm
								? "Nascondi form"
								: "Aggiungi Corso"}
						</Button>
						{showAddCourseForm && (
							<AddCourse userId={user.id}></AddCourse>
						)}
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
			<Button variant="danger" onClick={handleLogout}>
				Logout
			</Button>
		</>
	)
}

export default Profilo
