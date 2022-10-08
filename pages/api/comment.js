import { pusher } from "../../lib"

export default async (req, res) => {
	const { username, comment } = req.body

	await pusher.trigger("presence-comments", "update-comments", {
		username,
		comment,
	})

	res.json({ status: 200 })
}
