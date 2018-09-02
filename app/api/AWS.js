import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as enhancements from 'react-native-aws-cognito-js';
import awsmobile from './aws-exports';

var AWS_REGION = awsmobile.aws_cognito_region;
var AWS_POOL_ID = awsmobile.aws_user_pools_id;
var AWS_POOL_CLIENT_ID = awsmobile.aws_user_pools_web_client_id;
var AWS_IDENTITY_POOL_ID = awsmobile.aws_cognito_identity_pool_id;

Object.keys(enhancements).forEach(key => (CognitoIdentityServiceProvider[key] = enhancements[key]));

AWS.config.update({ region: AWS_REGION });

const poolData = {
    UserPoolId: AWS_POOL_ID,
    ClientId: AWS_POOL_CLIENT_ID
};

export const awsSettings = {
    IdentityPoolId: AWS_IDENTITY_POOL_ID,
    Region: AWS.config.region,
    UserPoolId: poolData.UserPoolId,
    ClientId: poolData.ClientId
};

export const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

export default AWS;
