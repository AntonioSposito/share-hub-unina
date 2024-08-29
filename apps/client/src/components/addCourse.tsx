import { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

function AddCourse({ userId }: { userId: number }) {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<boolean>(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

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
					userId, // associa il corso al professore loggato
				}),
			})

			if (response.ok) {
				setSuccess(true)
				setTitle("")
				setDescription("")
			} else {
				const errorData = await response.json()
				setError(
					errorData.message || "Errore durante l'invio del corso"
				)
			}
		} catch (err) {
			setError("Errore di rete. Riprova più tardi.")
		}
	}

	return (
		<>
			<h3>Aggiungi un nuovo corso</h3>
			{error && <Alert variant="danger">{error}</Alert>}
			{success && (
				<Alert variant="success">Corso aggiunto con successo!</Alert>
			)}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="formCourseTitle">
					<Form.Label>Titolo del corso</Form.Label>
					<Form.Control
						type="text"
						placeholder="Inserisci il titolo del corso"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formCourseDescription">
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

				<Button variant="primary" type="submit">
					Aggiungi Corso
				</Button>
			</Form>
		</>
	)
}

export default AddCourse
