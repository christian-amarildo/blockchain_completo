const logger = require("../util/logger");
const HttpError = require("../util/http-error");
const helper = require("../util/helper");
const crypto = require("crypto");

//buy NFT for 100 U$Ps
exports.buyNFT = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const tokenId = req.body.tokenId;
  const tokenOwnerId = req.body.tokenOwnerId;
  const username = req.jwt.username;
  const org = req.jwt.org;

  console.log(tokenOwnerId, tokenId);

  //connect to the channel and get the chaincode
  const [chaincode, gateway] = await helper.getChaincode(
    org,
    channel,
    chaincodeName,
    username,
    next
  );
  if (!chaincode) return;

  //mint
  try {
    await chaincode.submitTransaction(
      "SmartContract:BuyNFT",
      tokenOwnerId,
      tokenId
    );
    logger.info("Purchase successful");

    //close communication channel
    await gateway.disconnect();
  } catch (err) {
    console.log(err);
    const regexp = new RegExp(/message=(.*)$/g);
    const errMessage = regexp.exec(err.message);
    return next(new HttpError(500, errMessage[1]));
  }

  //send OK response
  return res.json({
    result: "success",
  });
};

//mint given token for a user
exports.mint = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const tokenId = req.body.tokenId;
  const tokenAmount = req.body.tokenAmount;
  const tokenReceiver = req.body.tokenReceiver;
  const tokenReceiverOrg = req.body.tokenReceiverOrg;
  const disciplina = req.body.disciplina;
  const atividade = req.body.atividade;
  const periodo = req.body.periodo;
  const resolucao = req.body.resolucao;
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

  //get receiver id
  const receiverAccountId = await helper.getAccountId(
    channel,
    chaincodeName,
    tokenReceiver,
    tokenReceiverOrg,
    next
  );
  if (!receiverAccountId) return;

  //mint
  try {
    await chaincode.submitTransaction(
      "SmartContract:Mint",
      receiverAccountId,
      tokenId === "usp" ? tokenId : generateTokenId(req.body),
      tokenAmount,
      JSON.stringify({
        disciplina,
        atividade,
        periodo,
        resolucao,
      })
    );
    logger.info("Mint successful");

    //close communication channel
    await gateway.disconnect();
  } catch (err) {
    console.log(err);
    const regexp = new RegExp(/message=(.*)$/g);
    const errMessage = regexp.exec(err.message);
    return next(new HttpError(500, errMessage[1]));
  }

  //send OK response
  return res.json({
    result: "success",
  });
};

//transfer a given amount of a token from a user to another
exports.transfer = async (req, res, next) => {
  const chaincodeName = req.params.chaincode;
  const channel = req.params.channel;
  const tokenId = req.body.tokenId;
  const tokenAmount = req.body.tokenAmount;
  const tokenReceiver = req.body.tokenReceiver;
  const tokenReceiverOrg = req.body.tokenReceiverOrg;
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

  //get sender id
  const senderAccountId = await helper.getAccountId(
    channel,
    chaincodeName,
    username,
    org,
    next
  );
  if (!senderAccountId) return;

  //get receiver id
  const receiverAccountId = await helper.getAccountId(
    channel,
    chaincodeName,
    tokenReceiver,
    tokenReceiverOrg,
    next
  );
  if (!receiverAccountId) return;

  //transfer
  try {
    await chaincode.submitTransaction(
      "SmartContract:TransferFrom",
      senderAccountId,
      receiverAccountId,
      tokenId,
      tokenAmount
    );
    logger.info("Transference successful");

    //close communication channel
    await gateway.disconnect();

    //send OK response
    return res.json({
      result: "success",
    });
  } catch (err) {
    const regexp = new RegExp(/message=(.*)$/g);
    const errMessage = regexp.exec(err.message);
    return next(new HttpError(500, errMessage[1]));
  }
};

//sha-256 from token info + timestamp
const generateTokenId = (tokenInfoJson) => {
  //add more entropy
  tokenInfoJson["timestamp"] = Date.now();

  //hash all the info
  const tokenInfo = JSON.stringify(tokenInfoJson);
  const hash = crypto.createHash("sha256").update(tokenInfo).digest("hex");

  return hash;
};
