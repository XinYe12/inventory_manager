//app.create_purchase_option.jsx


import { useState } from "react";
import { json, redirect } from "@remix-run/node"; // Only one import of 'json'
import { useActionData, useSubmit } from "@remix-run/react";
import { Page, Layout, TextField, Card, Button } from "@shopify/polaris";
import prisma from "../db.server";
import PurchaseOptionNameInput from "../purchaseOptions/purchaseOptionName";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  // Validate input
  if (typeof name !== "string" || name.length === 0) {
    return json({ error: "Invalid input" }, { status: 400 });
  }

  // Save to database
  const purchaseOption = await prisma.purchaseOption.create({
    data: {
      name,
    },
  });

  // Redirect or return success response
  return json({ success: true, purchaseOption });
};

export default function Index() {
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
