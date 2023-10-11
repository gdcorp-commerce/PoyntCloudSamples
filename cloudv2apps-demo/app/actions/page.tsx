"use client";
import { useResources } from "@/context/resources";
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
  const [orderName, setNewOrderName] = useState<string>("");
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderPrice, setOrderPrice] = useState<number>(0);

  const orders = async () => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          clientSecret,
          env,
          scope,
          storeId,
          authidp,
          orderName,
          orderPrice,
          orderQuantity,
          orderDiscount,
        }),
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-white mb-10">Actions</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-38 border border-white p-4 rounded max-w-xs">
          <div>
            <h3 className="text-white mb-2">Order Name</h3>
            <input
              className="border mb-2 p-1 w-full text-black"
              placeholder="Create an order"
              onChange={(e) => setNewOrderName(e.target.value)}
              value={orderName}
            />
          </div>

          <div>
            <h3 className="text-white mb-2">Price</h3>
            <input
              className="border mb-2 p-1 w-full text-black"
              type="number"
              value={orderPrice}
              onChange={(e) => setOrderPrice(parseInt(e.target.value))}
            />
          </div>

          <div>
            <h3 className="text-white mb-2">Quantity</h3>
            <input
              className="border mb-2 p-1 w-full text-black"
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
            />
          </div>

          <div>
            <h3 className="text-white mb-2">Discount</h3>
            <input
              className="border mb-2 p-1 w-full text-black"
              type="number"
              value={orderDiscount}
              onChange={(e) => setOrderDiscount(parseInt(e.target.value))}
            />
          </div>

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
