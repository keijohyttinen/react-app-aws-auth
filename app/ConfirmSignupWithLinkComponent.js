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

import I18n from './i18n/i18n';

import PropTypes from 'prop-types'

export default class ConfirmSignup extends Component {

  constructor (props) {
      super(props);
      this.state = {
          code: '',
          resendEnabled: true
      };
  }

  tryLogin(){
      const { onUserConfirmation, onCleanError } = this.props;
      onCleanError();
      onUserConfirmation(this.state.code);
  }

  cancel(){
      const { onCancel, onCleanError } = this.props;
      onCleanError();
      onCancel();
  }

  resendVerification(){
      const { onResendVerification, onCleanError } = this.props;
      onCleanError();
      //Disable button at least for 3 sec
      this.setState({resendEnabled: false});
      onResendVerification();
      let that = this;
      setTimeout(function(){that.setState({resendEnabled: true})}, 3000);
  }

  render() {
    console.info("ConfirmSignup.render, this.props: "+JSON.stringify(this.props));
    const { onUserConfirmation, onCancel, isLoginTried, isLoginOngoing,
            isResendVerificationOngoing, isResendSucceed, showErrorIfErrorExist } = this.props;
    return (
      <Screen styleName="paper">

        <Title>{I18n.t('confirmSignUpTitle')}</Title>

        <ScrollView>
            <Divider styleName="section-header">
                <Caption>{I18n.t('checkSignUpText')}{' '+ I18n.t('checkEmailLinkVerificationText')}</Caption>
            </Divider>

            <Divider styleName="line" />
            <View styleName="vertical" style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontSize: 12, color: 'red'}}>
                        {showErrorIfErrorExist()}
                    </Text>
                    {isResendSucceed !== undefined &&
                        <Text style={{fontSize: 12, color: 'blue'}}>
                            {isResendSucceed ? I18n.t('userConfirmResendSucceed') : ''/*I18n.t('userConfirmResendFailed')*/}
                        </Text>
                    }
            </View>
            <Divider />
            <Button styleName="secondary" onPress={(e) => this.tryLogin()}>
              <Text>{I18n.t('continueAccountButtonText')}</Text>
              {isLoginOngoing && <Spinner />}
            </Button>
            <Divider />
            <Divider />
            <Divider />
            <Button styleName="secondary" disabled={(!this.state.resendEnabled || isResendVerificationOngoing)} onPress={(e) => this.resendVerification()}>
              <Text>{I18n.t('requestNewCodeButtonText')}</Text>
              {(!this.state.resendEnabled || isResendVerificationOngoing) && <Spinner />}
            </Button>
            <Divider />
            <Button styleName="secondary" onPress={(e) => this.cancel()}>
              <Text>{I18n.t('cancelButtonText')}</Text>
            </Button>

        </ScrollView>
      </Screen>
    );
  }
}

ConfirmSignup.propTypes = {
  onUserConfirmation: PropTypes.func.isRequired,
  onResendVerification: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCleanError: PropTypes.func.isRequired,
  isLoginTried: PropTypes.bool.isRequired,
  isLoginOngoing:  PropTypes.bool.isRequired,
  isResendVerificationOngoing: PropTypes.bool.isRequired
}
