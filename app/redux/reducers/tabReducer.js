
import { CHANGE_TAB } from '../../constants/ActionTypes'
import React, { Component } from 'react'
import { Icon } from 'react-native-elements'

const tabs = [
  {
    key: 'tickets',
    icon: () => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={33} />,
    selectedIcon: () => <Icon color={'#6296f9'} name='whatshot' size={30} />,
    title: 'Liput'
  },
  {
    key: 'account',
    icon: () => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='person' size={33} />,
    selectedIcon: () => <Icon color={'#6296f9'} name='person' size={30} />,
    title: 'Tili'
  }
]

const initialState = {
  index: 0,
  tabs
}

function tabsNav (state = initialState, action) {
  //console.info("state: "+JSON.stringify(state) + ", action: "+  JSON.stringify(action));
  if (action.index === state.index) return state
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        index: action.index
      }
    default:
      return state
  }
}

export default tabsNav
