import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      notesId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "notesId" },
  });

  // now lets create another table for books
  const bookTable = new Table(stack, "mybooks", {
    fields: {
      userId: "string",
      bookId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "bookId" },
  });

  return { table, bucket, bookTable };
}
