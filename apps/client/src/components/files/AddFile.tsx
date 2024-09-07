import React, { useState } from "react"
import { Form, Button, Alert, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface AddFileProps {
	courseId: number
}

const AddFile: React.FC<AddFileProps> = ({ courseId }) => {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)
	const [showModal, setShowModal] = useState(false)
	const [isAdding, setIsAdding] = useState(false)

	const handleShowModal = () => setShowModal(true)
	const handleCloseModal = () => {
		setShowModal(false)
		resetForm()
	}

	const resetForm = () => {
		setName("")
		setDescription("")
		setFile(null)
		setError(null)
		setSuccess(false)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsAdding(true)
		setError(null)

		if (!file) {
			setError("Per favore seleziona un file da caricare.")
			setIsAdding(false)
			return
		}

		try {
			// Prima richiesta: POST /files per caricare i metadati del file
			const metadataResponse = await fetch(`${BASE_URL_API}/files`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
					courseId,
				}),
			})

			if (!metadataResponse.ok) {
				const errorData = await metadataResponse.json()
				throw new Error(
					errorData.message ||
						"Errore durante l'invio dei metadati del file"
				)
			}

			const { id: fileId } = await metadataResponse.json()

			// Seconda richiesta: POST /files/upload per caricare il file
			const formData = new FormData()
			formData.append("file", file)
			formData.append("fileId", fileId.toString())

			const uploadResponse = await fetch(`${BASE_URL_API}/files/upload`, {
				method: "POST",
				credentials: "include",
				body: formData,
			})

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json()
				throw new Error(
					errorData.message || "Errore durante l'upload del file"
				)
			}

			setSuccess(true)
			resetForm()
			setTimeout(() => {
				setShowModal(false)
				setSuccess(false)
			}, 2000)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Errore di rete. Riprova più tardi."
			)
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
							<Form.Label>Seleziona file</Form.Label>
							<Form.Control
								type="file"
								onChange={handleFileChange}
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
