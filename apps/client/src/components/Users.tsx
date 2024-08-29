import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import DeleteUser from "./DeleteUser"
import EditUser from "./EditUser"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface User {
	id: number
	email: string
	name: string
	lastname: string
	role: string
}

interface DemoProps {
	userIdProp?: number // Nuova prop opzionale per accettare un userId
}

export default function Demo({ userIdProp }: DemoProps) {
	const { id: idFromParams } = useParams<{ id?: string }>()
	const id = userIdProp || idFromParams // Usa l'id passato come prop o quello nella URL
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [users, setUsers] = useState<User[]>([])
	const [user, setUser] = useState<User | null>(null)
	const roleOrder = { Admin: 1, Professor: 2, Student: 3 }

	function getRoleOrder(role: string): number {
		return roleOrder[role as keyof typeof roleOrder] || 4 // 4 come valore di fallback
	}

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/users/"

			if (id) {
				url += id
			}

			try {
				const response = await fetch(url, {
					method: "GET",
					credentials: "include", // Includi i cookie nella richiesta
				})
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				if (id) {
					const user = (await response.json()) as User
					setUser(user)
				} else {
					let users = (await response.json()) as User[]

					// Ordina gli utenti per ruolo
					users = users.sort(
						(a, b) => getRoleOrder(a.role) - getRoleOrder(b.role)
					)

					setUsers(users)
				}
			} catch (e: any) {
				setError(e)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [id])

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

	if (id && user) {
		// Visualizza i dettagli di un singolo utente
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					{user.role === "Professor" && (
						<>
							<img
								src={"../../public/teacher.png"}
								alt="Share-hub teacher Logo"
								className="me-3"
								style={{ width: "60px", height: "60px" }}
							/>
							<h2 className="text-2xl">Dettagli professore:</h2>
						</>
					)}
					{user.role === "Student" && (
						<>
							<img
								src={"../../public/student.png"}
								alt="Share-hub student Logo"
								className="me-3"
								style={{ width: "60px", height: "60px" }}
							/>
							<h2 className="text-2xl">Dettagli studente:</h2>
						</>
					)}
				</Container>
				<Table striped>
					<tbody>
						<tr>
							<td>Id utente</td>
							<td>{user.id}</td>
						</tr>
						<tr>
							<td>Nome</td>
							<td>{user.name}</td>
						</tr>
						<tr>
							<td>Cognome</td>
							<td>{user.lastname}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{user.email}</td>
						</tr>
						<tr>
							<td>Ruolo</td>
							<td>{user.role}</td>
						</tr>
						{user.role === "Professor" && (
							<tr>
								<td>Corsi</td>
								<td>
									<a
										href={`${BASE_URL}/courses?userId=${user.id}`}
									>
										Visualizza corsi
									</a>
								</td>
							</tr>
						)}
						{user.role === "Student" && (
							<>
								<tr>
									<td>Iscrizioni</td>
									<td>
										<a
											href={`${BASE_URL}/enrollments?userId=${user.id}`}
										>
											Visualizza iscrizioni
										</a>
									</td>
								</tr>
								<tr>
									<td>Recensioni</td>
									<td>
										<a
											href={`${BASE_URL}/reviews?userId=${user.id}`}
										>
											Visualizza recensioni
										</a>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</Table>

				<EditUser
					userId={user.id}
					onUserUpdated={() => window.location.reload()}
					currentName={user.name}
					currentLastname={user.lastname}
					currentEmail={user.email}
					currentRole={user.role}
				/>
				<DeleteUser userId={user.id} />
			</div>
		)
	}

	// Se non è stato passato un ID, mostra l'elenco degli utenti
	return (
		<>
			<div className="tutorial">
				<h2 className="mb-4 text-2xl">Elenco utenti registrati:</h2>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id utente</th>
						<th>Nome</th>
						<th>Cognome</th>
						<th>Email</th>
						<th>Ruolo</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>
								<a href={`${BASE_URL}/users/${user.id}`}>
									{user.id}
								</a>
							</td>
							<td>{user.name}</td>
							<td>{user.lastname}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>
								{user.role === "Professor" && (
									<Button
										href={`${BASE_URL}/courses?userId=${user.id}`}
										variant="outline-success"
									>
										Corsi
									</Button>
								)}
								{user.role === "Student" && (
									<Button
										href={`${BASE_URL}/enrollments?userId=${user.id}`}
										variant="outline-success"
									>
										Iscrizioni
									</Button>
								)}
							</td>
							<td>
								{user.role === "Student" && (
									<Button
										href={`${BASE_URL}/reviews?userId=${user.id}`}
										variant="outline-success"
									>
										Recensioni
									</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
