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
  Spinner
} from '@shoutem/ui';

import { connect } from 'react-redux';
import I18n from './i18n/i18n';
import PropTypes from 'prop-types'

import ChangePasswordForm from './ChangePasswordForm';
import { requestPassword, confirmNewPassword, setRequestPasswordSucceed, setUsername } from './redux/actions/auth';
import { resetError } from './redux/actions/resetError';

class RequestPassword extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
        headerBackTitle: I18n.t('Login')
  });

  constructor (props) {
      super(props);
      this.state = {
          code: '',
          resendEnabled: true,
          confirmEnabled: true,
          username: '',
          errorText: ''
      };
      this.confirmPassword = this.confirmPassword.bind(this);
      this.sendRequestPassword = this.sendRequestPassword.bind(this);
      this.jumpToPasswordChange = this.jumpToPasswordChange.bind(this);
      this.jumpToRequestPassword = this.jumpToRequestPassword.bind(this);
  }

  jumpToPasswordChange(){
      const { gotoConfirmPasswordChange } = this.props;
      let isValid = this.setErrorTextForValidEmail(this.state.username)
      if(isValid){
          gotoConfirmPasswordChange(this.state.username);
      }
  }

  jumpToRequestPassword(){
      const { gotoRequestPassword } = this.props;
      this.setState({ errorText: ''});
      gotoRequestPassword();
  }

  sendRequestPassword(){
      const { onRequestPassword, requestResetError } = this.props;
      requestResetError();
      let isValid = this.setErrorTextForValidEmail(this.state.username)
      if(isValid){
          //Disable button at least for 3 sec
          onRequestPassword(this.state.username);
          this.setState({ resendEnabled: false });
          let that = this;
          setTimeout(function(){that.setState({resendEnabled: true})}, 3000);
      }

  }

  confirmPassword(){
      const { onConfirmPasswordChange, requestResetError, userName, form } = this.props;
      requestResetError();
      if(form.ChangePasswordForm !== undefined && form.ChangePasswordForm.syncErrors === undefined) {
          //Disable button at least for 3 sec
          onConfirmPasswordChange(userName, form.ChangePasswordForm.values.password, form.ChangePasswordForm.values.code);
          this.setState({ password: '', code: '', confirmEnabled: false });
          let that = this;
          setTimeout(function(){that.setState({confirmEnabled: true})}, 3000);
      }
  }

  setErrorTextForValidEmail(email){
      if(!email){
          this.setState({ errorText: I18n.t('emailIsRequired')});
          return false;
      }
      else if(!this.validateEmail(email)){
          this.setState({ errorText: I18n.t('invalid_email')});
          return false;
      }
      this.setState({ errorText: ''});
      return true
  }

  validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  render() {
    const { isRequestPasswordOngoing, isRequestPasswordSucceed,
        isConfirmNewPasswordOngoing, isConfirmNewPasswordSucceed } = this.props;
    const { params } = this.props.navigation.state;
    return (
      <Screen styleName="paper">
        <ScrollView>
            <Title>{I18n.t('requestPasswordTitle')}</Title>

            <Divider styleName="section-header">
              <Caption>{I18n.t('requestPasswordText')}</Caption>
            </Divider>

            <Divider styleName="line" />
            <View styleName="vertical" style={{margin: 10, flexDirection: 'column', justifyContent: 'center'}}>
                    <Text style={{fontSize: 12, color: 'red'}}>
                        {this.state.errorText}
                    </Text>
                    <Text style={{fontSize: 12, color: 'red'}}>
                        {params.showErrorIfErrorExist()}
                    </Text>
                    {isRequestPasswordSucceed !== undefined && isConfirmNewPasswordSucceed === undefined &&
                        <Text style={{fontSize: 12, color: 'blue'}}>
                            {isRequestPasswordSucceed ? I18n.t('passwordRequestSucceedText') : ''}
                        </Text>
                    }
                    {isConfirmNewPasswordSucceed !== undefined &&
                        <Text style={{fontSize: 12, color: 'blue'}}>
                            {isConfirmNewPasswordSucceed ? I18n.t('confirmPasswordSucceedText') : ''}
                        </Text>
                    }
            </View>
            <Divider styleName="line" />
            { (isRequestPasswordSucceed !== true) ? (
                <View styleName="vertical" style={{margin: 7, flexDirection: 'column', justifyContent: 'center'}}>
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
                    <Divider />
                    <Button styleName="secondary" disabled={(!this.state.resendEnabled || isRequestPasswordOngoing)} onPress={(e) => this.sendRequestPassword()}>
                      <Text>{I18n.t('requestPasswordOngoingButtonText')}</Text>
                      {(!this.state.resendEnabled || isRequestPasswordOngoing) && <Spinner />}
                    </Button>
                    <View styleName="vertical" style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text onPress={(e) => this.jumpToPasswordChange(e)} style={{fontSize: 12, color: 'blue'}}>
                            {I18n.t('alreadyHaveVerificationCodeText')}
                        </Text>
                    </View>
                </View>
            ) : (
                <View styleName="vertical" style={{margin: 7, flexDirection: 'column', justifyContent: 'center'}}>
                    <ChangePasswordForm isSubmitting={(!this.state.confirmEnabled || isConfirmNewPasswordOngoing)} handleSubmit={this.confirmPassword} />
                    <View styleName="vertical" style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text onPress={(e) => this.jumpToRequestPassword(e)} style={{fontSize: 12, color: 'blue'}}>
                            {I18n.t('dontHaveVerificationCodeText')}
                        </Text>
                    </View>
                </View>
            )}

        </ScrollView>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isConfirmNewPasswordOngoing: state.auth.isConfirmNewPasswordOngoing,
        isConfirmNewPasswordSucceed: state.auth.confirmPasswordSucceed,
        isRequestPasswordOngoing: state.auth.isRequestPasswordOngoing,
        isRequestPasswordSucceed: state.auth.requestPasswordSucceed,
        form: state.form,
        userName: state.auth.username,
        passWord: state.auth.password,
        error: state.error
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmPasswordChange: (username, password, code) => { dispatch(confirmNewPassword(username, password, code)); },
        onRequestPassword: (username) => { dispatch(requestPassword(username)); },
        requestResetError: () => { dispatch(resetError()); },
        gotoConfirmPasswordChange: (username) => {
            dispatch(setUsername(username));
            dispatch(setRequestPasswordSucceed(true));
        },
        gotoRequestPassword: () => { dispatch(setRequestPasswordSucceed(false)); }
    };
}

/*
<View styleName="vertical" style={{margin: 10, flexDirection: 'column', justifyContent: 'center'}}>
    <TextInput
      autoCapitalize='none'
      autoCorrect={false}
      autoFocus={true}
      keyboardType='numeric'
      placeholder={I18n.t('codePlaceholder')}
      value={this.state.code}
      onChangeText={(text) => this.setState({ code: text })}
    />
    <Divider styleName="line" />
    <TextInput
      autoCapitalize='none'
      autoCorrect={false}
      autoFocus={false}
      secureTextEntry={true}
      placeholder={I18n.t('passwordPlaceholder')}
      value={this.state.password}
      onChangeText={(text) => this.setState({ password: text })}
    />
    <Divider styleName="line" />
    <TextInput
      autoCapitalize='none'
      autoCorrect={false}
      autoFocus={false}
      secureTextEntry={true}
      placeholder={I18n.t('passwordRepeatPlaceholder')}
      value={this.state.password}
      onChangeText={(text) => this.setState({ password_repeat: text })}
    />
    <Divider styleName="line" />
    <Divider />
    <Button styleName="secondary" disabled={(!this.state.confirmEnabled || isConfirmNewPasswordOngoing)} onPress={(e) => this.confirmPassword()}>
      <Text>{I18n.t('confirmPasswordButtonText')}</Text>
      {(!this.state.confirmEnabled || isConfirmNewPasswordOngoing) && <Spinner />}
    </Button>
    <Divider />
</View>

<View styleName="vertical" style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
    <ChangePasswordForm isSubmitting={(!this.state.confirmEnabled || isConfirmNewPasswordOngoing)} handleSubmit={this.confirmPassword} />
</View>
*/

export default connect(mapStateToProps, mapDispatchToProps)(RequestPassword)
