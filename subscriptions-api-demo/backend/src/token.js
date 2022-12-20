const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const qs = require("qs");

const applicationId = "urn:aid:9c555958-73b6-48e1-819e-f94f1f354264";

const { v4: uuidv4 } = require("uuid");

const getJwtFromApp = () => {
  var privateKEY = fs.readFileSync("./private-key.pem", "utf8");
  var payload = {
    iat: 1669592488,
    exp: 1800796855,
    iss: applicationId,
    sub: applicationId,
    aud: "https://services.poynt.net",
    jti: uuidv4(),
  };
  return jwt.sign(payload, privateKEY, { algorithm: "RS256" });
};

const getMerchantAccessToken = async (code) => {
  const token = getJwtFromApp();
  const body = qs.stringify({
    grantType: "authorization_code",
    client_id: applicationId,
    code: code,
    redirect_uri: "localhost:3000",
  });

  try {
    const { data } = await axios.post(
      "https://services.poynt.net/token",
      body,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
          "api-version": "1.2",
        },
      }
    );
    console.log("Merchant access token", data);
    return data;
  } catch (error) {
    console.log(
      "Could not generate merchant access token: ",
      error?.response?.data
    );
  }
};

const getAppAccessToken = async () => {
  const token = getJwtFromApp();
  const body = qs.stringify({
    grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: token,
  });
  try {
    const { data } = await axios.post(
      "https://services.poynt.net/token",
      body,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "api-version": "1.2",
        },
      }
    );
    return data.accessToken;
  } catch (error) {
    console.log("Could not generate app access token: ", error);
  }
};

module.exports = { getMerchantAccessToken, getAppAccessToken };
