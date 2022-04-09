import * as cdk from '@aws-cdk/core';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Runtime, Code, Function, FunctionProps } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { join } from 'path';
import {
  DAILY_NEWSPAPER_TABLE,
  DailyNewspaperTableColumn,
} from '../../../../libs/shared-cloud/src';

const libsPath = '../../dist/libs';

function setupCollectors(
  scope: cdk.Construct,
  table: Table,
  rule: Rule,
  dir: string,
  props: Partial<FunctionProps> = {}
) {
  const name = dir.replace('/', '-');
  const collectorNews = new Function(scope, name, {
    ...props,
    runtime: Runtime.NODEJS_14_X,
    code: Code.fromAsset(join(libsPath, dir)),
    handler: `${name}.handler`,
    logRetention: RetentionDays.ONE_MONTH,
  });

  table.grantReadWriteData(collectorNews);
  rule.addTarget(new LambdaFunction(collectorNews));
}

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dailyRule = new Rule(this, 'daily-newspaper-cron', {
      schedule: Schedule.cron({ minute: '0', hour: '1' }),
    });

    const table = new Table(this, 'daily-newspaper-table', {
      tableName: DAILY_NEWSPAPER_TABLE,
      partitionKey: {
        name: DailyNewspaperTableColumn.DAY_CATEGORY_ID,
        type: AttributeType.STRING,
      },
      timeToLiveAttribute: DailyNewspaperTableColumn.EXPIRES,
    });

    setupCollectors(this, table, dailyRule, 'collector/news', {
      environment: {
        NEWS_API: process.env.NEWS_API,
      },
    });
    setupCollectors(this, table, dailyRule, 'collector/daily-word');

    const api = new HttpApi(this, 'daily-newspaper-api', {
      corsPreflight: {
        allowOrigins: [
          'http://localhost:4200',
          'https://sakkaku-web.github.io',
        ],
      },
    });

    const getCollectorData = new Function(this, 'get-collector-data', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(libsPath, 'api/get-collector-data')),
      handler: 'api-get-collector-data.handler',
      logRetention: RetentionDays.ONE_MONTH,
    });
    table.grantReadData(getCollectorData);
    api.addRoutes({
      path: '/daily-newspaper/{collector}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'get-collector-data',
        getCollectorData
      ),
    });
  }
}
