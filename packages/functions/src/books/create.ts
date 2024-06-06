import * as uuid from "uuid";
import { Table } from "sst/node/table";

import handler from "@sst/core/handler";
import dynamoDb from "@sst/core/dynamodb";

export const main = handler(async (event) => {
  if (event.body == null) {
    throw new Error("Missing request body");
  }
  // userId can be extracted from event object so no need to pass it in the request body
  // TODO: comeup with some simple zod schema to parse the request body
  let data = JSON.parse(event.body);
  // append userId to the book object
  data.userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId;
  data.bookId = uuid.v1();
  const params = {
    TableName: Table.mybooks.tableName,
    Item: data,
  };
  await dynamoDb.put(params);
  return JSON.stringify(params.Item);
});
