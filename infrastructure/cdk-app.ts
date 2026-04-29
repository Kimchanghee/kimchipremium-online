#!/usr/bin/env node
/**
 * KimchiPremium은 다른 사이트들과 다르게 ECS Fargate WebSocket 서버 필요.
 * BaseStaticSiteStack 외에 ECS 스택 별도 정의.
 */
import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { BaseStaticSiteStack } from '../../../shared/infrastructure/BaseStack';

class WebSocketStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, clusterName: 'kimchipremium' });

    // Redis 캐시 (cache.t4g.micro = $0.0093/h)
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnets', {
      description: 'Redis subnet group',
      subnetIds: vpc.privateSubnets.map((s) => s.subnetId),
    });
    new elasticache.CfnCacheCluster(this, 'Redis', {
      cacheNodeType: 'cache.t4g.micro',
      engine: 'redis',
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      port: 6379,
    });

    // Fargate WebSocket 서버 (0.5 vCPU / 1GB)
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'WsService', {
      cluster,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('../websocket-server'),
        containerPort: 8080,
        environment: {
          NODE_ENV: 'production',
        },
      },
      publicLoadBalancer: true,
      healthCheckGracePeriod: Duration.seconds(60),
    });
  }
}

const app = new App();

new BaseStaticSiteStack(app, 'KimchiPremiumStaticStack', {
  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION || 'us-east-1' },
  domain: 'kimchipremium.online',
  buildOutputDir: '../.next/standalone',
  languages: ['ko', 'en', 'ja', 'zh', 'de', 'fr'],
  description: 'KimchiPremium — Korean kimchi premium dashboard',
});

new WebSocketStack(app, 'KimchiPremiumWsStack', {
  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION || 'us-east-1' },
  description: 'KimchiPremium — WebSocket server for real-time data push',
});

app.synth();
