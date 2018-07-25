import UserModel from '@/models/user'
import Mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

module.exports = async (req, res, next) => {
	const appId = req.headers.appid

	if (!req.headers.authorization) return next()

	if (req.context.user) return next()

	const parts = req.headers.authorization.split(' ')

	if (parts.length !== 2) return res.sendStatus(500)

	const scheme = parts[0]
	const credentials = parts[1]
	switch (scheme) {
	case 'playerg':
		try {
			let game = await Mongoose.model('Game').findOne({appid: appId}, {_id: 1})
			let test = jwt.decode(credentials)
			let useridg = test.sub
			let user = await UserModel.FindOrCreateGoogle(useridg, game._id)
			user.game = game._id
			user.gid = useridg
			req.context.user = user
			return next()
		} catch (err) {
			console.log(err)
			return res.sendStatus(500)
		}
	default:
		next()
	}
}