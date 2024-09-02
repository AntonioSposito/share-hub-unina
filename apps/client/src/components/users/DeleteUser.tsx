import React, { useState } from "react"
import { Alert, Button, Modal } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface DeleteUserProps {
	userId: number
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
	const [showModal, setShowModal] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			const response = await fetch(`${BASE_URL_API}/users/${userId}`, {
				method: "DELETE",
				credentials: "include", // Includi i cookie nella richiesta
			})

			if (!response.ok) {
				throw new Error("Errore durante l'eliminazione dell'utente")
			}

			// Gestisci il successo dell'eliminazione, ad esempio reindirizzando l'utente
			// o aggiornando la lista degli utenti. In questo caso, semplicemente chiudiamo il modal.
			setShowModal(false)
			window.location.reload() // Ricarica la pagina per aggiornare l'elenco degli utenti
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			<Button variant="danger" onClick={() => setShowModal(true)}>
				Elimina Utente
			</Button>{" "}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Conferma Eliminazione</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<p>
						Sei sicuro di voler eliminare l'utente con ID{" "}
						<strong>{userId}</strong>? <p></p>
						<Alert variant="warning">
							Se l'utente che si sta eliminando è un{" "}
							<strong>professore</strong>, verranno anche
							eliminati i relativi corsi, iscrizoni, file e
							recensioni a cascata!{" "}
						</Alert>
						<Alert variant="warning">
							Se l'utente è uno <strong>studente</strong>,
							verranno eliminate anche le sue iscrizioni e le sue
							iscrizioni a cascata!
						</Alert>
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

export default DeleteUser
