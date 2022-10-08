import { useState } from "react"
import { useRouter } from "next/router"

function Application({ Component, pageProps }) {
	const [username, setUsername] = useState("")
	const router = useRouter()

	const handleAuthenticate = async e => {
		e.preventDefault()
		router.push("/snap")
	}

	return (
		<Component
			username={username}
			setUsername={setUsername}
			handleAuthenticate={handleAuthenticate}
			{...pageProps}
		/>
	)
}

export default Application
