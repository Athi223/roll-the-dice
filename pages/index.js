import "bootstrap/dist/css/bootstrap.min.css"

export default function Home({ setUsername, handleAuthenticate }) {
	return (
		<div>
			<form onSubmit={handleAuthenticate}>
				<label htmlFor="username" className="form-label">
					Username
				</label>
				<input type="text" className="form-control" id="username" onChange={e => setUsername(e.target.value)} />
				<button type="submit" className="btn btn-primary" onClick={handleAuthenticate}>
					Submit
				</button>
			</form>
		</div>
	)
}
