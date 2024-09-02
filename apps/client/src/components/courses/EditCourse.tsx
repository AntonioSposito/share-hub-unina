import { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface EditCourseProps {
	courseId: number
	onCourseUpdated: () => void
	currentTitle: string
	currentDescription: string
	currentUserId: number // Aggiunto per gestire l'userId corrente
}

export default function EditCourse({
	courseId,
	onCourseUpdated,
	currentTitle,
	currentDescription,
	currentUserId, // Aggiunto userId
}: EditCourseProps) {
	const [show, setShow] = useState(false)
	const [title, setTitle] = useState(currentTitle)
	const [description, setDescription] = useState(currentDescription)
	const [userId, setUserId] = useState(currentUserId) // Stato per userId
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	useEffect(() => {
		if (show) {
			setTitle(currentTitle)
			setDescription(currentDescription)
			setUserId(currentUserId) // Aggiorna lo stato di userId quando il modal si apre
		}
	}, [show, currentTitle, currentDescription, currentUserId])

	const handleSave = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`${BASE_URL_API}/courses/${courseId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						title,
						description,
						userId, // Invia userId con la richiesta
					}),
				}
			)

			if (!response.ok) {
				throw new Error("Errore durante l'aggiornamento del corso")
			}

			onCourseUpdated()
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
				Modifica Corso
			</Button>{" "}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modifica Corso</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formTitle">
							<Form.Label>Titolo</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il titolo"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formDescription">
							<Form.Label>Descrizione</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Inserisci la descrizione"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formUserId">
							<Form.Label>User ID</Form.Label>
							<Form.Control
								type="number"
								placeholder="Inserisci l'ID utente"
								value={userId}
								disabled
								onChange={(e) =>
									setUserId(Number(e.target.value))
								}
							/>
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
