import { App, getStack } from "sst/constructs";
import { initProject } from "sst/project";
import { it } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import { StorageStack } from "../StorageStack";

it("Tests StorageStack", async () => {
  await initProject({});

  const app = new App({ mode: "deploy" });

  app.stack(StorageStack);

  const template = Template.fromStack(getStack(StorageStack));

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
  });
});
