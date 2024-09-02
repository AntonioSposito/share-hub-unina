import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"

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

	// console.log("API URL:", BASE_URL_API)
	// console.log("FRONTEND URL:", BASE_URL)
	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)
			const url = BASE_URL_API + "/users/"
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
						src={"/student.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Elenco studenti:</h2>
				</Container>
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
					{users.map((user) => {
						if (user.role === "Student") {
							return (
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
												href={
													"/enrollments?userId=" +
													user.id
												}
												variant="outline-success"
											>
												Iscrizioni
											</Button>
										</div>
									</td>
									<td>
										<div className="d-grid gap-2">
											<Button
												href={
													"/reviews?userId=" + user.id
												}
												variant="outline-success"
											>
												Recensioni
											</Button>
										</div>
									</td>
								</tr>
							)
						}
					})}
				</tbody>
			</Table>
		</>
	)
}
