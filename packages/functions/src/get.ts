import handler from "@sst/core/handler";
import dynamoDb from "@sst/core/dynamodb";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Notes.tableName,
    Key: {
      userId: "123",
      notesId: event?.pathParameters?.id,
    },
  };

  const res = await dynamoDb.get(params);

  if (!res.Item) {
    throw new Error("Item not found.");
  }

  return JSON.stringify(res.Item);
});
