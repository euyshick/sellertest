import React, {Component} from 'react'

import Utils from '../../utils/Utils'

// import '../../css/layers.css'
// import '../../css/order.css'

let DATA_STATUS = 0;

export default class OrderComplete extends Component{
  static defaultProps = {
    idx_member:window.IDX_MEMBER,
    apiUrl:window.API_URL+'/front/v1/order',
  }
  static propTypes = {
    idx_member: React.PropTypes.number.isRequired,
    apiUrl: React.PropTypes.string.isRequired,
  }

	state = {
		f_pay:0,		//1:카드, 3:가상계좌, 5:무통장
		banksData:[],
		price:0,
		date_pay:'2017년 3월 15일 00시',
		goods_price:0,
		price_deliv:0,
		coupon_use:0,
		point_use:0,
		deposit_use:0,
		total_point_use:0,
		nm_card:'',
		month_instmt:0,
		pay_num:'',

		data_Status_message:'',
	}

	componentWillMount(nextProps,nextState){
		if(DATA_STATUS!==1){
      const num_ord = parseInt(Utils.getParameter('num_ord'),10);
      Utils.request({
        url:this.props.apiUrl+'/complete/'+this.props.idx_member+'?num_ord='+num_ord,
        method:'post',
        body:{
  				idx_member:this.props.idx_member,
  				num_ord:num_ord,
  			}
      }).then(rsData=>{
        if(rsData.code!==200){
          DATA_STATUS = 2;
					this.setState({ data_Status_message : rsData.message });
          return;
        }

        DATA_STATUS = 1;
        const d = rsData.data.orderDetail;
				this.setState({
					num_ord:num_ord,
					total_point_use:d.point_use+d.deposit_use,
          price:d.price,
					point:d.point,
          date_pay:d.date_pay,
          name_bank:d.name_bank,
          pay_num:d.pay_num,
          nm_card:d.nm_card,
          month_instmt:d.month_instmt,
          goods_price:d.goods_price,
          price_deliv:d.price_deliv,
          coupon_use:d.coupon_use,
          f_pay:d.f_pay,
				});
      })
		}
	}

	render(){
    if(DATA_STATUS===0){
      return(
        <div style={{textAlign:'center',padding:'160px 0'}}>
          {/* 잠시만 기다려 주세요. */}
          <img src="//img.happyshopping.kr/img_static/img_pres/_v3/loading_w.gif" alt="" style={{
            position:'absolute',
            left:'50%',
            top:'50%',
            margin:'-20px 0 0 -20px'
          }}/>
        </div>
      )
    }

		if(DATA_STATUS===2){
      return(
        <section className="order-body">
					<div className="order-body-result">
						<div className="order-body-result_view" style={{float:'none',margin:'auto'}}>
		          <p style={{textAlign:'center',padding:'130px 0 80px'}}>{this.state.data_Status_message}</p>

							<article className="order-body-result_main">
			          <div className="button-group ctr">
			            <a href="//www.pping.kr" className="btn-continue-shopping">계속 쇼핑하기</a>
			            <a href="http://mypage.minishop.pping.kr/main/order_check" className="btn-shopping-history">구매내역 확인</a>
			          </div>
							</article>
						</div>
					</div>
        </section>
      )
    }

		return(
			<section className="order-body">
				<div className="order-body-result">
					<div className="order-body-result_view">
						<div className="order-body_top">
							<h2 className="tit-h2">주문완료</h2>
							<ol>
								<li><span>01</span> 장바구니</li>
								<li><span>02</span> 주문/결제</li>
								<li><strong><span>03</span> 결제완료</strong></li>
							</ol>
						</div>

						<article className="order-body-result_main">
						{
							this.state.f_pay===1?
							<h3 className="tit-h3"><span>구매가 정상적으로 완료</span>되었습니다!</h3>
							: null
						}
						{
							this.state.f_pay===3||this.state.f_pay===5?
							<h3 className="tit-h3"><span>주문이 정상적으로 접수</span>되었습니다!</h3>
							: null
						}
						{
							this.state.f_pay!==1?
							<div className="box-board">
								<table className="board thead-lft">
									<caption><span>주문 정보</span></caption>
									<colGroup>
										<col style={{width:'150px'}}/>
										<col/>
									</colGroup>
									<tbody>
									<tr>
										<th scope="row"><span>입금하실 금액</span></th>
										<td>
											<div className="box-td">
												<strong className="deposit-amount">{Utils.comma(this.state.price)}<em>원</em></strong> ({this.state.date_pay} 까지) {/*(2017년 3월 15일 00시 까지)*/}
											</div>
										</td>
									</tr>
									<tr>
										<th scope="row"><span>입금은행</span></th>
										<td>
											<div className="box-td">
												<strong>{this.state.name_bank}</strong>
												{/* <a href="#" target="_blank" className="btn-ibaak">인터넷 뱅킹 바로가기</a> */}
											</div>
										</td>
									</tr>
									<tr>
										<th scope="row"><span>입금계좌</span></th>
										<td>
											<div className="box-td">
												<strong><span className="ls-nor">{this.state.pay_num.split(' ')[0]}</span> (예금주: {this.state.pay_num.split(' ')[1]})</strong>
											</div>
										</td>
									</tr>
									</tbody>
								</table>
							</div>
							:
							<div className="box-board">
								<table className="board thead-lft">
									<caption><span>주문 정보</span></caption>
									<colGroup>
										<col style={{width:'150px'}}/>
										<col/>
									</colGroup>
									<tbody>
										<tr>
											<th scope="row"><span>신용카드</span></th>
											<td>
												<div className="box-td">
													<strong className="cardname">{this.state.nm_card}</strong>
												</div>
											</td>
										</tr>
										<tr>
											<th scope="row"><span>할부</span></th>
											<td>
												<div className="box-td">
													<strong>{this.state.month_instmt===0?'일시불':this.state.month_instmt+'개월'}</strong>
												</div>
											</td>
										</tr>
								  </tbody>
								</table>
							</div>
						}

							<div className="box-board">
								<table className="board thead-lft">
									<caption><span>주문 금액</span></caption>
									<colGroup>
										<col style={{width:'150px'}}/>
										<col/>
									</colGroup>
									<tbody>
									<tr>
										<th scope="row" rowSpan="5"><span>주문번호<br/><em className="ordercode">{this.state.num_ord}</em></span></th>
										<td className="sum">
											<div className="box-td">
												<div className="price sum">
													<strong className="price_t price_total">총 결제금액</strong>

													<strong className="price_price">
														{/* <span className="price_price_save">총 절약금액 <em>5,980</em>원</span> */}<span className="price_price_sum">{Utils.comma(this.state.price)}<em>원</em></span>
													</strong>
												</div>
												{
													this.state.point?
	                        <div className="earn-point">
	                          <strong>상품 구매 시 해피포인트 <span>{Utils.comma(this.state.point)}P</span> 적립</strong>
	                        </div>
													: null
												}
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="box-td">
												<div className="price">
													<strong className="price_t">총 상품금액</strong>
													<strong className="price_price">
														<span className="price_price_sum">{Utils.comma(this.state.goods_price)}<em>원</em></span>
													</strong>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="box-td">
												<div className="price">
													<strong className="price_t">배송비</strong>
													<strong className="price_price">
														<span className="price_price_sum">{Utils.comma(this.state.price_deliv)}<em>원</em></span>
													</strong>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="box-td">
												<div className="price">
													<strong className="price_t">쿠폰 할인 금액</strong>
													<strong className="price_price">
														{/* <!-- 0원일때 ico-minus 없음 --> */}
														<span className={this.state.coupon_use===0?"price_price_sum":"price_price_sum ico-minus"}>{Utils.comma(this.state.coupon_use)}<em>원</em></span>
													</strong>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div className="box-td">
												<div className="price">
													<strong className="price_t">해피포인트ㆍ예치금 사용</strong>
													<strong className="price_price">
														{/* <!-- 0원일때 ico-minus 없음 --> */}
														<span className={this.state.total_point_use===0?"price_price_sum":"price_price_sum ico-minus"}>{Utils.comma(this.state.total_point_use)}<em>원</em></span>
													</strong>
												</div>
											</div>
										</td>
									</tr>
									</tbody>
								</table>
							</div>

							<ul className="order-body-result_main_noti">
								<li>ㆍ자세한 구매내역 확인 및 문자발송, 배송지 변경 등의 서비스는 사이트 우측 상단의 <a href="http://mypage.minishop.pping.kr/main/order_check">마이페이지 &gt; 구매내역</a>에서 이용 가능합니다.</li>
								{this.state.f_pay!==1?
								<li>ㆍ입금하실 해당 은행을 확인하시고 입금해 주세요. 입금 확인되면 주문이 정상적으로 처리됩니다.</li>
								: null
								}
							</ul>

							<div className="button-group ctr">
								<a href="//www.pping.kr" className="btn-continue-shopping">계속 쇼핑하기</a>
								<a href="http://mypage.minishop.pping.kr/main/order_check" className="btn-shopping-history">구매내역 확인</a>
							</div>
						</article>

						{/* <!-- 가로 하단 배너 -->
						<div className="order-body-result_bnr">
							<Link to={'#'}><img src="http://img.happyshopping.kr/img_static/img_pres/_v3/bnr_order_result.jpg" alt="배너"/></Link>
						</div>
						<!-- // 가로 하단 배너 --> */}

						{/* <div className="order-body-result_bot">
							<!-- 최근 본 상품 -->
							<div className="product-lately">
								<h3 className="tit-h3">최근 본 상품</h3>

								<div className="product-lately_product">
									<ul>
										<li className="active">
											<div className="item-product_landscape">
												<span className="thumb"><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명"/></span>
												<div className="item-product_landscape_info">
													<span className="productname">PRIME B250M-A STCOM</span>
													<span className="price">
														<em>최저</em>
														<strong className="price_type_price">121,000</strong>원
													</span>
													<Link to={'#'} className="btn-detail">상세보기</Link>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_landscape">
												<span className="thumb"><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명"/></span>
												<div className="item-product_landscape_info">
													<span className="productname">PRIME B250M-A STCOM</span>
													<span className="price">
														<em>최저</em>
														<strong className="price_type_price">121,000</strong>원
													</span>
													<Link to={'#'} className="btn-detail">상세보기</Link>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_landscape">
												<span className="thumb"><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명"/></span>
												<div className="item-product_landscape_info">
													<span className="productname">PRIME B250M-A STCOM</span>
													<span className="price">
														<em>최저</em>
														<strong className="price_type_price">121,000</strong>원
													</span>
													<Link to={'#'} className="btn-detail">상세보기</Link>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_landscape">
												<span className="thumb"><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_1449000/img_1448592/200.jpg" alt="상품명"/></span>
												<div className="item-product_landscape_info">
													<span className="productname">PRIME B250M-A STCOM</span>
													<span className="price">
														<em>최저</em>
														<strong className="price_type_price">121,000</strong>원
													</span>
													<Link to={'#'} className="btn-detail">상세보기</Link>
												</div>
											</div>
										</li>
									</ul>

									<button type="button" className="btn-prev"><span className="ir">이전</span></button>
									<button type="button" className="btn-next"><span className="ir">다음</span></button>
								</div>

								<div className="product-lately_recom">
									<h4 className="tit-h4">이런 상품 어때요?</h4>
									<div className="product-lately_recom_list">
										<ul>
											<li>
												<div className="item-product_228 happytree">
													<div className="thumb">
														<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
														<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
													</div>
													<div className="item-product_conts">
														<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

														<div className="price">
															<div className="price_type2">
																<span className="vm">
																	<em>최저</em> <strong className="price_type_price">112,000</strong>원
																</span>
																<button type="button" className="btn-add-to">
																	<span>상품견적 담기</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</li>
											<li>
												<div className="item-product_228">
													<div className="thumb">
														<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
														<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
													</div>
													<div className="item-product_conts">
														<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

														<div className="price">
															<div className="price_type2">
																<span className="vm">
																	<em>최저</em> <strong className="price_type_price">112,000</strong>원
																</span>
																<button type="button" className="btn-add-to">
																	<span>상품견적 담기</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</li>
											<li>
												<div className="item-product_228">
													<div className="thumb">
														<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
														<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
													</div>
													<div className="item-product_conts">
														<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

														<div className="price">
															<div className="price_type2">
																<span className="vm">
																	<em>최저</em> <strong className="price_type_price">112,000</strong>원
																</span>
																<button type="button" className="btn-add-to">
																	<span>상품견적 담기</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</li>
											<li>
												<div className="item-product_228">
													<div className="thumb">
														<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
														<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
													</div>
													<div className="item-product_conts">
														<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

														<div className="price">
															<div className="price_type2">
																<span className="vm">
																	<em>최저</em> <strong className="price_type_price">112,000</strong>원
																</span>
																<button type="button" className="btn-add-to">
																	<span>상품견적 담기</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</li>
										</ul>

										<button type="button" className="btn-prev"><span className="ir">이전</span></button>
										<button type="button" className="btn-next"><span className="ir">다음</span></button>
									</div>
								</div>
							</div>
							<!-- // 최근 본 상품 -->

							<!-- 장바구니 상품 -->
							<div className="product-basket">
								<h3 className="tit-h3"><span><strong>홍길동</strong>님의</span> 장바구니 상품</h3>

								<div className="product-basket_list">
									<ul>
										<li>
											<div className="item-product_228 happytree">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>

								<div className="product_paging">
									<Link to={'#'} className="btn-round">장바구니</Link>
									<div className="paging-number">
										<span className="paging-number_cnt"><strong>1</strong>/10</span>
										<button type="button" className="btn-prev"><span className="ir">이전</span></button>
										<button type="button" className="btn-next"><span className="ir">다음</span></button>
									</div>
								</div>
							</div>
							<!-- // 장바구니 상품 -->

							<!-- 찜한 상품 -->
							<div className="product-fork">
								<h3 className="tit-h3">찜한 상품</h3>

								<div className="product-fork_list">
									<ul>
										<li>
											<div className="item-product_228 happytree">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228 happytree">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div className="item-product_228 happytree">
												<div className="thumb">
													<Link to={'#'}><img src="http://img.happyshopping.kr/img_shopping/img_goods/img_964000/img_963934/200.jpg" alt="상품명"/></Link>
													<button type="button" className="btn-happytree"><span className="ir">해피트리</span></button>
												</div>
												<div className="item-product_conts">
													<span className="corpname">티유피씨</span>
													<Link to={'#'} className="productname">인텔 코어 I5-7세대 7600 (카비레이크) (정품)</Link>

													<div className="price">
														<span className="price_type1"><strong className="price_type_price">129,000</strong>원</span>
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>

								<div className="product_paging">
									<Link to={'#'} className="btn-round">찜한 상품</Link>
									<div className="paging-number">
										<span className="paging-number_cnt"><strong>1</strong>/10</span>
										<button type="button" className="btn-prev"><span className="ir">이전</span></button>
										<button type="button" className="btn-next"><span className="ir">다음</span></button>
									</div>
								</div>
							</div>
							<!-- // 찜한 상품 -->
						</div> */}
					</div>

					{/* <!-- aside -->
					<div className="aside">
						우측 어사이드
					</div>
					<!-- // aside --> */}
				</div>
			</section>
		);
	}
}
