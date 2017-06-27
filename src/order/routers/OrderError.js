import React, {Component} from 'react'

import Utils from '../../utils/Utils'

export default class OrderError extends Component{
	state = {
		f_pay: null,		//결제방법 (1: 카드, 3: 가상계좌(에스크로), 5: 무통장 매매보호 (전자보증))
		text_pay: '',
		text_message: '',		// 오류 메시지
	}

	componentWillMount(){
		if(this.state.text_pay===''){
			this.setState({
				f_pay: parseInt(Utils.getParameter('f_pay'),10)
			});

			switch (parseInt(Utils.getParameter('f_pay'),10)) {
				default:
				case 1:
					this.setState({text_pay:"신용카드"});
					break;
				case 3:
					this.setState({text_pay:"가상계좌(에스크로)"});
					break;
				case 5:
					this.setState({text_pay:"무통장입금(전자보증)"});
					break;
			}
		}

		let msg = '알 수 없는 에러';
		if(window.sessionStorage){
			msg = window.sessionStorage.getItem("fail_message")? window.sessionStorage.getItem("fail_message"):msg;
		}
		this.setState({
			text_message: msg,
		});
		window.sessionStorage.removeItem("fail_message");
	}

	render(){
		return(
      <section className="order-body">
      	<div className="order-body-result">
      		<div className="order-body-result_view">
      			<div className="order-body_top">
      				<h2 className="tit-h2">주문실패</h2>
      				<ol>
      					<li><span>01</span> 장바구니</li>
      					<li><span>02</span> 주문/결제</li>
      					<li><strong><span>03</span> 주문실패</strong></li>
      				</ol>
      			</div>

      			<article className="order-body-result_main">
      				<h3 className="tit-h3">고객님의<span className="fail">주문이 실패</span>하였습니다!</h3>
      				<div className="box-board">
      					<table className="board thead-lft">
      						<caption><span>주문 정보</span></caption>
      						<colGroup>
      							<col style={{width:'150px'}}/>
      							<col/>
      						</colGroup>
      						<tbody>
										{
											this.state.f_pay?
	        						<tr>
	        							<th scope="row"><span>결제방법</span></th>
	        							<td>
	        								<div className="box-td">
	        									<strong>{this.state.text_pay}</strong>
	        								</div>
	        							</td>
	        						</tr>
											: null
										}
        						<tr>
        							<th scope="row"><span>실패사유</span></th>
        							<td>
        								<div className="box-td">
        									<strong>{this.state.text_message}</strong>
        								</div>
        							</td>
        						</tr>
                  </tbody>
      					</table>
      				</div>

      				<ul className="order-body-result_main_noti">
      					<li>ㆍ주문이 실패했습니다. 다시 결제하려면 하단의 <strong>다시 구매하기 버튼</strong>을 클릭해 주세요.</li>
      				</ul>

      				<div className="button-group ctr">
      					<a href="https://www.pping.kr" className="btn-continue-shopping">계속 쇼핑하기</a>
      					<a href="http://shopping.minishop.pping.kr/main/cart/" className="btn-repurchase">다시 구매하기</a>
      				</div>
      			</article>
      		</div>
      	</div>
      </section>
		);
	}
}
