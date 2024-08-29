import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import StarRating from "./StarRating"

const BASE_URL_API = import.meta.env.VITE_API_URL
const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface Review {
	id: number
	text: string
	rating: number
	userId: number
	fileId: number
}

export default function Reviews() {
	const { id } = useParams<{ id?: string }>()
	const { search } = useLocation()
	const [reviews, setReviews] = useState<Review[]>([])
	const [review, setReview] = useState<Review | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Estrai i parametri di query dalla stringa di ricerca
	const queryParams = new URLSearchParams(search)
	const userId = queryParams.get("userId")
	const fileId = queryParams.get("fileId")

	useEffect(() => {
		const fetchReviews = async () => {
			setIsLoading(true)
			let url = BASE_URL_API + "/reviews"

			// Aggiungi i parametri di query all'URL se presenti
			const queryStrings: string[] = []
			if (userId) queryStrings.push(`userId=${userId}`)
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
	}, [id, search, userId, fileId])

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
						src={"../../public/review.png"}
						alt="Share-hub unina Logo"
						className="me-3"
						style={{ width: "60px", height: "60px" }}
					/>
					<h2 className="text-2xl">Dettagli file:</h2>
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
							<td>{review.userId}</td>
						</tr>
						<tr>
							<td>File Id</td>
							<td>{review.fileId}</td>
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
						src={"../../public/review.png"}
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
						<th></th>
					</tr>
				</thead>
				<tbody>
					{reviews.map((review) => (
						<tr key={review.id}>
							<td>{review.id}</td>
							<td>{review.text}</td>
							<td>
								<StarRating rating={review.rating} />
							</td>
							<td>{review.userId}</td>
							<td>{review.fileId}</td>
							<td>
								<Button
									href={`/reviews/${review.id}`}
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
