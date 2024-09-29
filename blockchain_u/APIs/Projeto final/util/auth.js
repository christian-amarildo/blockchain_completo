//auxiliary functions, used by auth controller
const logger = require("../util/logger");

const { sign } = require("jsonwebtoken");

exports.createJWT = (username, org, role="client",expiration = "7d") => {
  //.env
  const token = sign({ username, org, role }, process.env.JWT_KEY, {
    expiresIn: expiration,
  });
  logger.debug(`JWT: ${token}`);

  return token;
};