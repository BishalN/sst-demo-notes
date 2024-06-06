import dynamodb from "@sst/core/dynamodb";
import handler from "@sst/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  if (event?.pathParameters?.id == null) {
    throw new Error("Missing book id");
  }
  await dynamodb.delete({
    TableName: Table.mybooks.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      bookId: event?.pathParameters?.id,
    },
  });

  return JSON.stringify({ status: true });
});
