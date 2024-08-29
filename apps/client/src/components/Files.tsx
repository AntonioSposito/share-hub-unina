import { useContext, useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom" // Aggiungi import
import AddFile from "./addFile"
import { UserContext } from "../contexts/UserContext"
import AddReview from "./addReview"
import StarRating from "./StarRating"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface File {
	id: number
	name: string
	description: string
	path: string
	avgRating: number
	courseId: number
}

export default function FIles() {
	const { user } = useContext(UserContext)
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation() // Ottieni la query string
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [showAddCourseForm, setShowAddCourseForm] = useState(false) // Stato per la visibilità del form
	const [files, setFiles] = useState<File[]>([])
	const [file, setFile] = useState<File | null>(null)

	// Gestione della query string
	const queryParams = new URLSearchParams(search)
	const courseId = queryParams.get("courseId")
	const courseIdNumber = courseId ? parseInt(courseId, 10) : null

	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/files/"

			if (courseId) {
				url += `?courseId=${courseId}`
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
					const file = (await response.json()) as File
					setFile(file)
				} else {
					const files = (await response.json()) as File[]
					setFiles(files)
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

	if (id && file) {
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"../../public/enrollment.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Dettagli file:</h2>
				</Container>
				<Table striped>
					<tbody>
						<tr>
							<td>Id file</td>
							<td>{file.id}</td>
						</tr>
						<tr>
							<td>Corso</td>
							<td>{file.courseId}</td>
						</tr>
						<tr>
							<td>Nome file</td>
							<td>{file.name}</td>
						</tr>
						<tr>
							<td>Descrizione</td>
							<td>{file.description}</td>
						</tr>
						<tr>
							<td>Valutazione media</td>
							<td>{file.avgRating}</td>
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
						src={"../../public/file.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					{courseId ? (
						<h2 className="text-2xl">Elenco file per corso:</h2>
					) : (
						<h2 className="text-2xl">Elenco file:</h2>
					)}
				</Container>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id file</th>
						<th>Corso</th>
						<th>Nome file</th>
						<th>Descrizione</th>
						<th>Valutazione media</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{files.map((file) => (
						<tr key={file.id}>
							<td>{file.id}</td>
							<td>{file.courseId}</td>
							<td>{file.name}</td>
							<td>{file.description}</td>
							<td>
								{file.avgRating !== -1 ? (
									<>
										<StarRating rating={file.avgRating} />(
										{file.avgRating})
									</>
								) : (
									"Nessuna recensione :("
								)}
							</td>
							<td>
								<Button href="#" variant="outline-success">
									Download
								</Button>
							</td>
							<td>
								<Button
									href={"/reviews?fileId=" + file.id}
									variant="outline-success"
								>
									Recensioni
								</Button>
							</td>
							<td>
								{(user.role === "Student" ||
									user.role === "Admin") && (
									<AddReview fileId={file.id} />
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{courseId &&
				(user.role === "Professor" || user.role === "Admin") && (
					<>
						<Button
							variant="primary"
							onClick={() =>
								setShowAddCourseForm(!showAddCourseForm)
							} // Alterna la visibilità del form
						>
							{showAddCourseForm
								? "Nascondi form"
								: "Aggiungi File"}
						</Button>
						{showAddCourseForm && (
							<AddFile courseId={courseIdNumber || 0}></AddFile>
						)}
					</>
				)}
		</>
	)
}
