import { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface EditReviewProps {
	reviewId: number
	onReviewUpdated: () => void
	currentText: string // Testo corrente della recensione
	currentRating: number // Valutazione corrente della recensione
	userId: number // ID dell'utente che ha scritto la recensione (non modificabile)
	fileId: number // ID del file recensito (non modificabile)
}

export default function EditReview({
	reviewId,
	onReviewUpdated,
	currentText,
	currentRating,
	userId,
	fileId,
}: EditReviewProps) {
	const [show, setShow] = useState(false)
	const [text, setText] = useState(currentText)
	const [rating, setRating] = useState(currentRating)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	// Aggiorna il form con i dati correnti della recensione ogni volta che si apre il modal
	useEffect(() => {
		if (show) {
			setText(currentText)
			setRating(currentRating)
		}
	}, [show, currentText, currentRating])

	const handleSave = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`${BASE_URL_API}/reviews/${reviewId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						text,
						rating,
						userId,
						fileId,
					}),
				}
			)

			if (!response.ok) {
				throw new Error(
					"Errore durante l'aggiornamento della recensione"
				)
			}

			onReviewUpdated()
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
				Modifica Recensione
			</Button>{" "}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modifica Recensione</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formText">
							<Form.Label>Testo della Recensione</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Inserisci il testo"
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="formRating" className="mt-3">
							<Form.Label>Valutazione</Form.Label>
							<Form.Control
								as="select"
								value={rating}
								onChange={(e) =>
									setRating(Number(e.target.value))
								}
							>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="formUserId" className="mt-3">
							<Form.Label>ID Utente</Form.Label>
							<Form.Control
								type="text"
								placeholder="ID Utente"
								value={userId}
								disabled
							/>
						</Form.Group>

						<Form.Group controlId="formFileId" className="mt-3">
							<Form.Label>ID File</Form.Label>
							<Form.Control
								type="text"
								placeholder="ID File"
								value={fileId}
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
