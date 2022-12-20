const axios = require("axios");
const { getAppAccessToken } = require("./token");

/**
 * Change organization and app id
 */
const SUBSCRIPTION_API =
  "https://billing-ote.poynt.net/organizations/dad1cb1e-b5e8-4185-8eb8-f645c5ebb58e/apps/urn:aid:9c555958-73b6-48e1-819e-f94f1f354264/subscriptions";

const PLAN_API =
  "https://billing-ote.poynt.net/organizations/dad1cb1e-b5e8-4185-8eb8-f645c5ebb58e/apps/urn:aid:9c555958-73b6-48e1-819e-f94f1f354264/plans";

const createSubscription = async (token, businessId, planId, isDeviceScope) => {
  try {
    const { data } = await axios.post(
      SUBSCRIPTION_API,
      {
        businessId: businessId,
        planId: planId,
        deviceId: isDeviceScope
          ? "urn:tid:5962ba4e-55e9-36b4-8fe2-ab1d19fc6dcc"
          : null,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Subscription created: ", data);
    return data;
  } catch (error) {
    console.log("Could not generate subscription: ", error?.response?.data);
    return error?.response?.data;
  }
};
// downgrade, upgrade or switch subscription
const replaceSubscription = async (
  token,
  businessId,
  planId,
  isDeviceScope
) => {
  try {
    const { data } = await axios.post(
      SUBSCRIPTION_API,
      {
        businessId: businessId,
        planId: planId,
        replaceV2: true, // replace means that the current subscription will be replaced (upgrade, downgrade, switch) by the new one
        deviceId: isDeviceScope
          ? "urn:tid:5962ba4e-55e9-36b4-8fe2-ab1d19fc6dcc" // change deviceId
          : null,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Subscription created: ", data);
    return data;
  } catch (error) {
    console.log("Could not replace subscription: ", error?.response?.data);
    return error?.response?.data;
  }
};

const getSubscriptions = async (token, businessId) => {
  console.log("Merchant access token: ", token);
  try {
    const { data } = await axios.get(
      SUBSCRIPTION_API + `?businessId=${businessId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return data.list;
  } catch (error) {
    console.log("Could not list subscription: ", error?.response?.data);
    return error?.response?.data;
  }
};

const getPlans = async () => {
  const appToken = await getAppAccessToken();
  console.log("App token: ", appToken);
  try {
    const { data } = await axios.get(PLAN_API, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });

    return data.list;
  } catch (error) {
    console.log("Could not fetch plans: ", error?.response?.data);
  }
};

module.exports = {
  createSubscription,
  getPlans,
  getSubscriptions,
  replaceSubscription,
};
