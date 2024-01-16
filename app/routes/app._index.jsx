// app/routes/index.jsx
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { Page, Layout, Button, Card, Text } from "@shopify/polaris";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

// Loader to fetch purchase options
export const loader = async () => {
  const purchaseOptions = await prisma.purchaseOption.findMany();
  return json(purchaseOptions);
};

// Action to handle GraphQL query and deletion
export const action = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const performQuery = formData.get("performQuery");

  // Perform the GraphQL query if requested
  if (performQuery) {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(`
    query GetSellingPlanGroupsByProduct($productGid: ID!) {
        product(id: $productGid) {
          id
          title
          sellingPlanGroups(first: 250) {
            edges {
              node {
                id
                name
                sellingPlans(first: 2) {
                  edges {
                    node {
                      id
                      name
                      options
                    }
                  }
                }
              }
            }
          }
        }
      }

    `);
    const responseJson = await response.json();
    console.log("GraphQL Query Response:", JSON.stringify(responseJson, null, 2));
    // Optionally, handle the response here
  }

  // Handle deletion if an ID is provided
  if (id) {
    await prisma.purchaseOption.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  return null; // Redirect to refresh the list or handle differently
};

// React component
export default function Index() {
  const fetcher = useFetcher();
  const purchaseOptions = useLoaderData();

  const handlePrimaryAction = () => {
    const formData = new FormData();
    formData.append("performQuery", "true"); // Indicate that the query should be executed
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Purchase Options"
      primaryAction={{
        content: 'Fetch Shop Info',
        onAction: handlePrimaryAction,
      }}
    >
      <Layout>
        <Layout.Section>
          {purchaseOptions.map((option, index) => (
            <Card key={index} sectioned>
              <Text>{option.name}</Text>
              {/* Other details from purchaseOptions can be displayed here */}
            </Card>
          ))}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
