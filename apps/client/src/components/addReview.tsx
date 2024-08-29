import { useContext, useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { UserContext } from "../contexts/UserContext"

interface AddReviewProps {
	fileId: number
}

export default function AddReview({ fileId }: AddReviewProps) {
	const { user } = useContext(UserContext)
	const [text, setText] = useState("")
	const [rating, setRating] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [hasReviewed, setHasReviewed] = useState(false)

	useEffect(() => {
		const checkExistingReview = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/reviews?fileId=${fileId}&userId=${user.id}`,
					{
						method: "GET",
						credentials: "include", // Include cookies
					}
				)

				if (!response.ok) {
					throw new Error("Failed to fetch reviews")
				}

				const reviews = await response.json()

				if (reviews.length > 0) {
					setHasReviewed(true)
				}
			} catch (err: any) {
				setError(err.message)
			}
		}

		if (user) {
			checkExistingReview()
		}
	}, [fileId, user])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!rating || rating < 1 || rating > 5) {
			setError("Please provide a rating between 1 and 5.")
			return
		}

		setIsLoading(true)
		setError(null)
		setSuccessMessage(null)

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/reviews`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						text,
						rating,
						userId: user.id,
						fileId: fileId,
					}),
				}
			)

			if (!response.ok) {
				throw new Error("Failed to submit the review.")
			}

			setSuccessMessage("Review submitted successfully!")
			setText("")
			setRating(null)
			setHasReviewed(true) // Disable the form after successful submission
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const toggleFormVisibility = () => {
		setIsFormVisible(!isFormVisible)
	}

	return (
		<div>
			<Button
				variant="outline-success"
				onClick={toggleFormVisibility}
				disabled={hasReviewed} // Disable the button if the user has already reviewed
			>
				{hasReviewed
					? "Hai già recensito"
					: isFormVisible
						? "Nascondi"
						: "Aggiungi recensione"}
			</Button>

			{isFormVisible && !hasReviewed && (
				<Form onSubmit={handleSubmit} className="mt-3">
					<Form.Group controlId="reviewText">
						<Form.Label>Testo recensione</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={text}
							onChange={(e) => setText(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group controlId="reviewRating" className="mt-3">
						<Form.Label>Voto (1-5)</Form.Label>
						<Form.Control
							type="number"
							min="1"
							max="5"
							value={rating || ""}
							onChange={(e) =>
								setRating(parseInt(e.target.value, 10))
							}
							required
						/>
					</Form.Group>

					{error && <p className="text-danger mt-3">{error}</p>}
					{successMessage && (
						<p className="text-success mt-3">{successMessage}</p>
					)}

					<Button
						type="submit"
						variant="primary"
						className="mt-3"
						disabled={isLoading}
					>
						{isLoading ? "Submitting..." : "Submit Review"}
					</Button>
				</Form>
			)}
		</div>
	)
}
