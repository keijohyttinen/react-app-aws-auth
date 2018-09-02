import React, { Component } from 'react';
import {
  ScrollView,
  Screen,
  Button,
  TextInput,
  Text,
  View,
  Caption,
  Divider,
  Title,
  Spinner,
  Icon
} from '@shoutem/ui';

var FlexSpinner = require('react-native-spinkit');

var ReactNative = require('react-native');
var {
  Alert,
  AsyncStorage
} = ReactNative;

import { SocialIcon } from 'react-native-elements'
import I18n from './i18n/i18n';

import {
  LoginButton,
  AccessToken,
  LoginManager
} from 'react-native-fbsdk';

import { connect } from 'react-redux';
import { requestSignUp, requestLogin, requestFacebookLogin, requestPassword,
     requestUserConfirmation, loginAndVerifyUserConfirmation,
     logout, resendConfirmationCode, requestClearUserConfirmationNeed } from './redux/actions/auth';
import { resetError } from './redux/actions/resetError';

import { StackNavigator, NavigationActions } from 'react-navigation';

import RequestPassword from './RequestPasswordComponent'
import ConfirmSignup from './ConfirmSignupWithLinkComponent'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import Secured from './Secured'

class LoginScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
      title: navigation.state.params !== undefined ? navigation.state.params.title : I18n.t('Login')
  });

  constructor (props) {
      super(props);

      this.state = {
          page: 'Login',
          username: '',
          password: ''
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.handleSignUp = this.handleSignUp.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleCleanError = this.handleCleanError.bind(this);
      this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
      this.handleUserConfirmation = this.handleUserConfirmation.bind(this);
      this.handleUserConfirmationCancel = this.handleUserConfirmationCancel.bind(this);
      this.handleVerificationResend = this.handleVerificationResend.bind(this);
      this.showErrorIfErrorExist = this.showErrorIfErrorExist.bind(this);
  }

  componentDidMount() {
      this.props.navigation.setParams({ title: this.getTitle(this.state.page) });
  }

  alterState () { return (this.state.page === 'Login') ? 'SignUp' : 'Login'; }

  getTitle (pageState) { return (pageState=== 'Login') ? I18n.t('Login'): I18n.t('SignUp'); }

  getAltText () { return (this.state.page === 'Login') ? I18n.t('noAccount') + I18n.t('SignUp') : I18n.t('haveAccount') + I18n.t('Login') ; }

  handleClick (e) {
      e.preventDefault();
      const { onRequestLogin, onRequestSignup } = this.props;

     if (!this.validateEmail(this.state.username)) {
         // not a valid email
         Alert.alert('Failed', I18n.t('invalid_email') );
         return;
     }
      // Sign up
      if (this.state.page === 'SignUp') {
          onRequestSignup(this.state.username, this.state.password);
      } else {
          onRequestLogin(this.state.username, this.state.password);
      }
  }

  handleFacebookLogin () {
      this.props.onRequestFacebookLogin();
  }

  handleUserConfirmation (code) {
      const { onRequestLogin, userName, passWord } = this.props;
      //onContinueToAccount(userName, passWord);
      onRequestLogin(userName, passWord);
  }

  handleUserConfirmationCancel () {
      const { clearNeedForUserConfirmation } = this.props;
      clearNeedForUserConfirmation();
  }

  handleVerificationResend (){
      const { resendConfirmationCode, userName } = this.props;
      resendConfirmationCode(userName);
  }

  togglePage (e) {
      const {navigation} = this.props;
      let newPageState = this.alterState();
      //Set state is not sync operation
      this.setState({ page: newPageState});
      navigation.setParams({ title: this.getTitle(newPageState)});
      this.handleCleanError();
      e.preventDefault();
  }

  validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  handleCleanError = e => {

      this.props.requestResetError();
  }

  showErrorIfErrorExist() {
        const { error } = this.props;
        if (!error) {
          return ""
        }

        let text = "";
        if(error.code && error.code.indexOf("facebooksdk_") > -1){
            text = I18n.t(this.props.error.code);
        } else {
            text = I18n.t("aws_congito_"+this.props.error.code);
            if(text.indexOf(this.props.error.code) > -1){
                text = this.props.error.message;
            } else {
                text += " ("+this.props.error.message+")"
            }

        }
        return text;
  }

  handleLogin(e) {
      //e.preventDefault();
      const { onRequestLogin, form } = this.props;
      this.handleCleanError();
      if(form.LoginForm !== undefined && form.LoginForm.syncErrors === undefined) {

          onRequestLogin(form.LoginForm.values.email, form.LoginForm.values.password);

      }
  }
  handleSignUp(values) {
      //e.preventDefault();
      const { onRequestSignup, form } = this.props;
      this.handleCleanError();
      if(form.SignUpForm !== undefined && form.SignUpForm.syncErrors === undefined) {
          onRequestSignup(form.SignUpForm.values.email, form.SignUpForm.values.password);
      }
  }

  render() {
    const { isLoginOngoing, isSignupOngoing, isLoggedIn, isConfirmed, loginRequestType,
        isRegistered, error, isLoginTried, isResendVerificationOngoing, isResendSucceed,
        userName, passWord, isRequestPasswordOngoing, isRequestPasswordSucceed, onRequestPassword} = this.props;
    const { navigate } = this.props.navigation;
    let isActionOngoing = ((isLoginOngoing || isSignupOngoing) && error == null);
    let isUserCredentialsAvailable = (passWord != '' && userName != '');
    let isUserConfirmationNeeded = (isConfirmed === false && isRegistered === true);
    if(isUserConfirmationNeeded && isUserCredentialsAvailable){
        return (
            <ConfirmSignup
              onUserConfirmation={this.handleUserConfirmation}
              onResendVerification={this.handleVerificationResend}
              onCancel={this.handleUserConfirmationCancel}
              isLoginTried={isLoginTried}
              isLoginOngoing={isLoginOngoing}
              isResendVerificationOngoing={isResendVerificationOngoing}
              isResendSucceed={isResendSucceed}
              showErrorIfErrorExist={this.showErrorIfErrorExist}
              onCleanError={this.handleCleanError}
            />
        );
    } else if(isLoggedIn) {
        this.state.page = 'Login'; //set local state to login as well
        return (
            <Secured/>
        );
    } else if(loginRequestType === 'facebook' && isLoginOngoing){
        return (
            <Screen styleName="paper">
                  <View styleName="fill-parent" style={{flex: 1, alignItems: 'center', margin: 7, flexDirection: 'column', justifyContent: 'center'}}>
                      <FlexSpinner style={{marginBottom: 40}} size={100} type='ThreeBounce' color='#6296f9' />
                      <View styleName="vertical" space-between style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                          <Icon name="facebook" color='#3b5998' />
                          <Title>
                              {' ' + I18n.t('facebookLoginOngoing')}
                          </Title>
                      </View>
                  </View>
            </Screen>
        );
    }

    return (
      <Screen styleName="paper">
        <ScrollView>

            <View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                { this.state.page == 'SignUp' ? (
                    <SignUpForm isSubmitting={isActionOngoing} page={this.state.page} handleSubmit={this.handleSignUp} />
                ) : (
                    <LoginForm isSubmitting={isActionOngoing} page={this.state.page} handleSubmit={this.handleLogin} />
                )}
            </View>
            <View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontSize: 12, color: 'red'}}>
                        {this.showErrorIfErrorExist()}
                    </Text>
            </View>

            <View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 12, color: 'blue'}}>
                    {this.getAltText()}
                </Text>
            </View>

            <View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                <Text onPress={(e) => navigate('RequestPassword', {
                        showErrorIfErrorExist: this.showErrorIfErrorExist
                    })} style={{fontSize: 12, color: 'blue'}}>
                    {I18n.t('haveYouForgottenPasswordTextLink')}
                </Text>
            </View>
            <Divider />

            <SocialIcon
              title={I18n.t('fbButtonTitle')}
              button
              type='facebook'
              onPress={(e) => this.handleFacebookLogin()}
            />

        </ScrollView>
      </Screen>
    );

    /*return (
      <Screen>

        <Title>{I18n.t(this.state.page)}</Title>

        <ScrollView>

            <Divider styleName="section-header">
              <Caption>{I18n.t('loginMiddleTitle')}</Caption>
            </Divider>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              autoFocus={true}
              keyboardType='email-address'
              placeholder={I18n.t('namePlaceholder')}
              value={this.state.username}
              onChangeText={(text) => this.setState({ username: text })}
            />
            <Divider styleName="line" />
            <TextInput
              placeholder={I18n.t('passwordPlaceholder')}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Divider styleName="line" />
            <Divider />
            <Button styleName="confirmation secondary" onPress={(e) => this.handleClick(e)}>
              <Text>{I18n.t(this.state.page)}</Text>
            </Button>

            <View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 12, color: 'blue'}}>
                    {this.getAltText()}
                </Text>
                {isActionOngoing && <Spinner />}
            </View>

            <Divider />

            <SocialIcon
              title={I18n.t('fbButtonTitle')}
              button
              type='facebook'
            />
        </ScrollView>
      </Screen>
  );*/
  }
}
/*
<LoginButton
  publishPermissions={["publish_actions"]}
  onLoginFinished={
    (error, result) => {
      if (error) {
        alert("Facebook login has error: " + result.error);
      } else if (result.isCancelled) {
        alert("Facebook login is cancelled.");
      } else {
        AccessToken.getCurrentAccessToken().then(
          async (data) => {
            try {
              await AsyncStorage.setItem(keyStoreId, data.accessToken.toString());
            } catch (error) {
              // Error saving data
              alert("Failed to persist user access information");
            }
            alert(data.accessToken.toString())
          }
        )
      }
    }
  }
  onLogoutFinished={() => alert("logout.")}/>
*/



const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        isLoggedOut: state.auth.isLoggedOut,
        isLoginOngoing: state.auth.isLoginOngoing,
        isSignupOngoing: state.auth.isSignupOngoing,
        isResendVerificationOngoing: state.auth.isResendVerificationOngoing,
        isResendSucceed: state.auth.resendSucceed,
        isRegistered: state.auth.registered,
        isConfirmed: state.auth.confirmed,
        isLoginTried: state.auth.loginTried,
        userName: state.auth.username,
        passWord: state.auth.password,
        lastLoginType: state.auth.lastLoginType,
        loginRequestType: state.auth.loginRequestType,
        form: state.form,
        error: state.error
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRequestFacebookLogin: () => { dispatch(requestFacebookLogin()); },
        onRequestLogin: (username, password) => { dispatch(requestLogin(username, password)); },
        onRequestSignup: (username, password) => { dispatch(requestSignUp(username, password)); },
        onUserConfirmationCode: (username, code) => { dispatch(requestUserConfirmation(username, code)); },
        onContinueToAccount: (username, password) => { dispatch(loginAndVerifyUserConfirmation(username, password)); },
        onRequestPassword: (username) => { dispatch(requestPassword(username)); },
        requestResetError: () => { dispatch(resetError()); },
        requestLogout: () => { dispatch(logout()); },
        resendConfirmationCode: (username) => { dispatch(resendConfirmationCode(username)); },
        clearNeedForUserConfirmation: () => { dispatch(requestClearUserConfirmationNeed()); }
    }
}


const LoginScreenStackNavigator = StackNavigator({
    LoginScreen: { screen: connect(mapStateToProps, mapDispatchToProps)(LoginScreen) },
    ConfirmSignUp: { screen: ConfirmSignup },
    RequestPassword: { screen: RequestPassword }
});

export default LoginScreenStackNavigator // connect(mapStateToProps, mapDispatchToProps)(LoginScreenStackNavigator)
