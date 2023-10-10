"use client";
import { useResources } from "@/context/resources";
import CommerceSdk from "@gdcorp-commerce/commerce-sdk";
import { useState } from "react";

const authidp = "";

export default function Actions() {
  const {
    store_id: storeId,
    client_id: clientId,
    client_secret: clientSecret,
    env,
    scope,
  } = useResources();
  const [newOrder, setNewOrder] = useState<string>("");

  const sdk = new CommerceSdk({
    clientId,
    clientSecret,
    env,
    scope,
  });

  const orders = async () => {
    // console.log(newOrder);
    // const { access_token } = await sdk.validation.authentication();

    const getOrders = await sdk.orders.request({
      context: {
        storeId,
        godaddyJwt: authidp,
      },
      body: "query OrdersQuery { sale:1 }",
      requestId: "",
    });
    console.log(getOrders);
  };

  return (
    <div className="p-10">
      <h1 className="text-white mb-10">Actions</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-38 border border-white p-4 rounded">
          <h2 className="text-white mb-2">Create Order</h2>
          <input
            className="border mb-2 p-1 w-full text-black"
            placeholder="Create an order"
            onChange={(e) => setNewOrder(e.target.value)}
            value={newOrder}
          />
          <button
            onClick={() => orders()}
            className="bg-transparent border border-white text-white px-12 py-3 rounded hover:bg-white hover:border-black hover:text-black cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
