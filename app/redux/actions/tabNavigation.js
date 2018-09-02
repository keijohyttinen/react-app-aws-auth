import { CHANGE_TAB }  from '../../constants/ActionTypes'

export function changeTab (index) {
  console.log("changeTab(index):"+ JSON.stringify(index))
  return {
    type: CHANGE_TAB,
    index
  }
}
