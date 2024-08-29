import React from "react"

interface StarRatingProps {
	rating: number
	maxRating?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
	const fullStars = Math.floor(rating)
	const hasHalfStar = rating % 1 >= 0.5
	const totalStars = hasHalfStar ? fullStars + 1 : fullStars
	const emptyStars = maxRating - totalStars

	return (
		<div style={styles.starRating}>
			{[...Array(totalStars)].map((_, index) => (
				<span
					key={index}
					style={
						index < fullStars ? styles.filledStar : styles.halfStar
					}
				>
					★
				</span>
			))}
			{[...Array(emptyStars)].map((_, index) => (
				<span key={index + totalStars} style={styles.emptyStar}>
					★
				</span>
			))}
		</div>
	)
}

const styles = {
	starRating: {
		fontSize: "24px",
		display: "inline-block",
	},
	filledStar: {
		color: "#ffd700", // Full star color
		display: "inline-block",
	},
	halfStar: {
		color: "#ffd700", // Half star color
		display: "inline-block",
		position: "relative" as const,
	},
	emptyStar: {
		color: "#ddd", // Empty star color
		display: "inline-block",
	},
}

export default StarRating
