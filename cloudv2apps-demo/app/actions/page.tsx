"use client";
import { useResources } from "@/context/resources";
import { useEffect, useState } from "react";

export default function Actions() {
  const {
    client_id: clientId,
    client_secret: clientSecret,
    env,
    stores,
  } = useResources();
  const [orderName, setNewOrderName] = useState<string>("");
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [storeIdToCreate, setStoreIdToCreate] = useState<string>(stores[0]);
  const [storeId, setStoreId] = useState<string>(stores[0]);
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const createOrder = async () => {
    try {
      await fetch("/api/orders-create", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          clientSecret,
          env,
          storeId: storeIdToCreate,
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

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/orders-read?client_id=${clientId}&client_secret=${clientSecret}&env=${env}&store_id=${storeId}`,
        {
          method: "GET",
        }
      );
      const { data } = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const onSelectStoreId = (e: any) => {
    setStoreId(e.target.value);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-white mb-10">Actions</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "100px",
        }}
      >
        <div
          style={{
            width: "30%",
          }}
          className="h-38 border border-white p-4 rounded"
        >
          <h1 className="underline mb-2">Create Order</h1>

          <div className="flex gap-3">
            <h3 className="text-white mb-2">Store ID</h3>

            <select
              className="bg-transparent text-white border-white border w-72 mb-2"
              value={storeIdToCreate}
              onChange={(e) => setStoreIdToCreate(e.target.value)}
            >
              {stores.map((store, index) => {
                return <option key={index}>{store}</option>;
              })}
            </select>
          </div>

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
            onClick={() => createOrder()}
            className="bg-transparent border border-white text-white px-12 py-3 rounded hover:bg-white hover:border-black hover:text-black cursor-pointer"
          >
            Submit
          </button>
        </div>
        <div
          style={{
            width: "100%",
          }}
          className="h-38 border border-white p-4 rounded flex flex-col"
        >
          <h1 className="underline mb-2">Read Order</h1>
          <div className="flex gap-3">
            <h3 className="text-white mb-2">Store ID</h3>

            <select
              className="bg-transparent text-white border-white border w-72 mb-2"
              value={storeId}
              onChange={(e) => onSelectStoreId(e)}
            >
              {stores.map((store, index) => {
                return <option key={index}>{store}</option>;
              })}
            </select>

            <button
              style={{ width: "50px", height: "22px" }}
              onClick={() => getOrders()}
              className="bg-transparent border border-white text-white rounded hover:bg-white hover:border-black hover:text-black cursor-pointer"
            >
              Read
            </button>
          </div>

          {!loading && orders.length === 0 ? (
            <h1 className="text-white mt-2">No orders</h1>
          ) : loading ? (
            <h1 className="text-white mt-2">Loading...</h1>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300">ID</th>
                    <th className="border border-gray-300">
                      Fulfillment Status
                    </th>
                    <th className="border border-gray-300">Payment Status</th>
                    <th className="border border-gray-300">Status</th>
                    <th className="border border-gray-300">Discount Total</th>
                    <th className="border border-gray-300">Fee Total</th>
                    <th className="border border-gray-300">Shipping Total</th>
                    <th className="border border-gray-300">Sub Total</th>
                    <th className="border border-gray-300">Tax Total</th>
                    <th className="border border-gray-300">Total</th>
                    <th className="border border-gray-300">Currency Code</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item: any, index: any) => (
                    <tr key={index}>
                      <td className="border border-gray-300">{item.id}</td>
                      <td className="border border-gray-300">
                        {item.fulfillmentStatus}
                      </td>
                      <td className="border border-gray-300">
                        {item.paymentStatus}
                      </td>
                      <td className="border border-gray-300">{item.status}</td>
                      <td className="border border-gray-300">
                        {item.discountTotal}
                      </td>
                      <td className="border border-gray-300">
                        {item.feeTotal}
                      </td>
                      <td className="border border-gray-300">
                        {item.shippingTotal}
                      </td>
                      <td className="border border-gray-300">
                        {item.subTotal}
                      </td>
                      <td className="border border-gray-300">
                        {item.taxTotal}
                      </td>
                      <td className="border border-gray-300">{item.total}</td>
                      <td className="border border-gray-300">
                        {item.currencyCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
