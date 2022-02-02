const db = require("./db");
const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getUser = async (event) => {
  const response = { status: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ email: event.pathParamters.email })
    };
    const { Item } = await db.send(new GetItemCommand(params));
    console.log(Item);
    response.body = JSON.stringify({
      message: "Successfully retrieved user",
      data: Item ? unmarshall(Item) : {},
      rawData: Item
    });
  } catch (error) {
    console.log(error);
    response.statusCode - 500;
    response.body = JSON.stringify({
      message: "Failed to get user",
      errorMsg: error.message,
      errorStack: error.stack
    });
    return response;
  }
};

const createUser = async (event) => {
  const response = { status: 200 };

  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {})
    };
    const createResult = await db.send(new GetItemCommand(params));
    response.body = JSON.stringify({
        message: "Successfully create a user",
        createResult
      });
  } catch (error) {
    response.statusCode - 500;
    response.body = JSON.stringify({
      message: "Failed to get user",
      errorMsg: error.message,
      errorStack: error.stack
    });
    return response;
  }
};
