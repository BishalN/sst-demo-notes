import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { Amplify } from "aws-amplify";
import config from "./lib/config";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: { email: true },
      passwordFormat: { minLength: 6 },
    },
  },
  Storage: {
    S3: {
      bucket: config.s3.BUCKET,
      region: config.s3.REGION,
      // identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
  },
  API: {
    REST: {
      notes: {
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
        service: "notes",
      },
    },
  },
});

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
