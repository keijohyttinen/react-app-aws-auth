import React, { Component } from 'react';
import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
  Overlay,
  View,
  Button,
  Text
} from '@shoutem/ui';

import I18n from './i18n/i18n';

import { connect } from 'react-redux';
import { ButtonGroup } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';

import TicketDetails from './TicketDetails'

import { loadTickets } from './redux/actions/tickets';

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      selectedCategoryIndex: 0
    };
    this.updateCategoryIndex = this.updateCategoryIndex.bind(this);
  }

  updateCategoryIndex (selectedCategoryIndex) {
    this.setState({selectedCategoryIndex})
  }

  getTickets() {
    return this.props.requestLoadTickets();
  }

  renderRow(ticket) {
    const { navigate } = this.props.navigation;

    return (
      <TouchableOpacity onPress={() => navigate('TicketDetails', {ticket: ticket})}>
        <Image
          styleName="large-banner"
          source={{ uri: ticket.image.url }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{ticket.name}</Title>
            <Subtitle styleName="sm-gutter-horizontal">{ticket.header}</Subtitle>
              <Subtitle styleName="sm-gutter-horizontal">{ticket.place}</Subtitle>
            <Subtitle styleName="sm-gutter-bottom">{ticket.price}</Subtitle>
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
/*
const buttons = ['PalloiluliputFixMe']
<ButtonGroup
  onPress={this.updateCategoryIndex}
  //selectedIndex={selectedIndex}
  buttons={buttons}
  />
*/

  render() {
    return (
      <Screen>
          <Button styleName="confirmation secondary" onPress={(e) => this.getTickets(e)}>
            <Text>{I18n.t("LoadTickets")}</Text>
          </Button>
        <ListView
          data={this.getTickets()}
          renderRow={ticket => this.renderRow(ticket)}
        />
      </Screen>
    );
  }
}
function triggerSearch(text){

}

HomeScreen.navigationOptions = {
  title: I18n.t('homeHeader'),
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestLoadTickets: () => { dispatch(loadTickets()); }
    }
};

const HomeScreenStackNavigator = StackNavigator({
    HomeScreen: { screen: connect(undefined/*mapStateToProps*/,mapDispatchToProps)(HomeScreen) },
    TicketDetails: { screen: TicketDetails }
});



export default HomeScreenStackNavigator
