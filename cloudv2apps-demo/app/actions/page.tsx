"use client";
import { useResources } from "@/context/resources";
import { useState } from "react";

const authidp =
  "eyJhbGciOiAiUlMyNTYiLCAia2lkIjogIkF0Qzlrc3dMc0EifQ.eyJhdXRoIjogImJhc2ljIiwgImZ0YyI6IDEsICJpYXQiOiAxNjk2OTU1NDE3LCAianRpIjogIkFnZnFxemw4ZEhEb3ZSb2tuUXdkVFEiLCAidHlwIjogImlkcCIsICJ2YXQiOiAxNjk2OTU1NDE3LCAiZmFjdG9ycyI6IHsia19wdyI6IDE2OTY5NTU0MTd9LCAicGVyIjogdHJ1ZSwgImhiaSI6IDE2OTY5NTU0MTcsICJmcGlkIjogIjQwNDVkYjllLTFmMjktMTFlZC1iYWQ1LWZhMTYzZTY5YWJmYyIsICJzaG9wcGVySWQiOiAiNTIzOTU5MCIsICJjaWQiOiAiZTYwZjRjN2ItOWEyOC00YjViLTg3ZTQtMzhiOTE1MGYwMTA1IiwgInBsaWQiOiAiMSIsICJwbHQiOiAxLCAic2hhcmQiOiAiMDAwMCIsICJpZGVudGl0eSI6ICI4ZTVkN2ZiZS1jNzQyLTExZWQtOWNjNC00ZTBhYmIyMGRhY2UifQ.Xz0KEFo7m3cMNQ_bSuvK22viJko2Pvf2m5D-sMYzN14IIiQClnRPrZJuofjONDCzwGvt1zfH__pqw-SJdSsCA50fYqHxU2lgJWaO4qjFaZdGvWBvkrkfroR_-HKsuIvo_i8NSXhOxMo8ia7gJhKhRuF0G1GlqpCqrk43VvR29jvdRTTpY-zHOFlSGNSmD09IuY26QTcfXolDWBbmQDgFvGBIUGjIDEL9YZtDxfR_NOhNEGkO-KjlsqO7nZFHX3XD0D9gKSGvtPW9K3_oY9r-D-wb7zZHUixtr39bw-MGwWQRVQ1l-9vJzZ_FpsUsxOTD0foM2YjqPk0AFIAIGd42VA";

export default function Actions() {
  const {
    store_id: storeId,
    client_id: clientId,
    client_secret: clientSecret,
    env,
    scope,
  } = useResources();
  const [newOrder, setNewOrder] = useState<string>("");

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
