import { useContext, useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import StarRating from "../StarRating"
import DeleteReview from "./DeleteReview"
import EditReview from "./EditReview"
import AddReview from "./AddReview"
import { UserContext } from "../../contexts/UserContext"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Review {
	id: number
	text: string
	rating: number
	userId: number
	fileId: number
}

interface ReviewsProps {
	userId?: number // Aggiunto userId come prop opzionale
}

export default function Reviews({ userId }: ReviewsProps) {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [reviews, setReviews] = useState<Review[]>([])
	const [review, setReview] = useState<Review | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { user } = useContext(UserContext)

	// Estrai i parametri di query dalla stringa di ricerca
	const queryParams = new URLSearchParams(search)
	const urlUserId = queryParams.get("userId")
	const fileId = queryParams.get("fileId")

	// Usa userId prop se presente, altrimenti usa quello dalla query string
	const finalUserId = userId ?? urlUserId

	useEffect(() => {
		const fetchReviews = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/reviews"

			// Aggiungi i parametri di query all'URL se presenti
			const queryStrings: string[] = []
			if (finalUserId) queryStrings.push(`userId=${finalUserId}`)
			if (fileId) queryStrings.push(`fileId=${fileId}`)

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
					const reviewData = (await response.json()) as Review
					setReview(reviewData)
				} else {
					const reviewsData = (await response.json()) as Review[]
					setReviews(reviewsData)
				}
			} catch (e: any) {
				setError(e.message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchReviews()
	}, [id, search, finalUserId, fileId])

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

	if (id && review) {
		return (
			<div>
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/review.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Dettagli recensione:</h2>
				</Container>
				<Table striped>
					<tbody>
						<tr>
							<td>Id</td>
							<td>{review.id}</td>
						</tr>
						<tr>
							<td>Testo</td>
							<td>{review.text}</td>
						</tr>
						<tr>
							<td>Rating</td>
							<td>
								<StarRating rating={review.rating} />
							</td>
						</tr>
						<tr>
							<td>User Id</td>
							<td>
								<a href={`${BASE_URL}/users/${review.userId}`}>
									{review.userId}
								</a>
							</td>
						</tr>
						<tr>
							<td>File Id</td>
							<td>
								<a href={`${BASE_URL}/files/${review.fileId}`}>
									{review.fileId}
								</a>
							</td>
						</tr>
					</tbody>
				</Table>
				<EditReview
					reviewId={review.id}
					onReviewUpdated={() => window.location.reload()}
					currentText={review.text}
					currentRating={review.rating}
					userId={review.userId}
					fileId={review.fileId}
				></EditReview>
				<DeleteReview reviewId={review.id}></DeleteReview>
			</div>
		)
	}

	return (
		<>
			<div className="tutorial">
				<Container className="d-flex align-items-center mb-4">
					<img
						src={"/review.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Elenco recensioni:</h2>
				</Container>
			</div>
			<Table striped>
				<thead>
					<tr>
						<th>Id</th>
						<th>Testo</th>
						<th>Rating</th>
						<th>User Id</th>
						<th>File Id</th>
					</tr>
				</thead>
				<tbody>
					{reviews.map((review) => (
						<tr key={review.id}>
							<td>
								<div className="d-grid gap-2">
									<Button
										href={`/reviews/${review.id}`}
										variant="outline-primary"
										disabled={
											user.role === "Professor" ||
											(user.role === "Student" &&
												review.userId != user.id)
										}
									>
										{review.id}
									</Button>
								</div>
							</td>
							<td>{review.text}</td>
							<td>
								<StarRating rating={review.rating} />
							</td>
							<td>
								<a href={`${BASE_URL}/users/${review.userId}`}>
									{review.userId}
								</a>
							</td>
							<td>
								<a href={`${BASE_URL}/files/${review.fileId}`}>
									{review.fileId}
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{fileId && user.role != "Professor" && (
				<AddReview fileId={+fileId}></AddReview>
			)}
		</>
	)
}
