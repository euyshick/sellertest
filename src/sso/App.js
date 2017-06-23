import React, { Component } from 'react'

import { setTitle } from '../utils/Utils'

import HeaderMobile from '../components/HeaderMobile'
import FooterMobile from '../components/FooterMobile'

import '../css/comm.css'
import '../css/forms.css'
import '../css/sso.css'
import '../css/seller_apply.css'

export default class App extends Component {
  render(){
    const {simpleMode,title} = this.props.children.props.route;

    setTitle(title);

    return (
      <div id="wrap">
        {
          !simpleMode?
          <HeaderMobile />: null
        }
        {this.props.children}
        {
          !simpleMode?
          <FooterMobile />: null
        }
      </div>
    );
  }
}
