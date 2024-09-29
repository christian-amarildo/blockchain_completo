const helper = require("../util/helper");
const logger = require("../util/logger");
const auth = require("../util/auth");
const HttpError = require("../util/http-error");
var { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

//////////DIRECT API CALLS//////////
exports.register = async (req, res, next) => {
  logger.trace("Entered register controller");

  let user = req.body;
  user.isAdmin = user.isAdmin === "false" ? false : true;

  logger.debug("Username: " + user.username);
  logger.debug("Org: " + user.org);
  logger.debug("isAdmin: " + user.isAdmin);

  //enroll user in the CA and save it in the wallet
  if (!(await enrollUserInCA(user, next))) return;

  //create JWT, add to reponse
  let token = auth.createJWT(user.username, user.org);

  res.json(token);
};

//////////HELPER CALLS//////////

//register the user in the CA, enroll the user in the CA, and save the new identity into the wallet. Returns true if things went as expected.
const enrollUserInCA = async (user, next) => {
  //get org CCP (its configs, such as CA path and tlsCACerts)
  let ccp = await helper.getCCP(user.org);

  //create CA object
  const caURL = await helper.getCaUrl(user.org, ccp);

  const ca = new FabricCAServices(caURL);

  //get wallets' path for the given org and create wallet object
  const walletPath = await helper.getWalletPath(user.org);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  //check if a wallet for the given user already exists
  const userIdentity = await wallet.get(user.username);
  if (userIdentity) {
    logger.warn(
      `An identity for the user ${user.username} already exists in the wallet`
    );

    return true;
  }

  //enroll an admin user if it doesn't exist yet
  let adminIdentity = await wallet.get("admin");
  if (!adminIdentity) {
    logger.info(
      'An identity for the admin user "admin" does not exist in the wallet'
    );

    try {
      await helper.enrollAdmin(user.org, ccp);
      adminIdentity = await wallet.get("admin");
      logger.info("Admin Enrolled Successfully");
    } catch (error) {
      return next(new HttpError(500));
    }
  }

  //build an admin user object (necessary for authenticating with the CA and thus enrolling a new user)
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, "admin");

  let secret;
  try {
    //register user
    secret = await ca.register(
      {
        enrollmentID: user.username,
        role: user.isAdmin ? "admin" : "client",
        // attrs: [
        //   {
        //     name: "role",
        //     value: user.isAdmin ? "admin" : "client",
        //     ecert: true,
        //   },
        // ],
      },
      adminUser
    );

    var enrollment = await ca.enroll({
      enrollmentID: user.username,
      enrollmentSecret: secret,
    });
    privateKey = enrollment.key.toBytes();

    //save cert and privateKey to wallet
    let orgMSPId = helper.getOrgMSP(user.org);
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: privateKey,
      },
      mspId: orgMSPId,
      type: "X.509",
    };
    await wallet.put(user.username, x509Identity);
  } catch (err) {
    //issue error
    return next(new HttpError(500));
  }

  //OK
  return true;
};
