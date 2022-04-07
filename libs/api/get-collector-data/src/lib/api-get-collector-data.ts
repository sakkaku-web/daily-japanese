import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  DAILY_NEWSPAPER_TABLE,
  DailyNewspaperTableColumn,
  toDayCategoryId,
} from '@sakkaku-web/shared-cloud';
import { parseISO } from 'date-fns';

const dynamodb = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayEvent,
  context: any
): Promise<APIGatewayProxyResultV2> => {
  const collector = event.pathParameters.collector;
  const dateQuery = event.queryStringParameters?.date;

  const date = dateQuery ? parseISO(dateQuery) : new Date();

  try {
    const { Item } = await dynamodb.send(
      new GetItemCommand({
        TableName: DAILY_NEWSPAPER_TABLE,
        Key: {
          [DailyNewspaperTableColumn.DAY_CATEGORY_ID]: {
            S: toDayCategoryId(date, collector),
          },
        },
      })
    );

    if (!Item) {
      return { statusCode: 404 };
    }

    const data = Item[DailyNewspaperTableColumn.DATA].S;
    return { statusCode: 200, body: data };
  } catch (err) {
    console.log(err);
    return err;
  }
};
