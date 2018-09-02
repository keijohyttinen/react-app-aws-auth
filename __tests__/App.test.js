import React from 'react';
import Root from './../root';

import renderer from 'react-test-renderer';

jest.mock('react-native-i18n', () => {
  const i18njs = require('i18n-js');
  const en = require('../app/i18n/i18n');
  i18njs.translations = {en}; // Optional ('en' is the default)

  return {
     t: jest.fn((k, o) => i18njs.t(k, o)),
  };
});
jest.mock('react-native-hockeyapp', () => {
  return {
      configure: jest.fn(),
      checkForUpdate: jest.fn(),
      start: jest.fn()
  }
});

jest.mock('Linking', () => {
    // we need to mock both Linking.getInitialURL()
  // and Linking.getInitialURL().then()
  const getInitialURL = jest.fn()
  getInitialURL.mockReturnValueOnce({then: jest.fn()})

  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: getInitialURL
  }
});

//This helps for issue:
https://github.com/facebook/react-native/issues/12762
https://github.com/facebook/react-native/issues/12225
const mockComponent = require.requireActual('react-native/jest/mockComponent');

jest.mock('ListView', () => {
  const RealListView = require.requireActual('ListView');
  const ListView = mockComponent('ListView');
  ListView.prototype.render = RealListView.prototype.render;
  return ListView;
});

it('renders without crashing', () => {
  const rendered = renderer.create(<Root />).toJSON();
  expect(rendered).toBeTruthy();
});
