import React, { useState } from "react"
import { Alert, Button, Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface DeleteEnrollmentProps {
	enrollmentId: number
}

const DeleteEnrollment: React.FC<DeleteEnrollmentProps> = ({
	enrollmentId,
}) => {
	const [showModal, setShowModal] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const navigate = useNavigate() // Hook per la navigazione

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			const response = await fetch(
				`${BASE_URL_API}/enrollments/${enrollmentId}`,
				{
					method: "DELETE",
					credentials: "include", // Includi i cookie nella richiesta
				}
			)

			if (!response.ok) {
				throw new Error("Errore durante l'eliminazione dell'iscrizione")
			}

			// Gestisci il successo dell'eliminazione, ad esempio reindirizzando l'utente
			// o aggiornando la lista delle iscrizioni. In questo caso, semplicemente chiudiamo il modal.
			setShowModal(false)
			navigate(-1)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			<Button variant="danger" onClick={() => setShowModal(true)}>
				Elimina Iscrizione
			</Button>{" "}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Conferma Eliminazione</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<p>
						Sei sicuro di voler eliminare l'iscrizione con ID{" "}
						<strong>{enrollmentId}</strong>? <p></p>
						<Alert variant="danger">
							<strong>
								Questa azione non può essere annullata!
							</strong>
						</Alert>
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowModal(false)}
					>
						Annulla
					</Button>
					<Button
						variant="danger"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Eliminazione in corso..." : "Elimina"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default DeleteEnrollment
