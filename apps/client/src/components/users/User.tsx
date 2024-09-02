import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { useParams } from "react-router-dom"

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
	const params = useParams()
	//console.log(params)
	const [error, setError] = useState<Error | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			setIsLoading(true)
			const url = BASE_URL_API + "/users/" + params.id
			console.log(url)
			try {
				const response = await fetch(url, {
					credentials: "include",
				})
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`)
				}
				const user = (await response.json()) as User
				setUser(user)
			} catch (e: any) {
				setError(e)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUser()
	}, [params.id])

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

	if (!user) {
		return <div>No user found</div>
	}

	return (
		<>
			<div className="tutorial">
				<h2 className="mb-4 text-2xl">
					Utente (magari cambia nome qui)
				</h2>
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
					<tr>
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
				</tbody>
			</Table>
		</>
	)
}
