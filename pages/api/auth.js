import { pusher } from "../../lib"

export default async (req, res) => {
	const { channel_name, socket_id, username } = req.body

	const presenceData = {
		user_id: socket_id,
		user_info: {
			username,
		},
	}

	try {
		const auth = pusher.authenticate(socket_id, channel_name, presenceData)
		res.send(auth)
	} catch (error) {
		res.status(500).send(error)
	}
}
