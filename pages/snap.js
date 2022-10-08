import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

export default function Snap({ username }) {
	const pusher = new Pusher("293a61203fa0038d6486", {
		cluster: "ap2",
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
	const [toast, setToast] = useState({ title: "", body: "" })

	useEffect(() => {
		const channel = pusher.subscribe("presence-comments")

		import("bootstrap/dist/js/bootstrap").then(bootstrap => {
			const toast = window.document.querySelector("#liveToast")
			new bootstrap.Toast(toast)

			channel.bind("pusher:member_added", member => {
				setToast({
					title: "🟢 Member Added",
					body: `${member.info.username} has joined the discussion!`,
				})
				const toast = bootstrap.Toast.getInstance(window.document.querySelector("#liveToast"))
				toast.show()
			})

			channel.bind("pusher:member_removed", member => {
				setToast({
					title: "🔴 Member Removed",
					body: `${member.info.username} has left the discussion!`,
				})
				const toast = bootstrap.Toast.getInstance(window.document.querySelector("#liveToast"))
				toast.show()
			})
		})

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
			<div className="toast-container position-fixed bottom-0 end-0 p-3">
				<div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
					<div className="toast-header">
						<strong className="me-auto">{toast.title}</strong>
						<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">{toast.body}</div>
				</div>
			</div>
		</>
	)
}
