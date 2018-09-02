import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

var { AsyncStorage } = require('react-native');

var Promise = require('bluebird');

export class FacebookSDK {

   constructor() {

   }
   init(){
       return new Promise(function(resolve, reject) {
            AccessToken.getCurrentAccessToken().then((data) => {
                   try {
                     resolve(data.accessToken.toString());
                   } catch (error) {
                     // Error saving data
                     console.log('Login Ok but failed to save FB token: ' + error);
                     reject(error);
                   }
             }).catch((err) => {
                console.log('Login Ok but failed to fetch FB token: ' + err);
                reject(err);
             });
        });
   }
   logout(){
       LoginManager.logout();
   }
   login() {
       return new Promise(function(resolve, reject) {
            LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
                function (result) {
                 if (result.isCancelled) {
                   console.log('Login cancelled');
                   reject({code: 'facebooksdk_login_cancelled'});
                 } else {
                     console.log('Login success with permissions: ' + result.grantedPermissions.toString());
                     AccessToken.getCurrentAccessToken().then(
                         (data) => {
                           try {
                             resolve({
                                 permissions: result.grantedPermissions.toString(),
                                 token: data.accessToken.toString()
                             });
                           } catch (error) {
                             // Error saving data
                             console.log('Login Ok but failed to save FB token: ' + error);
                             reject(error);
                           }
                         }
                     ).catch((err) => {
                        console.log('Login Ok but failed to fetch FB token: ' + err);
                        reject(err);
                     });
                 }
                },
                function (error) {
                    console.log('Login fail with error: ' + error);
                    reject(error);
                }
            )
        });
   }

   getUserInfo(){
       return graphRequestPromise('GET', '/me', {
           fields: {
               string: 'email,name'
           }
       });
   }

   setToken(token){
       AccessToken.setCurrentAccessToken(token);
   }

   refreshToken(){
       return AccessToken.refreshCurrentAccessTokenAsync();
   }
}

function graphRequestPromise(httpMethod, api, params){
    return new Promise(function(resolve, reject) {
        const infoRequest = new GraphRequest(
            api,
            {
                httpMethod: httpMethod,
                version: 'v2.5',
                parameters: params
            },
            (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res);
                }
            }
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
    });
}
