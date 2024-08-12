import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"

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
				const response = await fetch(url)
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
				<h1 className="mb-4 text-2xl">Fetching Users from API!</h1>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id</th>
						<th>Nome</th>
						<th>Cognome</th>
						<th>Email</th>
						<th>Ruolo</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => {
						return (
							<tr key={user.id}>
								<td>
									<a href={BASE_URL + "/users/" + user.id}>
										{user.id}
									</a>
								</td>
								<td>{user.name}</td>
								<td>{user.lastname}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</>
	)
}
