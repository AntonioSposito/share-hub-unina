import React, { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface EditUserProps {
	userId: number
	onUserUpdated: () => void
	currentName: string // Dati correnti dell'utente
	currentLastname: string
	currentEmail: string
	currentRole: string
}

export default function EditUser({
	userId,
	onUserUpdated,
	currentName,
	currentLastname,
	currentEmail,
	currentRole,
}: EditUserProps) {
	const [show, setShow] = useState(false)
	const [name, setName] = useState(currentName)
	const [lastname, setLastname] = useState(currentLastname)
	const [email, setEmail] = useState(currentEmail)
	const [role, setRole] = useState(currentRole)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	// Aggiorna il form con i dati correnti dell'utente ogni volta che si apre il modal
	useEffect(() => {
		if (show) {
			setName(currentName)
			setLastname(currentLastname)
			setEmail(currentEmail)
			setRole(currentRole)
		}
	}, [show, currentName, currentLastname, currentEmail, currentRole])

	const handleSave = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch(`${BASE_URL_API}/users/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					name,
					lastname,
					email,
					role,
				}),
			})

			if (!response.ok) {
				throw new Error("Errore durante l'aggiornamento dell'utente")
			}

			onUserUpdated()
			handleClose()
		} catch (e: any) {
			setError(e.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Modifica
			</Button>{" "}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modifica Utente</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formName">
							<Form.Label>Nome</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il nome"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formLastname">
							<Form.Label>Cognome</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il cognome"
								value={lastname}
								onChange={(e) => setLastname(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Inserisci l'email"
								value={email}
								disabled
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formRole">
							<Form.Label>Ruolo</Form.Label>
							<Form.Control
								as="select"
								value={role}
								disabled
								onChange={(e) => setRole(e.target.value)}
							>
								<option value="">Seleziona un ruolo</option>
								<option value="Admin">Admin</option>
								<option value="Professor">Professor</option>
								<option value="Student">Student</option>
							</Form.Control>
						</Form.Group>
					</Form>
					{error && <p className="text-danger mt-3">{error}</p>}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Annulla
					</Button>
					<Button
						variant="primary"
						onClick={handleSave}
						disabled={isLoading}
					>
						{isLoading ? "Salvando..." : "Salva"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
