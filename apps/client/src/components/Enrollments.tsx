import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import DeleteEnrollment from "./DeleteEnrollment"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Enrollment {
	id: number
	userId: number
	courseId: number
	// Aggiungi altre proprietà dell'enrollment se necessario
}

interface EnrollmentsProps {
	userId?: number // Prop userId
}

export default function Enrollments({ userId: propUserId }: EnrollmentsProps) {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [enrollments, setEnrollments] = useState<Enrollment[]>([])
	const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Estrai i parametri di query dalla stringa di ricerca
	const queryParams = new URLSearchParams(search)
	const queryUserId = queryParams.get("userId")
	const courseId = queryParams.get("courseId")

	useEffect(() => {
		const fetchEnrollments = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/enrollments"

			// Determina se usare userId da props o da query string
			const userId = propUserId || queryUserId

			// Aggiungi i parametri di query all'URL se presenti
			const queryStrings: string[] = []
			if (userId) queryStrings.push(`userId=${userId}`)
			if (courseId) queryStrings.push(`courseId=${courseId}`)

			if (id) {
				// Se esiste un `id`, viene utilizzato per cercare una specifica iscrizione
				url += `/${id}`
			} else if (queryStrings.length > 0) {
				url += `?${queryStrings.join("&")}`
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
	}, [id, propUserId, queryUserId, courseId])

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
						src={"/course.png"}
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
					</tbody>
				</Table>
				<DeleteEnrollment enrollmentId={enrollment.id} />
			</div>
		)
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/enrollment.png"}
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
						<th>Id iscrizione</th>
						<th>User Id</th>
						<th>Course Id</th>
					</tr>
				</thead>
				<tbody>
					{enrollments.map((enrollment) => (
						<tr key={enrollment.id}>
							<td>
								<Button
									href={`/enrollments/${enrollment.id}`}
									variant="outline-primary"
								>
									{enrollment.id}
								</Button>
							</td>
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
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
