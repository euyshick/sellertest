import React, { Component } from 'react'

import '../css/header.css'

export default class HeaderSimple extends Component{
  render(){
    return(
      <header id="header-mini">
    		<div className="header-mini_body">
    			<h1 className="tit-h1"><a href="https://www.pping.kr/"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_happyshopping.png" alt="행복쇼핑" /></a></h1>
    		</div>
    	</header>
    );
  }
}
