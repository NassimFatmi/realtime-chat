const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function auth(req, res, next) {
	const token = req.header("x-auth-token");
	if (!token)
		return res
			.status(401)
			.json({ errors: [{ msg: "no token, authorization denied" }] });

	try {
		const decoded = await jwt.verify(token, config.get("jwtSecret"));
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ errors: [{ msg: "Token is not valid" }] });
	}
};
