import axios from "axios";

export const getAccessToken = async (code) => {
  const { data } = await axios.post("http://localhost:9090/token", {
    code: code,
  });
  return data.accessToken;
};

export const getPlans = async (code) => {
  const { data } = await axios.get("http://localhost:9090/plans");
  return data;
};

export const createSubscription = async (
  token,
  businessId,
  planId,
  replaceV2,
  isDeviceScope
) => {
  const { data } = await axios.post(
    "http://localhost:9090/subscriptions",
    {
      businessId,
      planId,
      replaceV2,
      isDeviceScope,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getSubscriptions = async (token, businessId) => {
  const { data } = await axios.get(
    `http://localhost:9090/subscriptions?businessId=${businessId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
