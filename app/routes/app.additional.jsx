// Import necessary modules and components
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData } from '@remix-run/react';
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
} from "@shopify/polaris";
import prisma from '~/db.server'; // Adjust this import path to your project's structure


// Loader function to fetch data from the database
export const loader = async () => {
  try {
    const purchaseOptions = await prisma.purchaseOption.findMany();
    return json({ purchaseOptions });
  } catch (error) {
    console.error("Error loading purchase options:", error);
    return json({ error: "Error loading data" }, { status: 500 });
  }
};

// Action function to handle deletion
export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const deleteId = formData.get("deleteId");

  if (deleteId) {

      await prisma.purchaseOption.delete({
              where: {
                id: parseInt(deleteId),
              },
            });
    console.log(`Item with ID ${deleteId} deleted`);
  }

  return redirect("/additional-page"); // Redirect to the same page or another appropriate location
};



// The main React component for the page
export default function AdditionalPage() {
  const { purchaseOptions } = useLoaderData();
  const actionData = useActionData();

  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Purchase Options
              </Text>
              {purchaseOptions.map((option) => (
                <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <Text as="p" variant="bodyMd">
                    {option.name}
                  </Text>
                  <form method="post" style={{ marginLeft: 'auto' }}>
                    <input type="hidden" name="deleteId" value={option.id} />
                    <Button submit>delete</Button>
                  </form>
                </div>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>
        {/* ... other sections ... */}
      </Layout>
    </Page>
  );
}

// Code component for displaying inline code snippets
function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
