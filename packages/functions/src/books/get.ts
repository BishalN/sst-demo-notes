import handler from "@sst/core/handler";
import dynamoDb from "@sst/core/dynamodb";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  // TODO: check if the user is authorized to get this book
  // I think without userId we can't get the book so we can skip this for now
  if (event?.pathParameters?.id == null) {
    throw new Error("Missing notes id");
  }
  const params = {
    TableName: Table.mybooks.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      bookId: event?.pathParameters?.id,
    },
  };

  const res = await dynamoDb.get(params);

  if (!res.Item) {
    throw new Error("Item not found.");
  }

  return JSON.stringify(res.Item);
});
