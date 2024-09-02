import { useEffect, useState } from "react"
import { Button, Container, Table, Form } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import AddEnrollment from "../enrollments/AddEnrollment"
import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import DeleteCourse from "./DeleteCourse"
import EditCourse from "./EditCourse"
import AddCourse from "./AddCourse"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Course {
	id: number
	title: string
	description: string
	userId: number
}

interface Enrollment {
	courseId: number
	userId: number
}

interface User {
	id: number
	name: string
	lastname: string
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
	const [enrollments, setEnrollments] = useState<Enrollment[]>([]) // Stato per le iscrizioni
	const [course, setCourse] = useState<Course | null>(null)
	const [searchQuery, setSearchQuery] = useState("") // Stato per la query di ricerca
	const [teachers, setTeachers] = useState<User[]>([]) // Stato per i docenti
	const { user } = useContext(UserContext)

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
					// Fetch teacher info for a specific course
					const teacherResponse = await fetch(
						`${BASE_URL_API}/users/${course.userId}`,
						{
							method: "GET",
							credentials: "include",
						}
					)
					if (!teacherResponse.ok) {
						throw new Error("Failed to fetch teacher")
					}
					const teacher = (await teacherResponse.json()) as User
					setTeachers([teacher])
				} else {
					const courses = (await response.json()) as Course[]
					setCourses(courses)

					// Fetch all teachers
					const uniqueTeacherIds = [
						...new Set(courses.map((course) => course.userId)),
					]
					const teachersResponse = await Promise.all(
						uniqueTeacherIds.map((userId) =>
							fetch(`${BASE_URL_API}/users/${userId}`, {
								method: "GET",
								credentials: "include",
							})
						)
					)
					const teachersData = (await Promise.all(
						teachersResponse.map((res) => res.json())
					)) as User[]
					setTeachers(teachersData)
				}
			} catch (e: any) {
				setError(e)
			} finally {
				setIsLoading(false)
			}
		}

		const fetchEnrollments = async () => {
			// Recupera le iscrizioni dell'utente corrente
			try {
				const response = await fetch(
					`${BASE_URL_API}/enrollments?userId=${user.id}`,
					{
						method: "GET",
						credentials: "include",
					}
				)
				if (!response.ok) {
					throw new Error("Failed to fetch enrollments")
				}
				const enrollments = (await response.json()) as Enrollment[]
				setEnrollments(enrollments)
			} catch (e: any) {
				setError(e)
			}
		}

		fetchCourses()
		if (user && user.id && user.id != -1) {
			fetchEnrollments()
		}
	}, [id, userId, urlUserId, user])

	// Funzione per filtrare i corsi in base alla query di ricerca
	// Funzione per filtrare i corsi in base alla query di ricerca e searchId
	const filteredCourses = courses.filter((course) => {
		const searchId = searchQuery.trim() // rimuove eventuali spazi vuoti
		const matchesId = course.id.toString().startsWith(searchId)
		const matchesTitleOrDescription =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description.toLowerCase().includes(searchQuery.toLowerCase())

		return matchesId || matchesTitleOrDescription
	})

	// Funzione per ottenere il nome e il cognome del docente basato sull'ID
	const getTeacherName = (userId: number) => {
		const teacher = teachers.find((teacher) => teacher.id === userId)
		return teacher
			? `${teacher.name} ${teacher.lastname}`
			: "Caricamento docente..."
	}

	// Funzione per controllare se l'utente è iscritto a un corso specifico
	const isUserEnrolled = (courseId: number) => {
		return enrollments.some(
			(enrollment) => enrollment.courseId === courseId
		)
	}

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
								{teachers.length > 0 ? (
									<a
										href={
											BASE_URL + "/users/" + course.userId
										}
									>
										{getTeacherName(course.userId)}
									</a>
								) : (
									"Caricamento docente..."
								)}
							</td>
						</tr>

						{(user.role === "Admin" ||
							(user.role === "Professor" &&
								user.id === course.userId)) && (
							<>
								<tr>
									<td>Iscrizioni</td>
									<td>
										<Button
											href={
												BASE_URL +
												"/enrollments?courseId=" +
												course.id
											}
											variant="outline-success"
										>
											Visualizza iscrizioni del corso
										</Button>
									</td>
								</tr>
							</>
						)}

						{(user.role === "Admin" ||
							user.role === "Student" ||
							(user.role === "Professor" &&
								user.id === course.userId)) && (
							<>
								<tr>
									<td>File</td>
									<td>
										<Button
											href={
												BASE_URL +
												"/files?courseId=" +
												course.id
											}
											variant="outline-success"
											disabled={
												user.role === "Student" &&
												!isUserEnrolled(course.id)
											} // Disabilita se non iscritto
										>
											Visualizza file del corso
										</Button>
									</td>
								</tr>
							</>
						)}

						{(user.role === "Student" || user.role === "Admin") &&
							user.id != -1 && (
								<>
									<tr>
										<td>Iscrizione</td>
										<td>
											<AddEnrollment
												courseId={course.id}
											></AddEnrollment>
										</td>
									</tr>
								</>
							)}
					</tbody>
				</Table>
				{(user.role === "Admin" ||
					(user.role === "Professor" &&
						user.id === course.userId)) && (
					<>
						<EditCourse
							courseId={course.id}
							currentDescription={course.description}
							currentTitle={course.title}
							currentUserId={course.userId}
							onCourseUpdated={() => window.location.reload()}
						></EditCourse>
						<DeleteCourse courseId={course.id}></DeleteCourse>
					</>
				)}
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
					{urlUserId && (
						<h2 className="text-2xl">
							Elenco corsi {getTeacherName(+urlUserId)} :
						</h2>
					)}
					{userId && (
						<h2 className="text-2xl">
							Elenco corsi {getTeacherName(+userId)} :
						</h2>
					)}
					{!userId && !urlUserId && (
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
									{getTeacherName(course.userId)}
								</a>
							</td>
							<td>
								<div className="d-grid gap-2">
									{(user.role === "Admin" ||
										user.role === "Student" ||
										(user.role === "Professor" &&
											user.id === course.userId)) && (
										<>
											<Button
												href={
													BASE_URL +
													"/files?courseId=" +
													course.id
												}
												variant="outline-success"
												disabled={
													user.role === "Student" &&
													!isUserEnrolled(course.id)
												} // Disabilita se non iscritto
											>
												File
											</Button>
										</>
									)}
								</div>
							</td>
							<td>
								{(user.role === "Student" ||
									user.role === "Admin") &&
									user.id != -1 && (
										<AddEnrollment
											courseId={course.id}
										></AddEnrollment>
									)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{(user.role === "Admin" ||
				(user.role === "Professor" &&
					(user.id === userId || user.id === Number(urlUserId)))) && (
				<div className="mb-4">
					<AddCourse
						initialUserId={userId || Number(urlUserId)}
					></AddCourse>
				</div>
			)}
		</>
	)
}
