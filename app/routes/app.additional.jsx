// Import necessary modules and components
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import prisma  from '~/db.server'; // Adjust this import path to your project's structure

// Loader function to fetch data from the database
export const loader = async () => {
  try {
    const purchaseOptions = await prisma.purchaseOption.findMany();
    console.log("Loaded purchase options:", purchaseOptions);
    return json({ purchaseOptions });
  } catch (error) {
    console.error("Error loading purchase options:", error);
    return json({ error: "Error loading data" }, { status: 500 });
  }
};

// The main React component for the page
export default function AdditionalPage() {
  const { purchaseOptions } = useLoaderData();
  console.log("Purchase options in component:", purchaseOptions);


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
                <Text key={option.id} as="p" variant="bodyMd">
                  {option.name}
                </Text>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
             
            </BlockStack>
          </Card>
        </Layout.Section>
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
