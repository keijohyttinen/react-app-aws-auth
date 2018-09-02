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
  Title
} from '@shoutem/ui';

import I18n from './i18n/i18n';

import PropTypes from 'prop-types'

export default class ConfirmSignup extends Component {

  constructor (props) {
      super(props);
      this.state = {
          code: ''
      };
  }

  render() {
    console.info("ConfirmSignup.render, this.props: "+JSON.stringify(this.props));
    const { onUserConfirmation } = this.props;
    return (
      <Screen>

        <Title>{I18n.t('confirmSignUpTitle')}</Title>

        <ScrollView>

            <Divider styleName="section-header">
              <Caption>{I18n.t('checkSignUpText')}</Caption>
            </Divider>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              autoFocus={true}
              placeholder={I18n.t('codePlaceholder')}
              value={this.state.code}
              onChangeText={(text) => this.setState({ code: text })}
            />
            <Divider styleName="line" />

            <Divider />
            <Button styleName="confirmation secondary" onPress={(e) => onUserConfirmation(this.state.code)}>
              <Text>{I18n.t('confirmSignUpButton')}</Text>
            </Button>

        </ScrollView>
      </Screen>
    );
  }
}

ConfirmSignup.propTypes = {
  onUserConfirmation: PropTypes.func.isRequired
}
