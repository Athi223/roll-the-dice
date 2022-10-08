import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

export default function Snap({ username }) {
	const pusher = new Pusher(process.env.NEXT_PUBLIC_key, {
		cluster: process.env.NEXT_PUBLIC_cluster,
		authEndpoint: "/api/auth",
		auth: {
			params: {
				username,
			},
		},
	})

	const now = new Date()
	const seed = now.toLocaleDateString("es-CL")

	const [comments, setComments] = useState([])
	const [comment, setComment] = useState("")
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		const channel = pusher.subscribe("presence-comments")

		channel.bind("update-comments", data => {
			const { username, comment } = data

			setComments(prevComments => [...prevComments, { username, comment }])
			setComment("")
		})

		setWidth(window.screen.availWidth)
		setHeight(window.screen.availHeight)

		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	}, [])

	const handleComment = e => {
		e.preventDefault()
		fetch("/api/comment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				comment: comment,
			}),
		})
	}

	return (
		<>
			<nav className="navbar navbar-dark bg-danger">
				<div className="container-fluid">
					<span className="navbar-brand mb-0 h1">Snap Board</span>
				</div>
			</nav>
			<div className="container mt-3">
				<div className="row">
					<div className="col-12 col-md-6">
						<div
							className="text-center border border-2 border-primary rounded pt-2 bg-primary"
							style={{ height: "85vh", "--bs-bg-opacity": ".25" }}>
							<img
								src={`https://picsum.photos/seed/${seed}/${width / 3}/${height - 250}`}
								className="border border-2 border-primary rounded"
							/>
							<form onSubmit={handleComment} className="d-flex mx-auto my-2 w-75">
								<input
									type="text"
									className="form-control flex-grow-1 me-2"
									value={comment}
									onChange={e => setComment(e.target.value)}
								/>
								<button className="btn btn-success ms-2" type="submit">
									Comment
								</button>
							</form>
						</div>
					</div>
					<div
						className="col-12 col-md-6 overflow-auto border border-2 border-primary bg-primary rounded p-2"
						style={{ height: "85vh", "--bs-bg-opacity": ".25" }}>
						{comments.map(({ username, comment }, index) => (
							<div key={index} className="card border-dark p-3 mb-2">
								<h5 className="text-danger">{username}</h5>
								<p className="text-secondary">{comment}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
