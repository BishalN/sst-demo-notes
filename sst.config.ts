import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { APIStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";

export default {
  config(_input) {
    return {
      name: "sst",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(APIStack).stack(AuthStack);
  },
} satisfies SSTConfig;
