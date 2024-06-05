import dynamodb from "@sst/core/dynamodb";
import handler from "@sst/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  // Get all books for the current user
  const res = await dynamodb.query({
    TableName: Table.mybooks.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId":
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
    },
  });

  return JSON.stringify(res.Items);
});
