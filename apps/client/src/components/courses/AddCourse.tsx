import React, { useContext, useState } from "react"
import { Alert, Button, Modal, Form } from "react-bootstrap"
import { UserContext } from "../../contexts/UserContext"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface AddCourseProps {
	initialUserId: number
}

const AddCourse: React.FC<AddCourseProps> = ({ initialUserId }) => {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [userId, setUserId] = useState<number>(initialUserId)
	const [showModal, setShowModal] = useState(false)
	const [isAdding, setIsAdding] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)

	const { user } = useContext(UserContext)

	const handleAddCourse = async () => {
		setIsAdding(true)
		setError(null)

		try {
			const response = await fetch(`${BASE_URL_API}/courses`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					userId,
				}),
			})

			if (response.ok) {
				setSuccess(true)
				setTitle("")
				setDescription("")
				setShowModal(false)
			} else {
				const errorData = await response.json()
				setError(
					errorData.message || "Errore durante l'invio del corso"
				)
			}
		} catch (err) {
			setError("Errore di rete. Riprova più tardi.")
		} finally {
			setIsAdding(false)
		}
	}

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleShowModal()
	}

	const handleShowModal = () => setShowModal(true)
	const handleCloseModal = () => setShowModal(false)

	return (
		<>
			<Button variant="primary" onClick={handleShowModal}>
				Aggiungi Corso
			</Button>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Aggiungi un nuovo corso</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && (
						<Alert variant="success">
							Corso aggiunto con successo!
						</Alert>
					)}
					<Form onSubmit={handleFormSubmit}>
						<Form.Group className="mb-3" controlId="formUserId">
							<Form.Label>User ID</Form.Label>
							<Form.Control
								type="number"
								placeholder="Inserisci l'ID dell'utente"
								value={userId}
								disabled={user.role != "Admin"}
								onChange={(e) =>
									setUserId(Number(e.target.value))
								}
								required
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="formCourseTitle"
						>
							<Form.Label>Titolo del corso</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il titolo del corso"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</Form.Group>

						<Form.Group
							className="mb-3"
							controlId="formCourseDescription"
						>
							<Form.Label>Descrizione del corso</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Inserisci una descrizione per il corso"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Annulla
					</Button>
					<Button
						variant="primary"
						onClick={handleAddCourse}
						disabled={isAdding}
					>
						{isAdding ? "Aggiunta in corso..." : "Aggiungi"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default AddCourse
