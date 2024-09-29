const logger = require("../util/logger");
const HttpError = require("../util/http-error");
const helper = require("../util/helper");

//get a car info, given its id
exports.getCar = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const id = req.query.id;
  // const username = req.jwt.username;
  // const org = req.jwt.org;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    "Org1",
    channel,
    chaincodeName,
    "admin",
    next
  );
  if (!chaincode) return;

  //get balance
  try {
    let result = await chaincode.evaluateTransaction(
      "SmartContract:GetCar",
      id
    );
    //close communication channel
    await gateway.disconnect();

    //send OK response
    result = JSON.parse(result.toString());
    logger.info(result);
    return res.json({
      result,
    });
  } catch (err) {
    return next(new HttpError(500, err));
  }
};
