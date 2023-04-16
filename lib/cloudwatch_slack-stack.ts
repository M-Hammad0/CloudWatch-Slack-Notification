import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';


export class CloudwatchSlackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackWebhookUrl = '';

    const myLambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      functionName: 'SlackNotification',
      code: lambda.Code.fromAsset('src'),
      handler: 'SlackNotification.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        SLACK_WEBHOOK_URL: slackWebhookUrl
      }
    });


    const logGroup = logs.LogGroup.fromLogGroupName(this, 'LogGroup', '/aws/lambda/generateError');
    const filterPattern = logs.FilterPattern.allTerms('ERROR');
    logGroup.addSubscriptionFilter('MyLambdaSubscriptionFilter', {
      destination: new destinations.LambdaDestination(myLambdaFunction),
      filterPattern: filterPattern,
    });
  }
}
