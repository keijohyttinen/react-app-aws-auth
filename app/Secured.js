import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { ScrollView, Text, View, Button } from 'react-native';
import { logout, logoutFacebook } from './redux/actions/auth';
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

class Secured extends Component {
    userLogout(e) {
        if(this.props.lastLoginType == 'facebook')
            this.props.onLogoutFacebook();
        else {
            this.props.onLogout();
        }
        e.preventDefault();
    }

    render() {
        return (
            <Screen styleName="paper">
                <ScrollView style={{padding: 20}}>
                    <Divider styleName="section-header">
                      <Caption>{I18n.t('loginWelcomeText')+` ${this.props.name}`}</Caption>
                    </Divider>
                    <Divider styleName="section-header">
                      <Caption>{I18n.t('usernameColonText') + ` ${this.props.username}`}</Caption>
                    </Divider>
                    <View style={{margin: 20}}/>
                    <Button styleName="confirmation secondary" onPress={(e) => this.userLogout(e)} >
                      <Text>{I18n.t('logoutButtonText')}</Text>
                    </Button>
                </ScrollView>
            </Screen>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username,
        name: state.auth.name,
        lastLoginType: state.auth.lastLoginType
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); },
        onLogoutFacebook: () => { dispatch(logoutFacebook()); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Secured);
