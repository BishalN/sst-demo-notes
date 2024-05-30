import { Cognito, StackContext, use } from "sst/constructs";
import { APIStack } from "./ApiStack";
import { StorageStack } from "./StorageStack";

import * as iam from "aws-cdk-lib/aws-iam";

export function AuthStack({ app, stack }: StackContext) {
  const { api } = use(APIStack);
  const { bucket } = use(StorageStack);

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });
  // Return the auth resource
  return {
    auth,
  };
}
