const logger = require("../util/logger");
const HttpError = require("../util/http-error");
const helper = require("../util/helper");

//create a car
exports.createCar = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const id = req.body.id;
  const make = req.body.make;
  const model = req.body.model;
  const colour = req.body.colour;
  const owner = req.body.owner;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    "Org1",
    channel,
    chaincodeName,
    "user",
    next
  );
  if (!chaincode) return;

  //call CC
  try {
    await chaincode.submitTransaction(
      "SmartContract:CreateCar",
      id,
      make,
      model,
      colour,
      owner
    );
    logger.info("Creation successful");

    //close communication channel
    await gateway.disconnect();
  } catch (err) {
    const regexp = new RegExp(/message=(.*)$/g);
    const errMessage = regexp.exec(err.message);
    return next(new HttpError(500, errMessage[1]));
  }

  //send OK response
  return res.json({
    result: "success",
  });
};
