import * as cdk from '@aws-cdk/core';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Runtime, Code, Function } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { HttpApi, HttpMethod, CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { join } from 'path';
import {
  DAILY_NEWSPAPER_TABLE,
  DailyNewspaperTableColumn,
} from '../../../../libs/shared-cloud/src';

const libsPath = '../../dist/libs';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dailyRule = new Rule(this, 'daily-newspaper-cron', {
      schedule: Schedule.cron({ minute: '0', hour: '0' }),
    });

    const table = new Table(this, 'daily-newspaper-table', {
      tableName: DAILY_NEWSPAPER_TABLE,
      partitionKey: {
        name: DailyNewspaperTableColumn.DAY_CATEGORY_ID,
        type: AttributeType.STRING,
      },
      timeToLiveAttribute: DailyNewspaperTableColumn.EXPIRES,
    });

    const collectorNews = new Function(this, 'collector-news', {
      runtime: Runtime.NODEJS_14_X,
      environment: {
        NEWS_API: process.env.NEWS_API,
      },
      code: Code.fromAsset(join(libsPath, 'collector/news')),
      handler: 'collector-news.handler',
      logRetention: RetentionDays.ONE_MONTH,
    });
    table.grantReadWriteData(collectorNews);
    dailyRule.addTarget(new LambdaFunction(collectorNews));

    const api = new HttpApi(this, 'daily-newspaper-api', {
      corsPreflight: {
        allowOrigins: [
          'http://localhost:4200',
          'https://sakkaku-web.github.io',
        ],
      },
    });
  }
}
