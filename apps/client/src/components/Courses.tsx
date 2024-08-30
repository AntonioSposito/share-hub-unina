import { useEffect, useState } from "react"
import { Button, Container, Table, Form } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import AddEnrollment from "./addEnrollment"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import DeleteCourse from "./DeleteCourse"
import EditCourse from "./EditCourse"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Course {
	id: number
	title: string
	description: string
	userId: number
}

interface CoursesProps {
	userId?: number
}

export default function Courses({ userId }: CoursesProps) {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [courses, setCourses] = useState<Course[]>([])
	const [course, setCourse] = useState<Course | null>(null)
	const [searchQuery, setSearchQuery] = useState("") // Stato per la query di ricerca
	const { user } = useContext(UserContext)

	//const courseIdNumber = id ? parseInt(id, 10) : null

	// Gestione della query string
	const queryParams = new URLSearchParams(search)
	const urlUserId = queryParams.get("userId")

	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/courses/"

			if (id) {
				url += id
			} else if (userId || urlUserId) {
				url += `?userId=${userId || urlUserId}`
			}

			try {
				const response = await fetch(url, {
					method: "GET",
					credentials: "include",
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
	}, [id, userId, urlUserId])

	// Funzione per filtrare i corsi in base alla query di ricerca
	const filteredCourses = courses.filter(
		(course) =>
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description.toLowerCase().includes(searchQuery.toLowerCase())
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

	if (id && course) {
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/course.png"}
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
						<tr>
							<td>Iscrizione</td>
							<td>
								{(user.role === "Student" ||
									user.role === "Admin") && (
									<AddEnrollment
										courseId={course.id}
									></AddEnrollment>
								)}
							</td>
						</tr>
					</tbody>
				</Table>
				<EditCourse
					courseId={course.id}
					currentDescription={course.description}
					currentTitle={course.title}
					onCourseUpdated={() => window.location.reload()}
				></EditCourse>
				<DeleteCourse courseId={course.id}></DeleteCourse>
			</div>
		)
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/course.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					{userId || urlUserId ? (
						<h2 className="text-2xl">Elenco corsi per docente:</h2>
					) : (
						<h2 className="text-2xl">Elenco corsi:</h2>
					)}
				</Container>

				{/* Campo di ricerca */}
				<Form className="mb-4">
					<Form.Group controlId="search">
						<Form.Label>Ricerca corsi:</Form.Label>
						<Form.Control
							type="text"
							placeholder="Cerca per titolo o descrizione"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</Form.Group>
				</Form>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id corso</th>
						<th>Titolo corso</th>
						<th>Descrizione</th>
						<th>Docente</th>
					</tr>
				</thead>
				<tbody>
					{filteredCourses.map((course) => (
						<tr key={course.id}>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={
											BASE_URL + "/courses/" + course.id
										}
										variant="outline-primary"
									>
										{course.id}
									</Button>
								</div>
							</td>
							<td>{course.title}</td>
							<td>{course.description}</td>
							<td>
								<a href={BASE_URL + "/users/" + course.userId}>
									{course.userId}
								</a>
							</td>
							<td>
								<div className="d-grid gap-2">
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
								</div>
							</td>
							<td>
								{(user.role === "Student" ||
									user.role === "Admin") && (
									<AddEnrollment
										courseId={course.id}
									></AddEnrollment>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}
