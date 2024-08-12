import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
	return (
		<div>
			<p>404 not found</p>
			<Link to="/home">
				<Button href="/home">Torna alla home</Button>
			</Link>
		</div>
	)
}
