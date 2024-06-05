import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Amplify } from "aws-amplify";
import config from "./lib/config";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./auth";
import React from "react";
import { useAuth } from "./hooks/useAuth";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

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

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
