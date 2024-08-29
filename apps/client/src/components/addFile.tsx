import { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

function AddFile({ courseId }: { courseId: number }) {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

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
			} else {
				const errorData = await response.json()
				setError(errorData.message || "Errore durante l'invio del file")
			}
		} catch (err) {
			setError("Errore di rete. Riprova più tardi.")
		}
	}

	return (
		<>
			<h3>Aggiungi un nuovo file</h3>
			{error && <Alert variant="danger">{error}</Alert>}
			{success && (
				<Alert variant="success">File caricato con successo!</Alert>
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
				<Form.Group className="mb-3" controlId="formFileTitle">
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
				<Form.Group className="mb-3" controlId="formFileTitle">
					<Form.Label>
						Seleziona file (attualmente non funziona)
					</Form.Label>
					<Form.Control
						disabled //eliminare questo per rendere attivo di nuovo il caricamento file
						type="file"
						//value={description}
						//onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</Form.Group>

				<Button variant="primary" type="submit">
					Aggiungi File
				</Button>
			</Form>
		</>
	)
}

export default AddFile
