import CommerceSdk, { SdkAuthType } from "@gdcorp-commerce/commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

const input = {
  input: {
    context: {
      storeId: "4c5e697f-400a-412c-b6b7-dedcc17602ff",
      channelId: "",
    },
    lineItems: {
      fulfillmentMode: "DIGITAL",
      name: "",
      quantity: 0,
      status: "IN_PROGRESS",
      totals: {
        discountTotal: {
          currencyCode: "usd",
          value: 0,
        },
        feeTotal: {
          currencyCode: "usd",
          value: 0,
        },
        subTotal: {
          currencyCode: "usd",
          value: 0,
        },
        taxTotal: {
          currencyCode: "usd",
          value: 0,
        },
      },
      unitAmount: {
        currencyCode: "usd",
        value: 0,
      },
    },
    processedAt: new Date().toISOString(),
    statuses: {
      fulfillmentStatus: "IN_PROGRESS",
      paymentStatus: "PENDING",
      status: "OPEN",
    },
    totals: {
      discountTotal: {
        currencyCode: "usd",
        value: 0,
      },
      feeTotal: {
        currencyCode: "usd",
        value: 0,
      },
      shippingTotal: {
        currencyCode: "usd",
        value: 0,
      },
      subTotal: { currencyCode: "usd", value: 0 },
      taxTotal: { currencyCode: "usd", value: 0 },
      total: { currencyCode: "usd", value: 0 },
    },
  },
};

export async function POST(request: NextRequest) {
  const {
    clientId,
    clientSecret,
    env,
    storeId,
    orderName,
    orderPrice,
    orderQuantity,
    orderDiscount,
  } = await request.json();
  try {
    const sdk = new CommerceSdk({
      clientId,
      clientSecret,
      env,
      scope: "commerce.order:create",
      authType: "service" as SdkAuthType.service,
    });

    input.input.context.storeId = storeId;
    input.input.lineItems.name = orderName;
    input.input.lineItems.quantity = orderQuantity;
    input.input.lineItems.unitAmount.value = orderPrice;
    input.input.lineItems.totals.discountTotal.value = orderDiscount;
    input.input.lineItems.totals.feeTotal.value = orderPrice;
    input.input.lineItems.totals.subTotal.value = orderPrice - orderDiscount;
    input.input.totals.discountTotal.value = orderDiscount;
    input.input.totals.feeTotal.value = orderPrice;
    input.input.totals.subTotal.value = orderPrice - orderDiscount;
    input.input.totals.taxTotal.value = orderPrice * 0.1;
    input.input.totals.total.value =
      (orderPrice - orderDiscount + orderPrice * 0.1) * orderQuantity;

    const mutation = `
      mutation AddOrder($input: OrderInput!) {
        addOrder(input: $input) {
          totals {
            total {
              currencyCode
              value
            }
          }
        }
      }`;

    const variables = {
      input: input.input,
    };

    const requestBody = JSON.stringify({
      query: mutation,
      variables: variables,
    });

    const {
      response: { data },
    } = await sdk.orders.request({
      context: {
        storeId,
      },
      body: requestBody,
      requestId: "abc456alantest7893",
    });

    return NextResponse.json({
      message: "This Worked",
      success: true,
      data,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      message: "This Failed: " + error,
      success: false,
    });
  }
}
