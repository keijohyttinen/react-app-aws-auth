//var AWSAuth = require('../../api/AWSAuth');

import {
  Auth
} from '../../api/AWSAuth'

import {
  FacebookSDK
} from '../../api/FacebookSDK'
import LocalStorage from '../../LocalStorage';

var awsAuth = new Auth();
var facebookSdk= new FacebookSDK();


export const initSession = () => async dispatch => {
    let type = LocalStorage.getItem('lastLoginType');
    if(type === undefined) {
        return;
    }
    let username = LocalStorage.getItem('username');
    if(type === 'facebook'){
        dispatch(requestFacebookLoginData());
        return facebookSdk.init().then(token => {
            //Set facebook credentials to AWS to indicate in AWS side that use has logged in
            return awsAuth.setFacebookCredentials(token)
                .then(() => {
                    return facebookSdk.getUserInfo();
                })
                .then((userInfo) => {
                    return {
                        token: token,
                        email: userInfo.email,
                        name: userInfo.name
                    };
                });
        }).then((result) => {
            dispatch(loginSucceed(result.email, result.name, result.token, 'facebook'));
        }).catch(err => {
            dispatch(loginFailed(err, 'facebook'));
            console.log("Could not initialize Facebook Auth session from memory: "+JSON.stringify(err));
        });
    }
    dispatch(requestLoginData(username, ''));
    return awsAuth.init(username).then(result => {
        if(result){
            dispatch(loginSucceed(username, '', result.getIdToken().getJwtToken(), 'aws'));
        } else {
            dispatch(loginFailed({code: "", message: "Could not authenticate"}, 'aws'));
            console.log("Could not initialize AWS Auth session from memory");
        }
    })
    .catch(err => {
        dispatch(loginFailed(err, 'aws'));
        console.log("Could not initialize AWS Auth session from memory: "+JSON.stringify(err));
    });
}

const requestLoginData = (username, password) => {
    return {
        type: 'LOGIN_REQUEST',
        username: username,
        password: password,
        loginRequestType: 'aws'
    };
};
const requestFacebookLoginData = () => {
    return {
        type: 'LOGIN_FACEBOOK_REQUEST',
        loginRequestType: 'facebook'
    };
};

const loginSucceed = (username, name, jwtToken, type) => {
    return {
        type: 'LOGIN_SUCCEED',
        username: username,
        name: name,
        token: jwtToken,
        lastLoginType: type
    };
};

const loginFailed= (err, type) => {
    return {
        type: 'LOGIN_FAILED',
        error: err,
        lastLoginType: type
    };
};

const requestSignUpData = (username, password) => {
    return {
        type: 'SIGNUP_REQUEST',
        username: username,
        password: password
    };
};

const signUpSucceed = (username, jwtToken) => {
    return {
        type: 'SIGNUP_SUCCEED',
        username: username,
        token: jwtToken,
        lastLoginType: 'aws'
    };
};

const requestResendVerificationOngoing = () => {
    return {
        type: 'RESEND_VERIFICATION_REQUEST'
    };
};

const resendVerificationSucceed = () => {
    return {
        type: 'RESEND_VERIFICATION_SUCCEED'
    };
};

const resendVerificationFailed= (err) => {
    return {
        type: 'RESEND_VERIFICATION_FAILED',
        error: err
    };
};


const signUpUserConfirmationNeeded = (username, loginTried) => {
    return {
        type: 'USER_CONFIRMATION_NEEDED',
        username: username,
        loginTried: loginTried
    };
};

const requestUserVerificationCheck= () => {
    return {
        type: 'USER_EMAIL_VERIFICATION_CHECK_REQUEST'
    };
};

const userVerificationCheckSucceed= () => {
    return {
        type: 'USER_EMAIL_VERIFICATION_SUCCEED'
    };
};

const userVerificationCheckFailed= (err) => {
    return {
        type: 'USER_EMAIL_VERIFICATION_PENDING',
        error: err
    };
};

const requestUserConfirmationWithCodeData = (username, code) => {
    return {
        type: 'USER_CONFIRMATION_REQUEST',
        username: username,
        confirmCode: code
    };
};


const continueFromUserConfirmation = () => {
    return {
        type: 'CONTINUE_FROM_USER_CONFIRMATION'
    };
};


const signUpFailed= (err) => {
    return {
        type: 'SIGNUP_FAILED',
        error: err
    };
};

export const clearNeedForUserConfirmation= () => {
    return {
        type: 'CLEAR_NEED_FOR_USER_CONFIRMATION'
    };
};

export const requestNewPasswordOngoing = (username) => {
    return {
        type: 'REQUEST_PASSWORD',
        username: username
    };
};

const requestNewPasswordSucceed = () => {
    return {
        type: 'REQUEST_PASSWORD_SUCCEED'
    };
};

const requestNewPasswordFailed= (err) => {
    return {
        type: 'REQUEST_PASSWORD_FAILED',
        error: err
    };
};

export const confirmNewPasswordOngoing = (username) => {
    return {
        type: 'REQUEST_CONFIRM_NEW_PASSWORD'
    };
};

const confirmNewPasswordSucceed = () => {
    return {
        type: 'CONFIRM_NEW_SUCCEED'
    };
};

const confirmNewPasswordFailed= (err) => {
    return {
        type: 'CONFIRM_NEW_FAILED',
        error: err
    };
};

const logoutUser = () => {
    return {
        type: 'LOGOUT'
    };
};


export const logout = () => async dispatch => {
    awsAuth.logoutUser();
    dispatch(logoutUser());
}

export const logoutFacebook = () => async dispatch => {
    //For facebook, we set AWS and facebook logout
    awsAuth.logoutUser();
    facebookSdk.logout();
    dispatch(logoutUser());
}


export const requestClearUserConfirmationNeed = () => async dispatch => {
    dispatch(clearNeedForUserConfirmation());
}

export const requestLogin = (username, password) => async dispatch => {
    dispatch(requestLoginData(username, password));
    return awsAuth.loginUser(username, password)
        .then((result) => {
            dispatch(loginSucceed(username, '', result.getIdToken().getJwtToken(), 'aws'));
        })
        .catch(err => {
            dispatch(loginFailed(err, 'aws'));
            if(err.code === 'UserNotConfirmedException'){
                dispatch(signUpSucceed(username));
                dispatch(signUpUserConfirmationNeeded(username, true));
            }
        });
}

export const requestFacebookLogin = () => async dispatch => {
    dispatch(requestFacebookLoginData());
    return facebookSdk.login()
        .then((result) => {
            //Set facebook credentials to AWS to indicate in AWS side that use has logged in
            return awsAuth.setFacebookCredentials(result.token)
                .then(() => {
                    return facebookSdk.getUserInfo();
                })
                .then((userInfo) => {
                    return {
                        token: result.token,
                        email: userInfo.email,
                        name: userInfo.name
                    };
                });
        })
        .then((result) => {
            dispatch(loginSucceed(result.email, result.name, result.token, 'facebook'));
        })
        .catch(err => {
            dispatch(loginFailed(err, 'facebook'));
            if(err.code === 'UserNotConfirmedException'){
                dispatch(signUpSucceed(username));
                dispatch(signUpUserConfirmationNeeded(username, true));
            }
        });
}

export const requestSignUp = (username, password) => async dispatch => {
    dispatch(requestSignUpData(username, password));
    return awsAuth.signupUser(username, password)
        .then((result) => {
            dispatch(signUpSucceed(username));
            dispatch(signUpUserConfirmationNeeded(username, false));

            /*
             The email address is not verified, so your app needs to call GetUser
             to see if an email address is awaiting verification. If it is, the app
             should call GetUserAttributeVerificationCode to initiate the email
             verification flow and then submit the verification code by calling
             VerifyUserAttribute.
            */
        })
        .catch(err => {
            dispatch(signUpFailed(err));
            if(err.code === 'UserNotConfirmedException'){
                dispatch(signUpSucceed(username));
                dispatch(signUpUserConfirmationNeeded(username, false));
            }
        });
}

/*
 The email address is not verified, so your app needs to call GetUser
 to see if an email address is awaiting verification. If it is, the app
 should call GetUserAttributeVerificationCode to initiate the email
 verification flow and then submit the verification code by calling
 VerifyUserAttribute.
*/

/*export const loginAfterUserConfirmation = (username, password) => async dispatch => {
    return awsAuth.getUserAttributes(username)
        .then((result) => {
            console.log("loginAndVerifyUserConfirmation, awsAuth.getUserAttributes:" +JSON.stringify(result));
            //TODO: If email address is awaiting verification - check status and set to store
            if(result != null){
                return awsAuth.getCurrentUserAttributeVerificationCode();
            }
        })
        .then((result) => {
            dispatch(userVerificationCheckSucceed(username));
        })
        .catch(err => {
            dispatch(userVerificationCheckFailed(err));
        });
}*/

export const resendConfirmationCode = (username) => async dispatch => {
    dispatch(requestResendVerificationOngoing());
    return awsAuth.resendConfirmationCode(username)
        .then((result) => {
            dispatch(resendVerificationSucceed());
        })
        .catch(err => {
            dispatch(resendVerificationFailed(err));
        });
}


export const confirmNewPassword = (username, password, code) => async dispatch => {
    dispatch(confirmNewPasswordOngoing(username));
    return awsAuth.confirmNewPassword(username, password, code)
        .then((result) => {
            dispatch(confirmNewPasswordSucceed());
        })
        .catch(err => {
            dispatch(confirmNewPasswordFailed(err));
        });
}

export const requestPassword = (username) => async dispatch => {
    dispatch(requestNewPasswordOngoing(username));
    return awsAuth.forgotPassword(username)
        .then((result) => {
            dispatch(requestNewPasswordSucceed());
        })
        .catch(err => {
            dispatch(requestNewPasswordFailed(err));
        });
}

export const setRequestPasswordSucceed = (value) => {
    return {
        type: value ? 'REQUEST_PASSWORD_SUCCEED' : 'REQUEST_PASSWORD_FAILED'
    };
}

export const setUsername = (username) => {
    return {
        type: 'SET_USERNAME',
        username: username
    };
}

export const requestUserConfirmationWithCode = (username, code) => async dispatch => {
    dispatch(requestUserConfirmationWithCodeData(username, code));
    return awsAuth.confirmUser(username, code)
        .then((result) => {
            dispatch(signUpSucceed(username, result.getIdToken().getJwtToken()));
        })
        .catch(err => {
            if(err.code == 'ExpiredCodeException'){
                dispatch(signUpFailed(err));
                //request automatically new code
                return awsAuth.resendConfirmationCode()
                    .catch(err => {
                        dispatch(signUpFailed(err));
                    });
            } else {
                dispatch(signUpFailed(err));
            }
        });
}




/*export const checkFacebookUser = () => async dispatch => {
    return ;
    FBSDKAccessToken.setCurrentAccessToken();
    FBSDKAccessToken.refreshCurrentAccessToken();
};*/
