import * as uuid from "uuid";
import { Table } from "sst/node/table";

import handler from "@sst/core/handler";
import dynamoDb from "@sst/core/dynamodb";
import { BookSchema, IBook } from "@sst/core/bookCollectionTypes";

export const main = handler(async (event) => {
  if (event.body == null) {
    throw new Error("Missing request body");
  }
  const data = BookSchema.parse(JSON.parse(event.body));
  const params = {
    TableName: Table.mybooks.tableName,
    Item: data,
  };
  await dynamoDb.put(params);
  return JSON.stringify(params.Item);
});
