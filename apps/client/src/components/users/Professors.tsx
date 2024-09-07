import { useEffect, useState } from "react"
import { Button, Table, FormControl, Container, Form } from "react-bootstrap"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface User {
	id: number
	email: string
	name: string
	lastname: string
	role: string
}

export default function Demo() {
	const [error, setError] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [users, setUsers] = useState<User[]>([])
	const [searchTerm, setSearchTerm] = useState("") // Stato per il termine di ricerca

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)
			const url = BASE_URL_API + "/users/professors"
			try {
				const response = await fetch(url, {
					credentials: "include", // Includi i cookie nella richiesta
				})
				const users = (await response.json()) as User[]
				setUsers(users)
			} catch (e: any) {
				setError(e)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [])

	// Funzione per filtrare gli utenti in base al termine di ricerca
	const filteredUsers = users.filter(
		(user) =>
			user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.id.toString().includes(searchTerm)
	)

	if (isLoading) {
		return (
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		)
	}
	if (error) {
		return <div>Something went wrong, please try again</div>
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/teacher.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Elenco professori:</h2>
				</Container>
				<Form className="mb-4">
					<Form.Group controlId="search">
						<Form.Label>Ricerca professori:</Form.Label>
						<FormControl
							placeholder="Cerca per cognome, email o id"
							aria-label="Cerca"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)} // Aggiorna lo stato di ricerca
						/>
					</Form.Group>
				</Form>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id</th>
						<th>Nome</th>
						<th>Cognome</th>
						<th>Email</th>
						<th>Ruolo</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{filteredUsers.map((user) => (
						<tr key={user.id}>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={`${BASE_URL}/users/${user.id}`}
										variant="outline-primary"
									>
										{user.id}
									</Button>
								</div>
							</td>
							<td>{user.name}</td>
							<td>{user.lastname}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={"/courses?userId=" + user.id}
										variant="outline-success"
									>
										Corsi
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
