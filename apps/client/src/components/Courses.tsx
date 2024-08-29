import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom" // Aggiungi import

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Course {
	id: number
	title: string
	description: string
	userId: number
}

export default function Demo() {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation() // Ottieni la query string
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [courses, setCourses] = useState<Course[]>([])
	const [course, setCourse] = useState<Course | null>(null)

	// Gestione della query string
	const queryParams = new URLSearchParams(search)
	const userId = queryParams.get("userId")

	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/courses/"

			if (userId) {
				url += `?userId=${userId}`
			} else if (id) {
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
					const course = (await response.json()) as Course
					setCourse(course)
				} else {
					const courses = (await response.json()) as Course[]
					setCourses(courses)
				}
			} catch (e: any) {
				setError(e)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCourses()
	}, [id, search])

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

	if (id && course) {
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"../../public/course.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Dettagli corso:</h2>
				</Container>
				<Table striped>
					<tbody>
						<tr>
							<td>Id corso</td>
							<td>{course.id}</td>
						</tr>
						<tr>
							<td>Titolo corso</td>
							<td>{course.title}</td>
						</tr>
						<tr>
							<td>Descrizione</td>
							<td>{course.description}</td>
						</tr>
						<tr>
							<td>Docente</td>
							<td>
								<a href={BASE_URL + "/users/" + course.userId}>
									{course.userId}
								</a>
							</td>
						</tr>
						<tr>
							<td>File</td>
							<td>
								<a
									href={
										BASE_URL +
										"/files?courseId=" +
										course.userId
									}
								>
									Visualizza file del corso
								</a>
							</td>
						</tr>
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
						src={"../../public/course.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					{userId ? (
						<h2 className="text-2xl">Elenco corsi per docente:</h2>
					) : (
						<h2 className="text-2xl">Elenco corsi:</h2>
					)}
				</Container>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id corso</th>
						<th>Titolo corso</th>
						<th>Descrizione</th>
						<th>Docente</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{courses.map((course) => (
						<tr key={course.id}>
							<td>
								<a href={BASE_URL + "/courses/" + course.id}>
									{course.id}
								</a>
							</td>
							<td>{course.title}</td>
							<td>{course.description}</td>
							<td>
								<a href={BASE_URL + "/users/" + course.userId}>
									{course.userId}
								</a>
							</td>
							<td>
								<Button
									href={
										BASE_URL +
										"/files?courseId=" +
										course.id
									}
									variant="outline-success"
								>
									File
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
