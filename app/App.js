global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import React, { Component } from 'react';
import { connect } from 'react-redux';

var HockeyApp = require('react-native-hockeyapp');
import LocalStorage from './LocalStorage';
import { initSession } from './redux/actions/auth';

import MainScreenWithTabs from './MainScreenWithTabs';

const HOCKEY_APP_ID = "02afb21478d347deb660ae16d5d665b1";

class App extends Component {

  constructor(props) {
    super(props);
  }

  async componentWillMount(){
      HockeyApp.configure(HOCKEY_APP_ID, true);
      HockeyApp.start();
      var data = await LocalStorage.init();
      console.log("LocalStorage:"+ JSON.stringify(data));

      await this.props.initAuth();
  }

  componentDidMount() {
      HockeyApp.start();
      //HockeyApp.checkForUpdate(); // optional

  }

  render() {
    return (
      <MainScreenWithTabs/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
    };
}
/*loginAndVerifyUserConfirmation*/
const mapDispatchToProps = (dispatch) => {
    return {
        initAuth: () => { dispatch(initSession()); },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
