//app.create_purchase_option.jsx

import { useState } from "react";
import { json, redirect } from "@remix-run/node"; // Only one import of 'json'
import { useActionData, useSubmit } from "@remix-run/react";
import { Page, Layout, TextField, Card, Button } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

//customized components
import PurchaseOptionNameInput from "../purchaseOptions/purchaseOptionName";//text input field asking for purchase option name



export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
         mutation {
            sellingPlanGroupCreate(
                input: {
                    name: "Pre-order-testing"
                    merchantCode: "pre-order"
                    options: [
                        "Pre-order"
                    ]
                    sellingPlansToCreate: [
                    {
                        name: "Pre Order Product with 40% deposit"
                        category: PRE_ORDER
                        options: [
                            "40% deposit."
                        ]
                        billingPolicy: {
                            fixed: {
                                checkoutCharge: {type: PERCENTAGE, value: {percentage: 50}}
                                remainingBalanceChargeTrigger: EXACT_TIME
                                remainingBalanceChargeExactTime: "2024-01-24"
                            }
                        }
                        pricingPolicies: [
                            {
                                fixed: {
                                    adjustmentType: PERCENTAGE
                                    adjustmentValue: { percentage: 15.0 }
                                }
                            }
                        ]
                        deliveryPolicy: {fixed: {fulfillmentTrigger: UNKNOWN}}
                        inventoryPolicy: {reserve: ON_FULFILLMENT}
                    }
                    ]
                }
                resources: {productVariantIds: [], productIds: ["gid://shopify/Product/8028949512441"]}
            ) {
                sellingPlanGroup {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
    }`,
    );
    const responseJson = await response.json();
    console.log(JSON.stringify(responseJson, null, 2));
    return null;
  };
  

export default function PurchaseOptionNew() {
  const submit = useSubmit();
  const actionData = useActionData();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    submit(formData, { method: "post" });
  };

  return (
    <Page title="Create Purchase Option">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <form onSubmit={handleSubmit}>
                <PurchaseOptionNameInput
                    value={inputValue}
                    onChange={setInputValue}
                />
                
                <Button submit primary>
                    Confirm Create
                </Button>
            </form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
