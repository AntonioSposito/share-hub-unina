import React, { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface EditFileProps {
	fileId: number
	onFileUpdated: () => void
	currentDescription: string // Descrizione corrente del file
	currentName: string // Nome corrente del file
	courseId: number // ID del corso (non modificabile)
}

export default function EditFile({
	fileId,
	onFileUpdated,
	currentDescription,
	currentName,
	courseId,
}: EditFileProps) {
	const [show, setShow] = useState(false)
	const [description, setDescription] = useState(currentDescription)
	const [name, setName] = useState(currentName)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	// Aggiorna il form con i dati correnti del file ogni volta che si apre il modal
	useEffect(() => {
		if (show) {
			setDescription(currentDescription)
			setName(currentName)
		}
	}, [show, currentDescription, currentName])

	const handleSave = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch(`${BASE_URL_API}/files/${fileId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					description,
					name,
				}),
			})

			if (!response.ok) {
				throw new Error("Errore durante l'aggiornamento del file")
			}

			onFileUpdated()
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
				Modifica File
			</Button>{" "}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modifica File</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formName">
							<Form.Label>Nome del File</Form.Label>
							<Form.Control
								type="text"
								placeholder="Inserisci il nome del file"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						<Form.Group
							controlId="formDescription"
							className="mt-3"
						>
							<Form.Label>Descrizione</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Inserisci la descrizione"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formCourseId" className="mt-3">
							<Form.Label>ID Corso</Form.Label>
							<Form.Control
								type="text"
								placeholder="ID Corso"
								value={courseId}
								disabled
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
