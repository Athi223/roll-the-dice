import "bootstrap/dist/css/bootstrap.min.css"

export default function Home({ setUsername, handleAuthenticate }) {
	return (
		<div className="d-flex flex-column" style={{ height: "100vh" }}>
			<nav className="navbar navbar-dark bg-danger">
				<div className="container-fluid">
					<h1 className="navbar-brand mb-0">Snap Board</h1>
				</div>
			</nav>
			<div className="flex-grow-1 d-flex justify-content-center align-items-center">
				<form
					onSubmit={handleAuthenticate}
					className="border border-2 border-primary rounded p-4 text-center bg-primary"
					style={{ width: "40vw", height: "30vh", "--bs-bg-opacity": ".25" }}>
					<h4 className="text-primary">Enter a Username to Join the Discussion!</h4>
					<input
						type="text"
						className="form-control my-4"
						id="username"
						onChange={e => setUsername(e.target.value)}
						placeholder="Username"
					/>
					<button type="submit" className="btn btn-success" onClick={handleAuthenticate}>
						Join!
					</button>
				</form>
			</div>
		</div>
	)
}
