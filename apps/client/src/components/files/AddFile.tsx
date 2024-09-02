import React, { useState } from "react"
import { Form, Button, Alert, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface AddFileProps {
	courseId: number
}

const AddFile: React.FC<AddFileProps> = ({ courseId }) => {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)
	const [showModal, setShowModal] = useState(false)
	const [isAdding, setIsAdding] = useState(false)

	const handleShowModal = () => setShowModal(true)
	const handleCloseModal = () => setShowModal(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsAdding(true)
		setError(null)

		try {
			const response = await fetch(`${BASE_URL_API}/files`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
					courseId, // associa il corso al professore loggato
				}),
			})

			if (response.ok) {
				setSuccess(true)
				setName("")
				setDescription("")
				setShowModal(false)
			} else {
				const errorData = await response.json()
				setError(errorData.message || "Errore durante l'invio del file")
			}
		} catch (err) {
			setError("Errore di rete. Riprova più tardi.")
		} finally {
			setIsAdding(false)
		}
	}

	return (
		<>
			<Button variant="primary" onClick={handleShowModal}>
				Aggiungi File
			</Button>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Aggiungi un nuovo file</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && (
						<Alert variant="success">
							File caricato con successo!
						</Alert>
					)}
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formFileTitle">
							<Form.Label>Nome del file</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il nome del file"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="formFileDescription"
						>
							<Form.Label>Descrizione del file</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Inserisci una descrizione per il file"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formFileUpload">
							<Form.Label>
								Seleziona file (attualmente non funziona)
							</Form.Label>
							<Form.Control
								disabled // Rendi il caricamento file attivo rimuovendo questo attributo
								type="file"
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
						onClick={handleSubmit}
						disabled={isAdding}
					>
						{isAdding ? "Caricamento in corso..." : "Aggiungi"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default AddFile
