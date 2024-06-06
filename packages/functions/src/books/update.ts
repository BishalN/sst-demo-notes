import { UpdateBookSchema } from "@sst/core/bookCollectionTypes";
import dynamodb from "@sst/core/dynamodb";
import handler from "@sst/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {
  // check path parameters for book id
  if (event?.pathParameters?.id == null) {
    throw new Error("Missing book id");
  }

  const data = JSON.parse(event.body || "{}");

  console.log(data);

  // const data = UpdateBookSchema.parse(JSON.parse(event.body || "{}"));

  await dynamodb.update({
    TableName: Table.mybooks.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      bookId: event?.pathParameters?.id,
    },
    UpdateExpression: "SET  notes = :notes, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":notes": data.notes || null,
      ":updatedAt": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  });

  return JSON.stringify({ status: true });
});
