import dynamodb from "@sst/core/dynamodb";
import handler from "@sst/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  await dynamodb.delete({
    TableName: Table.Notes.tableName,
    Key: {
      userId: "123",
      notesId: event?.pathParameters?.id,
    },
  });

  return JSON.stringify({ status: true });
});
