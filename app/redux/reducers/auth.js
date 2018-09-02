var _ = require('underscore')

const defaultState = {
    isSignupOngoing: false,
    isLoginOngoing: false,
    isUserConfirmationNeeded: false,
    isUserVerificationCheckOngoing: false,
    username: '',
    password: '',
    registered: false,
    confirmed: false,
    isLoggedIn: false,
    isLoggedOut: false, //Only true when pressed logged out
    loginTried: false,
    isResendVerificationOngoing: false
};

/*
 how the application's state changes in response. This is the job of reducers.
*/

function handleAuth(state = defaultState, action) {
    console.log("handleAuth(state):"+ JSON.stringify(state))
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return _.extend( state, {
                isLoggedIn: false,
                isLoginOngoing: true,
                isLoggedOut: false,
                username: action.username,
                password: action.password,
                loginRequestType: action.loginRequestType,
                resendSucceed: undefined
            });
        case 'LOGIN_FACEBOOK_REQUEST':
            return _.extend( state, {
                isLoggedIn: false,
                isLoginOngoing: true,
                isLoggedOut: false,
                loginRequestType: action.loginRequestType,
                resendSucceed: undefined
            });
        case 'LOGIN_SUCCEED':
            return _.extend( state, {
                username: action.username,
                name: action.name,
                token: action.token,
                isLoggedIn: true,
                isLoginOngoing: false,
                registered: true,
                confirmed: true,
                loginTried: false,
                loginType: action.lastLoginType
            });
        case 'LOGIN_FAILED':
            return _.extend( state, {
                //username: '',
                //password: '',
                token: '',
                isLoggedIn: false,
                isLoginOngoing: false
            });
        case 'LOGOUT':
            return _.extend( state, {
                isLoggedIn: false,
                isLoginOngoing: false,
                isUserConfirmationNeeded: false,
                isLoggedOut: true,
                username: '',
                name: '',
                password: '',
                token: '',
                registered: false,
                confirmed: false
            });
        case 'SET_USERNAME':
            return _.extend( state, {
                username: action.username
            });
        case 'SIGNUP_REQUEST':
            return _.extend( state, {
                isSignupOngoing: true,
                isUserConfirmationNeeded: false,
                username: action.username,
                password: action.password
            });
        case 'USER_CONFIRMATION_NEEDED':
            return _.extend( state, {
                isUserConfirmationNeeded: true,
                confirmed: false,
                registered: true,
                loginTried: action.loginTried
            });
        case 'CLEAR_NEED_FOR_USER_CONFIRMATION':
            return _.extend( state, {
                isUserConfirmationNeeded: false,
                confirmed: false,
                registered: false,
                loginTried: false,
                resendSucceed: undefined
            });
        case 'USER_CONFIRMATION_CODE_REQUEST':
            return _.extend( state, {
                isUserConfirmationNeeded: true,
                confirmed: false,
            });
        case 'USER_CONFIRMATION_CODE_CONFIRMED':
            return _.extend( state, {
                isUserConfirmationNeeded: false,
                confirmed: true,
            });
        case 'RESEND_VERIFICATION_REQUEST':
            return_.extend( state, {
                isResendVerificationOngoing: true
            });
        case 'RESEND_VERIFICATION_SUCCEED':
            return _.extend( state, {
                isResendVerificationOngoing: false,
                resendSucceed: true
            });
        case 'RESEND_VERIFICATION_FAILED':
            return _.extend( state, {
                isResendVerificationOngoing: false,
                resendSucceed: false
            });
        case 'REQUEST_PASSWORD':
            return _.extend( state, {
                isRequestPasswordOngoing: true,
                username: action.username
            });
        case 'REQUEST_PASSWORD_SUCCEED':
            return _.extend( state, {
                isRequestPasswordOngoing: false,
                requestPasswordSucceed: true
            });
        case 'REQUEST_PASSWORD_FAILED':
            return _.extend( state, {
                isRequestPasswordOngoing: false,
                requestPasswordSucceed: false
            });
        case 'REQUEST_CONFIRM_NEW_PASSWORD':
            return _.extend( state, {
                isConfirmNewPasswordOngoing: true
            });
        case 'CONFIRM_NEW_SUCCEED':
            return _.extend( state, {
                isConfirmNewPasswordOngoing: false,
                confirmPasswordSucceed: true
            });
        case 'CONFIRM_NEW_FAILED':
            return _.extend( state, {
                isConfirmNewPasswordOngoing: false,
                confirmPasswordSucceed: false
            });
        /*case 'USER_EMAIL_VERIFICATION_CHECK_REQUEST':
            return _.extend( state, {
                isUserVerificationCheckOngoing: true,
                confirmed: false
            });
        case 'USER_EMAIL_VERIFICATION_SUCCEED':
            return _.extend( state, {
                isUserVerificationCheckOngoing: false,
                confirmed: true
            });
        case 'USER_EMAIL_VERIFICATION_PENDING':
            return _.extend( state, {
                isUserVerificationCheckOngoing: false,
                confirmed: false
            });*/
        case 'SIGNUP_SUCCEED':
            return _.extend( state, {
                isSignupOngoing: false,
                isUserConfirmationNeeded: true,
                username: action.username,
                registered: true
            });
        case 'SIGNUP_FAILED':
            return _.extend( state, {
                isSignupOngoing: false,
                isLoginOngoing: false,
                isUserConfirmationNeeded: false,
                username: '',
                password: '',
                registered: false,
                confirmed: false
            });
        default:
            return state;
    }
}

export default function reducer(state = {}, action) {

    switch (action.type) {
        case 'LOGIN_REQUEST':
        case 'LOGIN_FACEBOOK_REQUEST':
        case 'LOGIN_SUCCEED':
        case 'LOGIN_FAILED':
        case 'LOGOUT':
        case 'SIGNUP_REQUEST':
        case 'SET_USERNAME':
        case 'USER_CONFIRMATION_NEEDED':
        case 'CLEAR_NEED_FOR_USER_CONFIRMATION':
        case 'USER_CONFIRMATION_REQUEST':
        case 'RESEND_VERIFICATION_REQUEST':
        case 'RESEND_VERIFICATION_SUCCEED':
        case 'RESEND_VERIFICATION_FAILED':
        case 'REQUEST_PASSWORD':
        case 'REQUEST_PASSWORD_SUCCEED':
        case 'REQUEST_PASSWORD_FAILED':
        case 'REQUEST_CONFIRM_NEW_PASSWORD':
        case 'CONFIRM_NEW_SUCCEED':
        case 'CONFIRM_NEW_FAILED':
        case 'SIGNUP_SUCCEED':
        case 'SIGNUP_FAILED':
            return Object.assign({}, state, handleAuth(state["auth"], action));
        default:
            return state;
    }
}
