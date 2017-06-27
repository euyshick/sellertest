import React, { Component } from 'react'

import Header from '../components/Header'
import HeaderSimple from '../components/HeaderSimple'
import Footer from '../components/Footer'
import FooterSimple from '../components/FooterSimple'

import '../css/comm.css'
import '../css/buttons.css'
import '../css/board.css'

export default class App extends Component {
  render() {
    return (
      <div id="wrap">
        {
          this.props.location.pathname==='/order/complete'?
          <Header /> : <HeaderSimple />
        }
        {this.props.children}
        {
          this.props.location.pathname==='/order/complete'?
          <Footer /> : <FooterSimple />
        }
      </div>
    );
  }
}
