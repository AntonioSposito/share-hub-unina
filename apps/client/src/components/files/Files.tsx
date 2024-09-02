import { useContext, useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import AddFile from "./AddFile"
import { UserContext } from "../../contexts/UserContext"
import StarRating from "../StarRating"
import DeleteFile from "./DeleteFile"
import EditFile from "./EditFile"

const BASE_URL_API = import.meta.env.VITE_API_URL

interface File {
	id: number
	name: string
	description: string
	path: string
	avgRating: number
	courseId: number
}

interface Course {
	id: number
	title: string
	description: string
	userId: number
}

export default function Files() {
	const { user } = useContext(UserContext)
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [error, setError] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	const [file, setFile] = useState<File | null>(null)
	const [course, setCourse] = useState<Course | null>(null)

	const queryParams = new URLSearchParams(search)
	const courseId = queryParams.get("courseId")

	useEffect(() => {
		const fetchFiles = async () => {
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
					credentials: "include",
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

		const fetchCourse = async () => {
			if (courseId) {
				try {
					const response = await fetch(
						`${BASE_URL_API}/courses/${courseId}`,
						{
							method: "GET",
							credentials: "include",
						}
					)
					if (response.ok) {
						const course = (await response.json()) as Course
						setCourse(course)
					} else {
						throw new Error("Failed to fetch course")
					}
				} catch (error) {
					console.error("Errore nel recupero del corso:", error)
				}
			}
		}

		fetchFiles()
		fetchCourse()
	}, [id, search, user.id, user.role])

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
						src={"/file.png"}
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
							<td>
								<a href={`/courses/${file.courseId}`}>
									{file.courseId}
								</a>
							</td>
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
							<td>
								{file.avgRating > 0 ? (
									<>
										<StarRating rating={file.avgRating} />(
										{file.avgRating})
									</>
								) : (
									"Nessuna recensione :("
								)}
							</td>
						</tr>
						<tr>
							<td>Download</td>
							<td>
								<Button
									href={"/download?fileId=" + file.id}
									variant="outline-success"
								>
									Download
								</Button>
							</td>
						</tr>
						<tr>
							<td>Recensioni</td>
							<td>
								<Button
									href={"/reviews?fileId=" + file.id}
									variant="outline-success"
									disabled={file.avgRating <= 0}
								>
									Recensioni
								</Button>
							</td>
						</tr>
					</tbody>
				</Table>
				<EditFile
					fileId={file.id}
					courseId={file.courseId}
					currentDescription={file.description}
					currentName={file.name}
					onFileUpdated={() => window.location.reload()}
				/>
				<DeleteFile fileId={file.id} />
			</div>
		)
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/file.png"}
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
							<td>
								<div className="d-grid gap-2">
									<Button
										href={`/files/${file.id}`}
										variant="outline-primary"
									>
										{file.id}
									</Button>
								</div>
							</td>
							<td>
								<a href={`/courses/${file.courseId}`}>
									{file.courseId}
								</a>
							</td>
							<td>{file.name}</td>
							<td>{file.description}</td>
							<td>
								{file.avgRating > 0 ? (
									<>
										<StarRating rating={file.avgRating} />(
										{file.avgRating})
									</>
								) : (
									"Nessuna recensione :("
								)}
							</td>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={"/download?fileId=" + file.id}
										variant="outline-success"
									>
										Download
									</Button>
								</div>
							</td>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={"/reviews?fileId=" + file.id}
										variant="outline-success"
									>
										Recensioni
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			{((user.role === "Admin" && courseId) ||
				(user.role === "Professor" &&
					courseId &&
					user.id === course?.userId)) && (
				<AddFile courseId={+courseId} />
			)}
		</>
	)
}
