


import AWS, { userPool, awsSettings  } from './AWS';
import LocalStorage from '../LocalStorage';

var Promise = require('bluebird');

export class Auth {

   constructor() {

   }

   async init(username){
       if(!username){
           console.log('No username - do not init auth:'+username);
           return Promise.resolve(null);
       }
       //Init old user session from async storage if any exist
       return await this.syncUserPool().then(result => {
           return this.getSession();
       }).then(sessionTokens => {
           return this.setCredentials(sessionTokens.getIdToken().getJwtToken())
                .return(sessionTokens);
       });
   }

   getUserSessionFromTokens(sessionTokens) {
     return new AWS.CognitoIdentityServiceProvider.CognitoUserSession({
       IdToken: new AWS.CognitoIdentityServiceProvider.CognitoIdToken({ IdToken: sessionTokens.idToken.jwtToken }),
       RefreshToken: new AWS.CognitoIdentityServiceProvider.CognitoRefreshToken({ IdToken: sessionTokens.refreshToken.token }),
       AccessToken: new AWS.CognitoIdentityServiceProvider.CognitoAccessToken({ IdToken: sessionTokens.accessToken.jwtToken }),
     });
   }

   signupUser(username, password) {
      const attributeList = [
          new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({ Name: 'email', Value: username })
          //new CognitoUserAttribute({ Name: 'name', Value: user.name })
      ];
      return new Promise(function(resolve, reject) {
        userPool.signUp(
            username,
            password,
            attributeList,
            null,
            (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log('result ' + JSON.stringify(result));
                resolve(result);
            }
        );
      });

   }

   getCognitoUser(username){
       let userData = {
          Username: username,
          Pool: userPool
       };

       return new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
   }

   confirmUser(username, code) {
      let cognitoUser = this.getCognitoUser(username);

      return new Promise(function(resolve, reject) {
        cognitoUser.confirmRegistration(code, true, (err, result) => {
           if (err) {
              console.log(err);
              reject(err);
              return;
           }
           resolve(result);
        });
      });

   }

   loginUser(username, password) {
      ////
      const authDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails({
          Username: username,
          Password: password
      });
      const cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser({
          Username: username,
          Pool: userPool
      });
      let that = this;
      return new Promise(function(resolve, reject) {
          cognitoUser.authenticateUser(authDetails, {
              onSuccess: (result) => {

                  let loginData = {};
                  // Change the key below according to the specific region your user pool is in.
                  that.setCredentials(result.getIdToken().getJwtToken());
                  resolve(result);
              },
              onFailure: (err) => {
                    if (err.code == 'UserNotConfirmedException'){
                        // Not confirmed
                    } else if (err.code == 'PasswordResetRequiredException'){
                        // Reset Password Required
                    } else if (err.code == 'NotAuthorizedException'){
                        // Not Authorised (Incorrect Password)
                    } else if (err.code == 'ResourceNotFoundException'){
                        // User Not found
                    } else {
                        // Unknown
                    }
                  console.log(err);
                  reject(err);
              }
          });
       });
   }

   syncUserPool(){
       return new Promise((resolve, reject) => {
            userPool.storage.sync((error, result) => {
              if (error) reject(error);
              if (result) resolve(result);
            });
       });
   }

   saveUserData(username){
       var syncClient = new AWS.CognitoSyncManager();
       return new Promise((resolve, reject) => {
           syncClient.openOrCreateDataset('userData', function(err, dataset) {
               dataset.put('username', username, function(err, record){
                   if(err){
                       reject(err);
                       return;
                   }
                   dataset.synchronize({
                       onSuccess: function(data, newRecords) {
                           // Your handler code here
                           resolve(data);
                       },
                       onFailure: function(err) {
                           reject(data);
                       },
                   });
               });
           });
       });
   }

   setCredentials(jwtToken){
       console.log('setCredentials access token = '+jwtToken);

       let loginData = {};
       // Change the key below according to the specific region your user pool is in.
       loginData['cognito-idp.'+AWS.config.region+'.amazonaws.com/'+awsSettings.UserPoolId] = jwtToken;

       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           IdentityPoolId : awsSettings.IdentityPoolId, // your identity pool id here
           Logins : loginData
       });
       return this.getCredentials().then(function(){
           // Credentials will be available when this function is called.
            const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
            const awsCredentials = {
              accessKeyId,
              secretAccessKey,
              sessionToken,
            };
             //TODO: encrypt credentials
            LocalStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
       });
   }

   setFacebookCredentials(jwtToken){
       let loginData = {};
       // Change the key below according to the specific region your user pool is in.
       loginData['graph.facebook.com'] = jwtToken;

       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           IdentityPoolId : awsSettings.IdentityPoolId, // your identity pool id here
           Logins : loginData
       });
       return this.getCredentials().then(function(){
           // Credentials will be available when this function is called.
            const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
            const awsCredentials = {
              accessKeyId,
              secretAccessKey,
              sessionToken,
            };
             //TODO: encrypt credentials
            LocalStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
       });

   }

   /*
    The email address is not verified, so your app needs to call GetUser
    to see if an email address is awaiting verification. If it is, the app
    should call GetUserAttributeVerificationCode to initiate the email
    verification flow and then submit the verification code by calling
    VerifyUserAttribute.
   */

   resendConfirmationCode(username){
       return new Promise((resolve, reject) => {
           let cognitoUser = this.getCognitoUser(username);
           if (cognitoUser != null) {
               cognitoUser.resendConfirmationCode(function(err, result) {
                   if (err) {
                       reject(err);
                       return;
                   }
                   resolve(result);
               });
           } else {
               //this.logoutUser();
               let error = new Error( "No current user defined, please login");
               error.code = "NoCurrentUser"
               reject(error);
           }
       });
   }

   refreshCredentials() {
       return new Promise((resolve, reject) => {
         AWS.config.credentials.refresh(error => {
           if (error) reject(error);
           resolve('SUCCESS');
         });
       });
   }

   getCredentials() {
       return new Promise(function(resolve, reject) {
           AWS.config.credentials.get(function(err){
                if (err) {
                    reject(err);
                }
                resolve("SUCCESS");
            });

        });
   }

   forgotPassword(username) {
       let cognitoUser = this.getCognitoUser(username);

       return new Promise(function(resolve, reject) {
            if (cognitoUser != null) {
               cognitoUser.forgotPassword({
                    onSuccess: function (result) {
                        resolve(result);
                    },
                    onFailure: function(err) {
                        reject(err);
                    },
                    inputVerificationCode: null/*() {
                        var verificationCode = ""; //prompt('Please input verification code ' ,'');
                        var newPassword = "" //prompt('Enter new password ' ,'');
                        cognitoUser.confirmPassword(verificationCode, newPassword, this);
                    }*/
                });
            }
            else {
              let error = new Error( "No current user defined, please login");
              error.code = "NoCurrentUser"
              reject(error);
            }
        });
   }

   confirmNewPassword(username, newPassword, verificationCode) {
       let cognitoUser = this.getCognitoUser(username);

       return new Promise(function(resolve, reject) {
            if (cognitoUser != null) {
                cognitoUser.confirmPassword(verificationCode, newPassword, {
                    onFailure(err) {
                        reject(err);
                    },
                    onSuccess() {
                        resolve();
                    },
                });
            }
            else {
              let error = new Error( "No current user defined, please login");
              error.code = "NoCurrentUser"
              reject(error);
            }
        });
   }

   getSession(username) {
      let cognitoUser = null;
      if(username === undefined){
          cognitoUser = userPool.getCurrentUser();
      } else {
          cognitoUser = this.getCognitoUser(username);
      }

      return new Promise(function(resolve, reject) {
        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
               if (err) {
                  reject(err);
                  return;
               }
               resolve(session);
            });
        }
        else {
            let error = new Error( "No current user defined, please login");
            error.code = "NoCurrentUser"
            reject(error);
        }
    });
   }

   logoutUser() {
      AWS.config.credentials.clearCachedId();
      let cognitoUser = userPool.getCurrentUser();
      if (cognitoUser != null) cognitoUser.signOut();

      LocalStorage.removeItem('awsCredentials');
   }

   //Retrieve user attributes for an authenticated user.
   getUserAttributes(username) {
      return new Promise((resolve, reject) => {
          let cognitoUser = null;
          if(username === undefined){
              cognitoUser = userPool.getCurrentUser();
          } else {
              cognitoUser = this.getCognitoUser(username);
          }
         cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log('getUserAttributes ' + JSON.stringify(result));
                resolve(result);
            }
         });
      });
   }

   getCurrentUserAttributeVerificationCode(attribute = 'email') {
       return new Promise((resolve, reject) => {
           let cognitoUser = userPool.getCurrentUser();
           cognitoUser.getAttributeVerificationCode(attribute, {
                onSuccess: function (result) {
                    console.log('call result: ' + result);
                    resolve(result);
                },
                onFailure: function(err) {
                    reject(err);
                },
                inputVerificationCode: null
            });
        });
    }

    verifyCurrentUserAttribute(attribute = 'email') {
        return new Promise((resolve, reject) => {
            let cognitoUser = userPool.getCurrentUser();
            cognitoUser.verifyAttribute('email', verificationCode, {
                 onSuccess: function (result) {
                     resolve(result);
                 },
                 onFailure: function(err) {
                     reject(err);
                 }
             });
         });
     }

}
