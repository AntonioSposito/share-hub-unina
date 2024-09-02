import { useContext, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { UserContext } from "../../contexts/UserContext" // Adjust the import path as necessary

const BASE_URL_API = import.meta.env.VITE_API_URL

interface AddEnrollmentProps {
	courseId: number
}

export default function AddEnrollment({ courseId }: AddEnrollmentProps) {
	const { user } = useContext(UserContext)
	const [error, setError] = useState<string | null>(null)
	const [isEnrolled, setIsEnrolled] = useState(false)
	const [isLoading, setIsLoading] = useState(true) // Start with loading state

	useEffect(() => {
		const checkEnrollment = async () => {
			if (!user) {
				setError("You need to be logged in to enroll.")
				setIsLoading(false)
				return
			}

			try {
				const response = await fetch(
					`${BASE_URL_API}/enrollments?courseId=${courseId}&userId=${user.id}`,
					{
						method: "GET",
						credentials: "include",
					}
				)

				if (!response.ok) {
					throw new Error("Failed to check enrollment status.")
				}

				const data = await response.json()

				// If the array is not empty, it means the user is already enrolled
				if (data.length > 0) {
					setIsEnrolled(true)
				}
			} catch (err: any) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		}

		checkEnrollment()
	}, [courseId, user])

	const handleEnrollment = async () => {
		if (!user) {
			setError("You need to be logged in to enroll.")
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/enrollments`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						courseId: courseId,
						userId: user.id,
					}),
				}
			)

			if (!response.ok) {
				throw new Error("Failed to enroll in the course.")
			}

			setIsEnrolled(true)
			//window.location.reload()
		} catch (err: any) {
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<div>
				<Button
					variant="outline-success"
					onClick={handleEnrollment}
					disabled={isLoading || isEnrolled}
				>
					{isEnrolled
						? "Iscritto"
						: isLoading
							? "Loading..."
							: "Iscriviti"}
				</Button>
			</div>
			{error && <p className="text-danger mt-2">{error}</p>}
		</div>
	)
}
