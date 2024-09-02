import { useLocation } from "react-router-dom"
import { Breadcrumb as BootstrapBreadcrumb } from "react-bootstrap"

const Breadcrumb = () => {
	const { pathname } = useLocation()

	// Funzione per generare i breadcrumb in base al percorso
	const generateBreadcrumbs = () => {
		// const { search } = useLocation()
		const paths = pathname.split("/").filter((x) => x)
		// const queryParams = new URLSearchParams(search)
		// const urtUserId = queryParams.get("userId")
		const breadcrumbItems = [{ name: "Home", to: "/" }]
		console.log("Paths=" + paths)

		if (paths.length > 0) {
			switch (paths[0]) {
				case "profile":
					breadcrumbItems.pop()
					break
				case "professors":
					breadcrumbItems.push({
						name: "Professori",
						to: "/professors",
					})
					break
				case "students":
					breadcrumbItems.push({
						name: "Studenti",
						to: "/students",
					})
					break
				case "users":
					breadcrumbItems.push({
						name: "Utenti",
						to: "/users",
					})
					if (paths[1]) {
						breadcrumbItems.push({
							name: "Utente",
							to: "/users",
						})
					}
					break
				// case "courses":
				// 	if (!paths[1]) {
				// 		breadcrumbItems.push({
				// 			name: "Corsi",
				// 			to: "/courses",
				// 		})
				// 	} else if (paths[1])
				// 	break
			}
		}

		return breadcrumbItems
	}

	const breadcrumbs = generateBreadcrumbs()

	return (
		<BootstrapBreadcrumb>
			{breadcrumbs.map((breadcrumb, index) => (
				<BootstrapBreadcrumb.Item
					key={index}
					active={index === breadcrumbs.length - 1}
					href={breadcrumb.to}
					as={index === breadcrumbs.length - 1 ? "span" : "a"}
				>
					{breadcrumb.name}
				</BootstrapBreadcrumb.Item>
			))}
		</BootstrapBreadcrumb>
	)
}

export default Breadcrumb
