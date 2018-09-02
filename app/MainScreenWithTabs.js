import React, { Component } from 'react'
import { Tabs, Tab, Icon } from 'react-native-elements'
import {
  Screen,
} from '@shoutem/ui';

import { connect } from 'react-redux'
import { changeTab } from './redux/actions/tabNavigation'

import I18n from './i18n/i18n';

import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'

class MainScreenWithTabs extends Component {

    _changeTab (i) {
        const { changeTab } = this.props
        console.info("MyTabs.this.props: "+JSON.stringify(this.props));
        changeTab(i)
    }
    _renderTabContent (key) {
        switch (key) {
          case 'tickets':
            return <HomeScreen title={I18n.t('homeHeader')} />
          case 'account':
            return <LoginScreen title={I18n.t('loginHeader')} />
          default:
            return <HomeScreen title={I18n.t('homeHeader')} />
        }
    }
    render () {
        const tabs = this.props.tabs.tabs.map((tab, i) => {
          return (
            <Tab
              key={tab.key}
              titleStyle={{fontWeight: 'bold', fontSize: 10}}
              selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
              selected={this.props.tabs.index === i}
              title={tab.title}
              renderIcon={tab.icon}
              renderSelectedIcon={tab.selectedIcon}
              onPress={() => this._changeTab(i)}>
              {this._renderTabContent(tab.key)}
            </Tab>
          )
        })
        return (
          <Screen>
            <Tabs>
              {tabs}
            </Tabs>
          </Screen>
        )
    }
}

function mapStateToProps (state) {
  //console.info("tabsRootContainer.mapStateToProps, state: "+JSON.stringify(state));
  return {
    tabs: state.tabState
  }
}

export default connect(
  mapStateToProps,
  {
    changeTab: (index) => changeTab(index)
  }
)(MainScreenWithTabs)
