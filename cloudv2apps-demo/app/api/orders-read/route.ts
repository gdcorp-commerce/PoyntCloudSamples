import CommerceSdk, { SdkAuthType } from "@commerce/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("client_id") as string;
  const clientSecret = request.nextUrl.searchParams.get(
    "client_secret"
  ) as string;
  const env = request.nextUrl.searchParams.get("env") as string;
  const storeId = request.nextUrl.searchParams.get("store_id") as string;

  try {
    const sdk = new CommerceSdk({
      clientId,
      clientSecret,
      env,
      scope: "commerce.order:read",
      authType: "service" as SdkAuthType.service,
    });

    const input = {
      first: 30,
    };

    const query = `
    query Orders($first: Int) {
      orders(first: $first) {
        edges {
          node {
            id
            statuses {
              fulfillmentStatus
              paymentStatus
              status
            }
            totals {
              discountTotal {
                currencyCode
                value
              }
              feeTotal {
                currencyCode
                value
              }
              shippingTotal {
                currencyCode
                value
              }
              subTotal {
                currencyCode
                value
              }
              taxTotal {
                currencyCode
                value
              }
              total {
                value
                currencyCode
              }
            }
          }
        }
      }
    }
`;
    const reqQuery = JSON.stringify({
      query,
      variables: input,
    });

    const {
      response: {
        data: {
          orders: { edges },
        },
      },
    } = await sdk.orders.request({
      context: {
        storeId,
      },
      body: reqQuery,
      requestId: "uuid:1234",
    });

    const payload = edges.map((item: any) => ({
      id: item.node.id,
      fulfillmentStatus: item.node.statuses.fulfillmentStatus,
      paymentStatus: item.node.statuses.paymentStatus,
      status: item.node.statuses.status,
      discountTotal: item.node.totals.discountTotal.value,
      feeTotal: item.node.totals.feeTotal.value,
      shippingTotal: item.node.totals.shippingTotal.value,
      subTotal: item.node.totals.subTotal.value,
      taxTotal: item.node.totals.taxTotal.value,
      total: item.node.totals.total.value,
      currencyCode: item.node.totals.total.currencyCode,
    }));

    return NextResponse.json({
      message: "This Worked",
      success: true,
      data: payload,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      message: "This Failed: " + error,
      success: false,
    });
  }
}
