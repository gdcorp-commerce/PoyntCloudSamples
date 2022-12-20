const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

const { getMerchantAccessToken } = require("./token");
const {
  getPlans,
  createSubscription,
  getSubscriptions,
  replaceSubscription,
} = require("./billing");
const app = express();

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/token", async (req, res) => {
  const code = req.body.code;
  const data = await getMerchantAccessToken(code);
  return res.send(data);
});

app.get("/plans", async (req, res) => {
  const plans = await getPlans();
  return res.send(plans);
});

app.post("/subscriptions", async (req, res) => {
  const token = req.headers.authorization;
  const isReplace = req.body.replaceV2;
  const isDeviceScope = req.body.isDeviceScope;
  if (!isReplace) {
    const data = await createSubscription(
      token,
      req.body.businessId,
      req.body.planId,
      isDeviceScope
    );
    return res.send(data);
  }
  const data = await replaceSubscription(
    token,
    req.body.businessId,
    req.body.planId,
    isDeviceScope
  );
  return res.send(data);
});

app.get("/subscriptions", async (req, res) => {
  const token = req.headers.authorization;
  const businessId = req.query.businessId;
  const data = await getSubscriptions(token, businessId);
  return res.send(data);
});

app.listen(9090, () => {
  console.log("Backend running");
});
