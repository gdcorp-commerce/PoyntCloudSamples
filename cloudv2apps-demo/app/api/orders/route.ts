import CommerceSdk from "@gdcorp-commerce/commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { clientId, clientSecret, env, scope, storeId, authidp } =
    await request.json();

  try {
    const sdk = new CommerceSdk({
      clientId,
      clientSecret,
      env,
      scope,
    });
    const getOrders = await sdk.orders.request({
      context: {
        storeId,
        godaddyJwt: authidp,
      },
      body: "query OrdersQuery { ... }",
      requestId: "1234",
    });
    console.log({ getOrders });
    return NextResponse.json({ message: "This Worked", success: true });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      message: "This Failed" + error,
      success: false,
    });
  }
}
