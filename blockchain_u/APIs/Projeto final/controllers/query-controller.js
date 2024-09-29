const logger = require("../util/logger");
const HttpError = require("../util/http-error");
const helper = require("../util/helper");

//get user's balance of a given token
exports.balance = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const tokenId = req.query.tokenId;
  const tokenOwner = req.query.tokenOwner;
  const tokenOwnerOrg = req.query.tokenOwnerOrg;
  const username = req.jwt.username;
  const org = req.jwt.org;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    org,
    channel,
    chaincodeName,
    username,
    next
  );
  if (!chaincode) return;

  //get owner id
  const ownerAccountId = await helper.getAccountId(
    channel,
    chaincodeName,
    tokenOwner,
    tokenOwnerOrg,
    next
  );
  if (!ownerAccountId) return;

  //get balance
  try {
    let result = await chaincode.evaluateTransaction(
      "SmartContract:BalanceOf",
      ownerAccountId,
      tokenId
    );
    result = JSON.parse(result.toString());

    //close communication channel
    await gateway.disconnect();

    //send OK response
    logger.info(`${tokenId} balance retrieved successfully: ${result} `);
    return res.json({
      result,
    });
  } catch (err) {
    return next(new HttpError(500, err.message));
  }
};

//return the balance of the requesting client's account, for a given token
exports.selfBalance = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const tokenId = req.query.tokenId;
  const username = req.jwt.username;
  const org = req.jwt.org;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    org,
    channel,
    chaincodeName,
    username,
    next
  );
  if (!chaincode) return;

  //get balance
  try {
    let result = await chaincode.evaluateTransaction(
      "SmartContract:SelfBalance",
      tokenId
    );
    result = JSON.parse(result.toString());

    //close communication channel
    await gateway.disconnect();

    //send OK response
    logger.info(`${tokenId} balance retrieved successfully: ${result} `);
    return res.json({
      result,
    });
  } catch (err) {
    return next(new HttpError(500, err.message));
  }
};

//return the nfts of the own client's account
exports.selfCollection = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const username = req.jwt.username;
  const org = req.jwt.org;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    org,
    channel,
    chaincodeName,
    username,
    next
  );
  if (!chaincode) return;

  //get collection
  try {
    let result = await chaincode.evaluateTransaction(
      "SmartContract:SelfCollection"
    );
    result = JSON.parse(result.toString());
    console.log(result);

    //close communication channel
    await gateway.disconnect();

    //send OK response
    return res.json({
      result,
    });
  } catch (err) {
    return next(new HttpError(500, err.message));
  }
};

//return the nfts of a given account
exports.collection = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  // const tokenOwner = req.query.tokenOwner;
  // const tokenOwnerOrg = req.query.tokenOwnerOrg;
  const username = req.jwt.username;
  const org = req.jwt.org;

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    org,
    channel,
    chaincodeName,
    username,
    next
  );
  if (!chaincode) return;

  //get owner id
  // const ownerAccountId = await helper.getAccountId(
  //   channel,
  //   chaincodeName,
  //   tokenOwner,
  //   tokenOwnerOrg,
  //   next
  // );
  // if (!ownerAccountId) return;

  //get collection
  try {
    let result = await chaincode.evaluateTransaction(
      "SmartContract:Collection"
    );
    result = JSON.parse(result.toString());

    //close communication channel
    await gateway.disconnect();

    //send OK response
    return res.json({
      result,
    });
  } catch (err) {
    return next(new HttpError(500, err.message));
  }
};
