import { useContext, useEffect } from "react"
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

function Profilo() {
	const { user, setUser } = useContext(UserContext)
	const navigate = useNavigate()

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
					<h2>
						Benvenuto, utente! Qui ci va il riepilogo delle
						iscrizioni di uno studente
					</h2>
				)
			case "Professor":
				return (
					<h2>
						Benvenuto, professore! Qui ci va il riepilogo dei corsi
						tenuti dal professore
					</h2>
				)
			case "Admin":
				return (
					<>
						<h2>Benvenuto, amministratore!</h2>
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
