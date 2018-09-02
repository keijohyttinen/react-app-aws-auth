import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  ScrollView,
  Icon,
  Row,
  Subtitle,
  Text,
  Title,
  View,
  Image,
  Divider,
  Tile,
  Screen,
  Caption,
  Button,
  Overlay,
  Heading,
  TouchableOpacity,
  GridRow,
  Card,
  ListView
} from '@shoutem/ui';


import I18n from './i18n/i18n';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

/*
var redButtonStyle = StyleSheet.create({
  button: { backgroundColor: '#ff3232', borderRadius: 4},
  text: { color: 'white' }
});

var greenButtonStyle = StyleSheet.create({
  button: { backgroundColor: '#4CB84C', borderRadius: 4},
  text: { color: 'white' }
});

var blueButtonStyle = StyleSheet.create({
  button: { backgroundColor: '#3232ff', borderRadius: 4},
  text: { color: 'white' }
});

var yellowButtonStyle = StyleSheet.create({
  button: { backgroundColor: '#ffff32', borderRadius: 4 },
  text: { color: 'black' }
});

var orangeButtonStyle = StyleSheet.create({
  button: { backgroundColor: '#FF9932', borderRadius: 4 },
  text: { color: 'white' }
});

var buttonStyle = {
  "red": redButtonStyle,
  "green": greenButtonStyle,
  "blue": blueButtonStyle,
  "yellow": yellowButtonStyle,
  "orange": orangeButtonStyle,
}*/


class TicketDetails extends Component {
  static propTypes = {
    ticket: React.PropTypes.object,
  };

  capitalize(s){
    return s && s[0].toUpperCase() + s.slice(1);
  }

  render() {
    const { params } = this.props.navigation.state;
    const ticket = params.ticket;

    var organizersInfo = ticket.organizers.map((organizer, i) => {
      return (
          <View styleName="vertical" style={{ flex: 0.9 }} key = {i}>
            <Divider styleName="line" />
            <Row style={{ flex: 1, flexDirection: 'row' }} key = {i}>
              {ticket.organizers.length === 1 ?
                (<Icon name="user-profile" />):
                (<Title style={{ width: 10, flex: 0.1 }}>{i+1}</Title>)
              }
              <View styleName="vertical" style={{ flex: 0.9 }} key = {i}>
                <Subtitle>{this.capitalize(organizer.club)}</Subtitle>
                <Text numberOfLines={1}>{this.capitalize(organizer.url)}</Text>
              </View>
            </Row>
            <Divider styleName="line" />
            <Row>
              <Icon name="email" />
              <View styleName="vertical">
                <Subtitle>{I18n.t('email')}</Subtitle>
                <Text numberOfLines={1}>{organizer.email}</Text>
              </View>
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="call" />
              <View styleName="vertical">
                <Subtitle>{I18n.t('phone')}</Subtitle>
                <Text numberOfLines={1}>{organizer.phone}</Text>
              </View>
            </Row>
         </View>
      );
    });
/*
<NavigationBar
  title={ticket.name}
  styleName="clear hide-title"
  animationName="solidify"
/>
*/
    return (
      <Screen styleName="paper">

        <ScrollView>
          <Image
            styleName="large-banner hero"
            animationName="hero"
            source={{ uri: ticket.image && ticket.image.url }}
            key={ticket.name}
          >
          <Tile animationName="hero">
              <Title styleName="md-gutter-bottom">{ticket.name}</Title>
              <Subtitle styleName="sm-gutter-horizontal">{ticket.discipline}</Subtitle>
              <Subtitle styleName="sm-gutter-horizontal">{ticket.place}</Subtitle>
            </Tile>
          </Image>

          <Screen styleName="paper">

            <Divider styleName="line" />

            <Product productType={ticket.productType} ticket={ticket}/>

            {organizersInfo}

            <Divider styleName="line" />
          </Screen>
        </ScrollView>
      </Screen>
    );
  }
}

function getPrice(priceValue){
    return priceValue !== undefined ? priceValue : "";
}

/*


<PhotoView
  source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
  minimumZoomScale={0.5}
  maximumZoomScale={3}
  androidScaleType="center"
  onLoad={() => console.log("Image loaded!")}
  style={{width: 300, height: 300}} />*/

function Product(props) {
  if (props.productType === "variable") {
    const variations = props.ticket.variations.map((variation, index) => {
        return (
          <View key={index} >
              <Row>
                <Image
                  styleName="small rounded-corners"
                  source={{uri: variation.image}}
                />
                <View styleName="vertical stretch space-between">
                    <Subtitle>{variation.name}</Subtitle>
                    <Caption>{variation.description}</Caption>
                    <View styleName="horizontal">
                      <Subtitle styleName="md-gutter-right">{variation.saleprice !== "" && variation.saleprice !== undefined ?
                            variation.saleprice :
                            variation.price}</Subtitle>
                      {variation.saleprice !== "" && variation.saleprice !== undefined &&
                        <Caption styleName="line-through">{variation.saleprice}</Caption>
                      }
                    </View>
                </View>
                <Button styleName="right-icon"><Icon name="add-to-cart" /><Text>{I18n.t('buy')}</Text></Button>
              </Row>
            <Divider styleName="line"/>
          </View>
        );
    });

    return (
      <View>
        <Subtitle styleName="md-gutter">{props.ticket.shortdescription}</Subtitle>
        <Text styleName="md-gutter multiline">{props.ticket.description}</Text>
        {variations}
      </View>
    );
  }

  return (
    <View>
      <Row>
        <View>
          <Subtitle styleName="sm-gutter-horizontal">{props.ticket.shortdescription}</Subtitle>
          <View styleName="sm-gutter-horizontal horizontal v-center space-between">
            <View styleName="horizontal">
              <Subtitle styleName="md-gutter-right">{getPrice(props.ticket.price)}</Subtitle>
              <Caption styleName="line-through">{getPrice(props.ticket.saleprice)}</Caption>
            </View>
            <Button styleName="tight clear"><Icon name="cart" /></Button>
          </View>
        </View>
      </Row>

      <Text styleName="md-gutter multiline">{props.ticket.description}</Text>

      <Button styleName="border">
        <Text>{I18n.t('buyNow')}</Text>
        <Icon name="cart" />
      </Button>
    </View>
  );
}

TicketDetails.navigationOptions = ({ navigation }) => {
  title: '' //navigation.state.params.title,
};
export default TicketDetails;
