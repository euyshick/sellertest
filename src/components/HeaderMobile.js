import React, { Component } from 'react'

import '../css/header.css'

export default class HeaderMobile extends Component{
  render(){
    return(
      <header id="header-m">
          <div className="header-m_body">
              <h1 className="tit-h1"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_happyshopping.png" alt="행복쇼핑" /></h1>

              <a href="//www.pping.kr/" className="icon-home btn-home"><span className="ir">홈바로가기</span></a>

              <div className="header-m_body_aside">

              </div>
          </div>
      </header>
    );
  }
}
