import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Uploads");

  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      notesId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "notesId" },
  });

  return { table, bucket };
}
