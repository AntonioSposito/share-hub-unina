import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Enrollment {
	id: number
	userId: number
	courseId: number
	// Aggiungi altre proprietà dell'enrollment se necessario
}

export default function Enrollments() {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [enrollments, setEnrollments] = useState<Enrollment[]>([])
	const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Estrai i parametri di query dalla stringa di ricerca
	const queryParams = new URLSearchParams(search)
	const userId = queryParams.get("userId")
	const courseId = queryParams.get("courseId")

	useEffect(() => {
		const fetchEnrollments = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/enrollments"

			// Aggiungi i parametri di query all'URL se presenti
			const queryStrings: string[] = []
			if (userId) queryStrings.push(`userId=${userId}`)
			if (courseId) queryStrings.push(`courseId=${courseId}`)

			if (queryStrings.length > 0) {
				url += `?${queryStrings.join("&")}`
			} else if (id) {
				url += `/${id}`
			}

			try {
				const response = await fetch(url, {
					method: "GET",
					credentials: "include", // Include cookies in the request
				})

				if (!response.ok) {
					throw new Error("Network response was not ok")
				}

				if (id) {
					const enrollmentData = (await response.json()) as Enrollment
					setEnrollment(enrollmentData)
				} else {
					const enrollmentsData =
						(await response.json()) as Enrollment[]
					setEnrollments(enrollmentsData)
				}
			} catch (e: any) {
				setError(e.message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchEnrollments()
	}, [id, search, userId, courseId])

	if (isLoading) {
		return (
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		)
	}

	if (error) {
		return <div>Something went wrong: {error}</div>
	}

	if (id && enrollment) {
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"../../public/course.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Dettagli iscrizione:</h2>
				</Container>
				<Table striped>
					<tbody>
						<tr>
							<td>Id</td>
							<td>{enrollment.id}</td>
						</tr>
						<tr>
							<td>User Id</td>
							<td>
								<a
									href={`${BASE_URL}/users/${enrollment.userId}`}
								>
									{enrollment.userId}
								</a>
							</td>
						</tr>
						<tr>
							<td>Course Id</td>
							<td>
								<a
									href={`${BASE_URL}/courses/${enrollment.courseId}`}
								>
									{enrollment.courseId}
								</a>
							</td>
						</tr>
						{/* Aggiungi altre righe se necessario */}
					</tbody>
				</Table>
			</div>
		)
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"../../public/enrollment.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Elenco iscrizioni:</h2>
				</Container>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id</th>
						<th>User Id</th>
						<th>Course Id</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{enrollments.map((enrollment) => (
						<tr key={enrollment.id}>
							<td>{enrollment.id}</td>
							<td>
								<a
									href={`${BASE_URL}/users/${enrollment.userId}`}
								>
									{enrollment.userId}
								</a>
							</td>
							<td>
								<a
									href={`${BASE_URL}/courses/${enrollment.courseId}`}
								>
									{enrollment.courseId}
								</a>
							</td>
							<td>
								<Button
									href={`/enrollments/${enrollment.id}`}
									variant="outline-success"
								>
									Dettagli
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
