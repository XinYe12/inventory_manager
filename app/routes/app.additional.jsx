// Import necessary dependencies from Remix and React
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import prisma from "../db.server";

// Loader to fetch purchase options
export const loader = async () => {
  const purchaseOptions = await prisma.purchaseOption.findMany();
  return json(purchaseOptions);
};

// Action to handle deletion
export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  // Delete operation
  if (id) {
    await prisma.purchaseOption.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  return null; // Redirect to refresh the list
};

// React component
export default function Index() {
  const submit = useSubmit();
  const purchaseOptions = useLoaderData();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    submit(formData, { method: "post" });
  };

  return (
    <Page title="Purchase Options">
      <Layout>
        <Layout.Section>
          {purchaseOptions.map((option) => (
            <Card key={option.id} sectioned>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{option.name}</p>
                <Button destructive onClick={() => handleDelete(option.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
