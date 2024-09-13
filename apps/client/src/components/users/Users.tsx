import { useContext, useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import DeleteUser from "./DeleteUser"
import EditUser from "./EditUser"
import { UserContext } from "../../contexts/UserContext"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface User {
	id: number
	email: string
	name: string
	lastname: string
	role: string
}

interface UsersProps {
	userIdProp?: number // Nuova prop opzionale per accettare un userId
}

export default function Users({ userIdProp }: UsersProps) {
	const { id: idFromParams } = useParams<{ id?: string }>()
	const id = userIdProp || idFromParams // Usa l'id passato come prop o quello nella URL
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [users, setUsers] = useState<User[]>([])
	const [userState, setUserState] = useState<User | null>(null)
	const roleOrder = { Admin: 1, Professor: 2, Student: 3 }

	const { user: userFromContext } = useContext(UserContext)

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
					throw new Error(
						`Error ${response.status}: ${response.statusText}`
					)
				}
				if (id) {
					const user = (await response.json()) as User
					setUserState(user)
				} else {
					let users = (await response.json()) as User[]

					// Ordina gli utenti per ruolo
					users = users.sort(
						(a, b) => getRoleOrder(a.role) - getRoleOrder(b.role)
					)

					setUsers(users)
				}
			} catch (e: any) {
				setError(e.message)
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
		return <div>{error}</div>
	}

	if (id && userState) {
		// Visualizza i dettagli di un singolo utente
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					{userState.role === "Professor" && (
						<>
							<img
								src={"/teacher.png"}
								alt="Share-hub teacher Logo"
								className="me-3"
								style={{ width: "60px", height: "60px" }}
							/>
							<h2 className="text-2xl">Dettagli professore:</h2>
						</>
					)}
					{userState.role === "Student" && (
						<>
							<img
								src={"/student.png"}
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
							<td>{userState.id}</td>
						</tr>
						<tr>
							<td>Nome</td>
							<td>{userState.name}</td>
						</tr>
						<tr>
							<td>Cognome</td>
							<td>{userState.lastname}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{userState.email}</td>
						</tr>
						<tr>
							<td>Ruolo</td>
							<td>{userState.role}</td>
						</tr>
						{userState.role === "Professor" && (
							<tr>
								<td>Corsi</td>
								<td>
									<Button
										href={`${BASE_URL}/courses?userId=${userState.id}`}
										variant="outline-success"
									>
										Corsi
									</Button>
								</td>
							</tr>
						)}
						{userState.role === "Student" && (
							<>
								<tr>
									<td>Iscrizioni</td>
									<td>
										<Button
											href={`${BASE_URL}/enrollments?userId=${userState.id}`}
											variant="outline-success"
										>
											Iscrizioni
										</Button>
									</td>
								</tr>
								<tr>
									<td>Recensioni</td>
									<td>
										<Button
											href={`${BASE_URL}/reviews?userId=${userState.id}`}
											variant="outline-success"
										>
											Recensioni
										</Button>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</Table>
				{(userFromContext.id === userState.id ||
					userFromContext.role === "Admin") && (
					<EditUser
						userId={userState.id}
						onUserUpdated={() => window.location.reload()}
						currentName={userState.name}
						currentLastname={userState.lastname}
						currentEmail={userState.email}
						currentRole={userState.role}
					/>
				)}
				{userFromContext.role === "Admin" && (
					<DeleteUser userId={userState.id} />
				)}
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
								{user.role === "Professor" && (
									<div className="d-grid gap-2">
										<Button
											href={`${BASE_URL}/courses?userId=${user.id}`}
											variant="outline-success"
										>
											Corsi
										</Button>
									</div>
								)}
								{user.role === "Student" && (
									<div className="d-grid gap-2">
										<Button
											href={`${BASE_URL}/enrollments?userId=${user.id}`}
											variant="outline-success"
										>
											Iscrizioni
										</Button>
									</div>
								)}
							</td>
							<td>
								{user.role === "Student" && (
									<div className="d-grid gap-2">
										<Button
											href={`${BASE_URL}/reviews?userId=${user.id}`}
											variant="outline-success"
										>
											Recensioni
										</Button>
									</div>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
