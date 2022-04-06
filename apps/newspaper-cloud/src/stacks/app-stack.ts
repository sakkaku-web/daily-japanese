import * as cdk from '@aws-cdk/core';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Runtime, Code, Function } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { join } from 'path';

const libsPath = '../../dist/libs';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dailyRule = new Rule(this, 'daily-newspaper-cron', {
      schedule: Schedule.cron({ minute: '0', hour: '0' }),
    });

    const table = new Table(this, 'daily-newspaper-table', {
      tableName: 'DailyNewspaper',
      partitionKey: {
        name: 'dayCategory',
        type: AttributeType.STRING,
      },
      timeToLiveAttribute: 'expires',
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
  }
}
