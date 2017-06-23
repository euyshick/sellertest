import React, { Component } from 'react'

import '../css/header.css'




export default class Header extends Component{
  static defaultProps = {
    userName :window.UserName,
  }
  state = {
       src:""
	}

componentWillMount(){
var that =this;
  console.log("6");
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth()+1;
  if(day<10) {
      day='0'+day;
  }
  if(month<10) {
      month='0'+month;
  }
  today = month+day;
  //today = "0606";
  console.log(today);
 let srcData= "//img.happyshopping.kr/img_static/img_pres/_v3/img_happyshopping_ci_"+today+".png"
 let srcDataBase= "//img.happyshopping.kr/img_static/img_pres/_v3/img_happyshopping_ci.png"
  let img =new Image();
  img.src =srcData;
  img.onload =function(){ 
  console.log("being");
    that.setState({
      src:srcData
      }) 
  }
  img.onerror =function(){
  console.log("none");
  that.setState({
    src:srcDataBase
    })
  }
}

  _addFavorite = () => {
    if (window.sidebar) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(location.href,document.title,"");
    }else if(window.external) { // IE Favorite
      window.external.AddFavorite(location.href,document.title);
    }else if(window.opera && window.print) { // Opera Hotlist
      this.title=document.title;
      return true;
    }
  }

  render(){
    return(
      <header id="header">
      	<div className="header-body">
      		<div className="header-body_main">
      			<h1 className="tit-h1"><a href="https://www.pping.kr"><img src={this.state.src} alt="행복쇼핑" /></a></h1>

      			<div className="header-body_search">
      				<form>
      					<fieldset>
      						<legend><span>통합검색</span></legend>
      						<input type="text" title="통합검색" placeholder="통합검색 서비스를 제공할 예정입니다" className="isearch" readOnly={true} disabled={true} />
      						<button type="button" className="btn-voice"></button>
      						<em className="bar"></em>
      						<span className="btn-search"><input type="submit" className="btn-submit" disabled={true} /></span>
      					</fieldset>
      				</form>
      			</div>

      			<div className="header-body_adv">
      				<div className="slider">
      					<ul>
      						<li><a href="http://www.pping.kr/cardinfo" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/bnr_header_card_rgt.png" alt="행복쇼핑이 드리는 특별한 신용카드 혜택" /></a></li>
      						{/*<li><a href="http//www.pping.kr/eventview/55/" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/bnr_header_coupon_rgt.png" alt="행복쇼핑이 재공하는 쿠폰 전체보기" /></a></li>*/}
      					</ul>
      				</div>
      				{/* <button type="button" className="btn-prev"><span className="ir">이전</span></button>
      				<button type="button" className="btn-next"><span className="ir">다음</span></button> */}
      			</div>
      		</div>

      		<div className="header-body_top">
      			<div className="header-body_top_body">
      				<button type="button" className="btn-favorite" onClick={this._addFavorite}>즐겨찾기</button>
      				<a href="http://minishop.wbp.pping.kr/join" target="_blank" className="btn-shop-join">입점신청</a>

      				<div className="header-body_top_info">
      					<strong className="cell user">{this.props.userName}<em>님</em> <a href="https://sso.pping.kr/logout" className="btn-log btn-logout">로그아웃</a></strong>

      					<span className="cell join"><a href="#">회원가입</a></span>

      					<div className="cell my">
      						<span className="tit">마이쇼핑 <i className="icon-angle-down"></i></span>
      						<ul className="sub">
      							<li><a href="http://mypage.minishop.pping.kr/main/order_check">구매·배송 조회</a></li>
      							<li><a href="http://mypage.minishop.pping.kr/main/cbe">취소·환불 조회</a></li>
      							<li className="contour"><a href="http://point.minishop.pping.kr/">해피 포인트</a></li>
      							<li><a href="http://event.minishop.pping.kr/main/coupon">할인 쿠폰</a></li>
      							<li className="contour"><a href="http://mypage.minishop.pping.kr/zzim">찜한 상품</a></li>
      							<li><a href="http://mypage.minishop.pping.kr/estimate">찜한 견적</a></li>
      							<li><a href="http://minishop.pping.kr/partner/?w_type=2&wm_type=1&wmm_type=2">찜한 쇼핑몰</a></li>
      						</ul>
      					</div>

      					<div className="cell servicecenter">
      						<span className="tit">고객센터 <i className="icon-angle-down"></i></span>
      						<ul className="sub">
      							<li><a href="http://help.minishop.pping.kr/">자주묻는 질문</a></li>
      							<li><a href="http://help.minishop.pping.kr/main/faq_write">1:1 문의하기</a></li>
      							<li><a href="http://help.minishop.pping.kr/main/support_notice">공지사항</a></li>
      							<li><a href="http://help.minishop.pping.kr/">환불/교환 안내</a></li>
      						</ul>
      					</div>

      					{/*
      					<div className="cell estimate">
      						<span className="tit">상품견적 <em className="cnt">99</em></span>
      						<div className="sub">
      							<ul>
      								<li>
      									<a href="#">
      										<div className="item-product_landscape">
      											<span className="thumb"><img src="//img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명" /></span>
      											<div className="item-product_landscape_info">
      												<span className="corpname">웰컴</span>
      												<span className="productname">PRIME B250M-A STCOM</span>
      											</div>
      										</div>
      									</a>
      								</li>
      								<li>
      									<a href="#">
      										<div className="item-product_landscape">
      											<span className="thumb"><img src="//img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명" /></span>
      											<div className="item-product_landscape_info">
      												<span className="corpname">웰컴</span>
      												<span className="productname">PRIME B250M-A STCOM</span>
      											</div>
      										</div>
      									</a>
      								</li>
      							</ul>

      							<a href="http://pc.pping.kr" target="_blank" className="btn-all-view">상품견적 전체보기 <i className="icon-angle-right"></i></a>
      						</div>
      					</div>

      					<div className="cell basket">
      						<span className="tit">장비구니 <em className="cnt">99</em></span>
      						<div className="sub">
      							<ul>
      								<li>
      									<a href="#">
      										<div className="item-product_landscape">
      											<span className="thumb"><img src="//img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명" /></span>
      											<div className="item-product_landscape_info">
      												<span className="corpname">웰컴</span>
      												<span className="productname">PRIME B250M-A STCOM</span>
      											</div>
      										</div>
      									</a>
      								</li>
      								<li>
      									<a href="#">
      										<div className="item-product_landscape">
      											<span className="thumb"><img src="//img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명" /></span>
      											<div className="item-product_landscape_info">
      												<span className="corpname">웰컴</span>
      												<span className="productname">PRIME B250M-A STCOM</span>
      											</div>
      										</div>
      									</a>
      								</li>
      							</ul>

      							<a href="http://minishop.pping.kr/main/cart/" className="btn-all-view">장바구니 전체보기 <i className="icon-angle-right"></i></a>
      						</div>
      					</div> */}
      				</div>
      			</div>
      		</div>
      	</div>

      	<div className="header-bot">
      		<div className="header-bot_body">

      			<div className="gnb">
      				<ul>
      					<li><a href="https://pc.pping.kr" target="_blank" className="btn-estimate">컴퓨터 견적</a></li>
      					<li><a href="https://notebook.pping.kr/" className="btn-notebook">노트북</a></li>
      					<li><a href="https://www.pping.kr/event">이벤트 &amp; 기획전</a></li>
      					<li><a href="http://stdpc.pping.kr" target="_blank">행쇼 표준PC</a></li>
      					<li><a href="http://talk.pping.kr/estpc" target="_blank">PC견적 상담</a></li>
      					<li><a href="http://talk.pping.kr/dauc" target="_blank">PC견적 입찰</a></li>
      					<li className="happyhotdeal"><a href="http://deal.pping.kr" className="btn-happyhotdeal"><span className="ir">행복핫딜</span></a></li>
      				</ul>
      			</div>

      			<div className="nav">
      				<div className="nav-category">
      					<h2 className="tit-h2">상품 분류 <i className="icon-angle-down"></i></h2>
      					<div className="sub">
      						<ul>
      							<li><a href="https://pping.kr/#realbestproduct" className="btn1">컴퓨터 주요부품</a></li>
      							<li><a href="https://pping.kr/#realbestproduct" className="btn2">컴퓨터 주변기기</a></li>
      							<li><a href="https://pping.kr/#realbestproduct" className="btn3">소프트웨어/전산소모품</a></li>
      							<li><a href="https://pping.kr/#realbestproduct" className="btn4">DSLR/디카/캠코더</a></li>
      							<li><a href="https://pping.kr/#realbestproduct" className="btn5">디지털 완제품</a></li>
      						</ul>
      					</div>
      				</div>

      			</div>
      		</div>
      	</div>

      </header>
    );
  }
}
