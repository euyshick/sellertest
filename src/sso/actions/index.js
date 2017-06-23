export const SET_PROPS = 'SET_PROPS'
export const CHANGE_INPUT = 'CHANGE_INPUT'
export const BLUR_INPUT = 'BLUR_INPUT'
export const CHANGE_RADIO = 'CHANGE_RADIO'

export function setProps(obj){
  return{
    type : SET_PROPS,
    data : obj,
  }
}

export function changeInput(event){
  return{
    type : CHANGE_INPUT,
    event : event,
  }
}

export function blurInput(event){
  return{
    type : BLUR_INPUT,
    event : event,
  }
}

export function changeRadio(event){
  return{
    type : CHANGE_RADIO,
    event : event,
  }
}
