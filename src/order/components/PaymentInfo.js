import React, { Component } from 'react'
import { Link } from 'react-router'

import Utils from '../../utils/Utils'
import Datepicker from '../../utils/Datepicker'

let DATA_STATUS = false;

export default class PaymentInfo extends Component{
  static defaultProps ={
    memberName:'',
    memberBirthday:'',
    memgerGender:1,
    memberPoint:0,
    memberDeposit:0,
    memberCoupon:0,
    memberBanks:[],
    paymentsInfo:{},
    managerBankInfo:[],
    f_pay:1,
    f_issue:0,
    f_div_cash_receipt:0,
    f_trans:1,
    //deliv_price_total:0,
    deliv_price_add:0,

  }
  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    memberName: React.PropTypes.string,
    memberBirthday: React.PropTypes.string,
    memgerGender: React.PropTypes.number,
    memberPoint: React.PropTypes.number,
    memberDeposit: React.PropTypes.number,
    //memberCoupon: React.PropTypes,
    memberBanks: React.PropTypes.array,
    paymentsInfo: React.PropTypes.object.isRequired,
    managerBankInfo: React.PropTypes.array.isRequired,
    //couponrslt: React.PropTypes.string.isRequired,

    f_pay: React.PropTypes.number,
    f_issue: React.PropTypes.number,
    f_div_cash_receipt: React.PropTypes.number,
    f_trans: React.PropTypes.number,
    //deliv_price_total: React.PropTypes.number,
    deliv_price_add: React.PropTypes.number,
  }
  state = {
    f_pay: this.props.f_pay,   //결제방법. 1: 카드, 3: 가상계좌(에스크로), 5: 무통장 매매보호 (전자보증)
    usePoint:0,         // 사용한 해피포인트
    disablePoint:true,  // 해피포인트 사용 가능여부
    useDeposit:0,       // 사용한 예치금
    //deliv_price_total:this.props.paymentsInfo.deliv_price_total,
    totalCharge: null,
    banksData:[],     // 은행 전체 데이터
    name_pay: this.props.memberName,
    usafe_birthday: this.props.memberBirthday,
    usafe_gender: this.props.memberGender,
    f_refund: 0,
    f_issue: this.props.f_issue,
    f_div_cash_receipt: this.props.f_div_cash_receipt,
    memberCoupon: null, //this.props.couponDiscount,
    num_issue_0: '010',
    num_issue_1: '',
    num_issue_2: '',
    refund_bank_name:'',
    refund_bank_code:null,
    refund_bank_num:'',
    point_total: this.props.paymentsInfo.point_total,     // 총 적립 포인트

    refundBankVisible:false,    // 계좌번호 입력 보이기
  }

  constructor(props) {
    super(props);

    this._changePayMethod = this._changePayMethod.bind(this);
    this._usePoint = this._usePoint.bind(this);
    this._shopAccountLists = this._shopAccountLists.bind(this);
    this._userAccounts = this._userAccounts.bind(this);
    this._banksList = this._banksList.bind(this);
  }

  componentWillMount(nextProps, nextState){
    // 포인트,예치금 사용에 영향 받지 않는 사용자 최종 결제 금액 설정
    if(!this.totalCharged){
      this.setState({
        totalCharged:this.props.paymentsInfo.total+this.props.paymentsInfo.deliv_price_total+this.props.deliv_price_add-this.props.memberCoupon,
      });
    }

    // 총 상품 가격 10만원이상이고 포인트 천원 이상일 때 해피포인트 사용 가능
    if(this.props.paymentsInfo.total >= 100000 && this.props.memberPoint >= 1000){
      this.setState({
        disablePoint: false
      });
    }
  }

  componentWillUpdate(nextProps,nextState){
    if(this.props.f_pay !== nextProps.f_pay){
      this.setState({ f_pay: nextProps.f_pay })
    }

    // 환불계좌 선택 select 데이터 받아오기
    if(nextState.f_refund === 2 && !DATA_STATUS){
      Utils.request({
        url:this.props.apiUrl+'/banks',
        method:'post',
        body:{f_trans:3},
      }).then(rsData=>{
        DATA_STATUS = true;
        this.setState({
          banksData: rsData.data.banks
        });

        if(this.props.memberBanks.length===0){
          this.setState({
            refund_bank_code: parseInt(rsData.data.banks[0].id_bank,10)
          });
        }
      })
    }

    // 쿠폰 발행 여부 상태 파악 (단일 쿠폰 임시처리)
    if(this.state.memberCoupon===null){
      this.setState({ memberCoupon: this.props.couponDiscount });
    }

    // 배송방법 변경, 쿠폰, 예치금, 포인트 사용시 총 결제금액 변경
    if(this.props.f_trans !== nextProps.f_trans
      || this.state.useDeposit !== nextState.useDeposit
      || this.state.usePoint !== nextState.usePoint
      || this.state.memberCoupon !== nextState.memberCoupon
      || this.props.deliv_price_add !== nextProps.deliv_price_add
    ){

      let v = this.props.paymentsInfo.total - nextState.memberCoupon - nextState.useDeposit - nextState.usePoint;
      if(nextProps.f_trans===1){// 택배 배송 일 경우에 배송비가 붙고 나머지는 직접수령 혹은 무료
        v += (this.props.paymentsInfo.deliv_price_total+nextProps.deliv_price_add);
      }

      this.setState({ totalCharge: v, });
      this.props._updateState({ pay_total: v });
    }else{

    }

    //무통장 입금자명
    if(this.state.name_pay !== nextState.name_pay){
      this.props._updateState({ name_pay: nextState.name_pay });
    }
    if(this.state.usafe_gender !== nextState.usafe_gender){
      this.props._updateState({ usafe_gender: nextState.usafe_gender });
    }

    // 입금계좌 변경
    if(this.state.bank_index !== nextState.bank_index){
      this.props._updateState({
        bank_index: nextState.bank_index,
      });
    }

    // 환불방법
    if(this.state.f_refund !== nextState.f_refund){
      this.props._updateState({ f_refund: nextState.f_refund });
    }

    // 환불계좌 변경
    if(this.state.refund_bank_index !== nextState.refund_bank_index){
      this.props._updateState({
        refund_bank_index: nextState.refund_bank_index,
      });
    }

    // 증빙서류 발행여부
    if(this.state.f_issue !== nextState.f_issue){
      this.props._updateState({
        f_issue: nextState.f_issue,
      });
    }

    // 현금영수증 발급 종류
    if(this.state.f_div_cash_receipt !== nextState.f_div_cash_receipt){
      this.props._updateState({
        f_div_cash_receipt: nextState.f_div_cash_receipt,
      });
      this.setState({
        num_issue_0: '',
        num_issue_1: '',
        num_issue_2: '',
      });
    }
  }

  componentDidUpdate(prevProps, prevState){
    // 결제 방법 변경
    if(this.state.f_pay !== prevState.f_pay){
      this.props._updateState({ f_pay: this.state.f_pay });
    }

    // 포인트 사용
    if(this.state.usePoint !== prevState.usePoint){
      this.props._updateState({ point_use: this.state.usePoint });
    }
    // 예치금 사용
    if(this.state.useDeposit !== prevState.useDeposit){
      this.props._updateState({ deposit_use: this.state.useDeposit });
    }
    // 입금 예정일 변경
    if(prevState.date_pay !== this.state.date_pay){
      this.props._updateState({ date_pay: this.state.date_pay });
    }

    // 생년월일 변경
    if(prevState.usafe_birthday !== this.state.usafe_birthday){
      this.props._updateState({ usafe_birthday: this.state.usafe_birthday });
    }

    // 현금영수증 발급 데이터
    if(prevState.num_issue_0 !== this.state.num_issue_0){
      this.props._updateState({
        num_issue_0: this.state.num_issue_0
      });
    }
    if(prevState.num_issue_1 !== this.state.num_issue_1){
      this.props._updateState({
        num_issue_1: this.state.num_issue_1
      });
    }
    if(prevState.num_issue_2 !== this.state.num_issue_2){
      this.props._updateState({
        num_issue_2: this.state.num_issue_2
      });
    }

    // 환불 계좌
    if(prevState.refund_bank_name !== this.state.refund_bank_name){
      this.props._updateState({ refund_bank_account_name: this.state.refund_bank_name });
    }
    if(prevState.refund_bank_num !== this.state.refund_bank_num){
      this.props._updateState({ refund_bank_account_num: this.state.refund_bank_num });
    }
    if(prevState.refund_bank_code !== this.state.refund_bank_code){
      this.props._updateState({ refund_bank_code: this.state.refund_bank_code });
    }

    //추가
    if(this.props.f_trans !== prevProps.f_trans){
      this._calPoint();
      this._calDeposit();
    }
    //추가
  }

  _changePayMethod = (e) => {
     this.setState({ f_pay: parseInt(e.target.value,10) });
  }

  // 포인트 추가
  _calPoint = ()=>{
    let val = document.getElementsByName('usePoint')[0].value;
    let value = parseInt(val.replace(/,/gi,''),10);
    if(value >= this.state.totalCharged-this.state.useDeposit){
      value = this.state.totalCharged-this.state.useDeposit;
    }

    if(value > this.props.memberPoint){
      value = this.props.memberPoint;
    }

    let limitUse = this.props.paymentsInfo.total;
    if(this.props.f_trans === 1){
      if(this.props.paymentsInfo.deliv_price_total !== undefined){
        limitUse += this.props.paymentsInfo.deliv_price_total;
      }

      if(this.props.paymentsInfo.deliv_price_add !== undefined){
        limitUse += this.props.paymentsInfo.deliv_price_add;
      }
    }

    if(this.state.useDeposit !== undefined){
        limitUse -= this.state.useDeposit;
    }

    if(value > limitUse){
      value = limitUse;
    }

    if(value < 0){
      value = 0;
    }

    this.setState({
      usePoint: value,
    });
  };
  // 포인트 추가

// 예치금 추가
_calDeposit = ()=>{
  let val = document.getElementsByName('useDeposit')[0].value;
  let value = parseInt(val.replace(/,/gi,''),10);
  if(value >= this.state.totalCharged-this.state.usePoint){
    value = this.state.totalCharged-this.state.usePoint;
  }

  if(value > this.props.memberDeposit){
    value = this.props.memberDeposit;
  }

  let limitUse = this.props.paymentsInfo.total;
  if(this.props.f_trans === 1){
    if(this.props.paymentsInfo.deliv_price_total !== undefined){
      limitUse += this.props.paymentsInfo.deliv_price_total;
    }

    if(this.props.paymentsInfo.deliv_price_add !== undefined){
      limitUse += this.props.paymentsInfo.deliv_price_add;
    }
  }

  if(this.state.usePoint !== undefined){
      limitUse -= this.state.usePoint;
  }

  if(value > limitUse){
    value = limitUse;
  }

  if(value < 0){
    value = 0;
  }

  this.setState({
    useDeposit: value,
  });
};
// 예치금 추가

  _usePoint = (e) => {
    if(e.target.nodeName.toLowerCase() === 'input'){
      let value = parseInt(e.target.value.replace(/,/gi,''),10);
      if(isNaN(parseInt(value,10))) return;

      if(e.target.name === "usePoint"){
        //추가
        this._calPoint();
        //추가
      } else if(e.target.name === "useDeposit"){
        //추가
        this._calDeposit();
        //추가
      }
    } else if(e.target.nodeName.toLowerCase() === 'button'){
      if(this.state.totalCharge===0) return;

      if(e.target === this.refs.inputPoint){
        let _use_point = this.props.memberPoint;

        if(_use_point > this.state.totalCharged - this.state.useDeposit){
          if( _use_point - this.state.totalCharged >= 0){
            _use_point = this.state.totalCharged - this.state.useDeposit;
          } else {
            _use_point = 0;
          }
        }

        //추가
        let limitUse = this.props.paymentsInfo.total;
        if(this.props.f_trans === 1){
          if(this.props.paymentsInfo.deliv_price_total !== undefined){
            limitUse += this.props.paymentsInfo.deliv_price_total;
          }

          if(this.props.paymentsInfo.deliv_price_add !== undefined){
            limitUse += this.props.paymentsInfo.deliv_price_add;
          }
        }

        if(this.state.useDeposit !== undefined){
            limitUse -= this.state.useDeposit;
        }

        if(_use_point > limitUse){
          _use_point = limitUse;
        }
        //추가

        this.setState({
          usePoint: _use_point,
        });
      } else if(e.target === this.refs.inputDepoint){
        let _use_deposit = this.props.memberDeposit;

        if(_use_deposit > this.state.totalCharged - this.state.usePoint){
          if( _use_deposit - this.state.totalCharged >= 0){
            _use_deposit = this.state.totalCharged - this.state.usePoint;
          } else {
            _use_deposit = 0;
          }
        }

        //추가
        let limitUse = this.props.paymentsInfo.total;
        if(this.props.f_trans === 1){
          if(this.props.paymentsInfo.deliv_price_total !== undefined){
            limitUse += this.props.paymentsInfo.deliv_price_total;
          }

          if(this.props.paymentsInfo.deliv_price_add !== undefined){
            limitUse += this.props.paymentsInfo.deliv_price_add;
          }
        }

        if(this.state.usePoint !== undefined){
            limitUse -= this.state.usePoint;
        }

        if(_use_deposit > limitUse){
          _use_deposit = limitUse;
        }
        //추가

        this.setState({
          useDeposit: _use_deposit,
        });
      }
    }
  }

  _shopAccountLists = () => {
    if(this.props.managerBankInfo.length > 0){
      return this.props.managerBankInfo.map((data,index) => {
        return(<option key={data.pr_idx} value={index}>{data.bank_name+" : "+data.num_bank}</option>);
      });
    } else {
      return(<option>입금 가능한 계좌가 없습니다</option>);
    }
  }

  _userAccounts = () => {
    if(this.props.memberBanks.length > 0){
      return this.props.memberBanks.map((data,index) => {
        return(<option key={index} value={index}>{data.name_bank+" : "+data.num_bank}</option>);
      });
    } else {
      return(<option>환불 가능한 계좌가 없습니다</option>);
    }
  }

  _banksList = () => {
    if(this.state.banksData.length > 0){
      return this.state.banksData.map((data)=>{
        return(<option key={data.id_bank} value={data.id_bank}>{data.name_bank}</option>);
      });
    } else {
      return(<option>은행 선택</option>);
    }
  }

  render(){
    return(
      <article className="order-body_row" id="areaPayment">
      	<h3 className="tit-h3">결제정보</h3>

      	<div className="box-board">
      		<table className="board thead-lft">
      			<caption><span>결제정보</span></caption>
      			<colGroup>
      				<col style={{width:'150px'}}/>
      				<col/>
      			</colGroup>
      			<tbody>
        			<tr>
        				<th scope="row"><span>총 상품가격</span></th>
        				<td>
        					<div className="box-td">
        						<strong className="payment-amount"><span>{Utils.comma(this.props.paymentsInfo.total)}</span>원</strong>
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row"><span>배송비</span></th>
        				<td>
        					<div className="box-td">
                    {
                      this.props.f_trans === 1?
                      <strong className="payment-amount"><span>{Utils.comma(this.props.paymentsInfo.deliv_price_total+this.props.deliv_price_add)}</span>원</strong>:null
                    }
                    {
                      this.props.f_trans===3 || this.props.f_trans===6?
                      <strong className="payment-amount">착불</strong>:null
                    }
                    {
                      this.props.f_trans===4?
                      <strong className="payment-amount">직접수령</strong>:null
                    }
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row"><span>쿠폰 할인 금액</span></th>
        				<td>
        					<div className="box-td">
        						<strong className="payment-amount ico-minus"><span>{Utils.comma(this.state.memberCoupon)}</span>원</strong>
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row">
        					<span>해피포인트</span>
        					<button type="button" className="btn-question-tip btn-happypoint"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/ico_question.png" alt="안심번호"/></button>

        					<div className="tooltip layer-happypoint">
        						<h4 className="tit-h4">해피포인트란?</h4>
        						<p>구매확정 또는 이벤트 참여시 제공되는 무상포인트 혜택입니다.<br/>상품 구매 합계액이 100,000 원 이상이고, 보유잔액이 1,000 포인트<br/>이상인 경우 상품 구매시 현금처럼 사용하실 수 있습니다.</p>
        					</div>
        				</th>
        				<td>
        					<div className="box-td">
        						<span className="ico-minus point-input">
        							<input type="text" value={this.state.usePoint?Utils.comma(this.state.usePoint):'0'} title="사용 해피포인트" className="istyle" style={{width:'120px'}}
                        name="usePoint"
                        disabled={this.state.disablePoint}
                        onChange={this._usePoint}
                        ref={ref=>this.inputPoint=ref}/> P
        						</span><span className="point-info">
                      {
                        this.state.disablePoint?
                        <button type="button" className="btn-point-alluse">전체 사용</button> :
                        <button type="button" className="btn-point-alluse on" onClick={this._usePoint} ref="inputPoint">전체 사용</button>
                      }
                      사용가능한 포인트 <strong><em>{Utils.comma(this.props.memberPoint)}</em>P</strong>
        						</span>
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row"><span>예치금</span></th>
        				<td>
        					<div className="box-td">
        						<span className="ico-minus point-input">
        							<input type="text" value={this.state.useDeposit?Utils.comma(this.state.useDeposit):'0'} title="사용 예치금" className="istyle" style={{width:'120px'}}
                        name="useDeposit"
                        disabled={this.props.memberDeposit===0?true:false}
                        onChange={this._usePoint}
                        ref={ref=>this.inputDepoint=ref}/> 원
        						</span><span className="point-info">
                      {
                        this.props.memberDeposit > 0 ?
                         <button type="button" className="btn-point-alluse on" onClick={this._usePoint} ref="inputDepoint">전체 사용</button> :
                         <button type="button" className="btn-point-alluse">전체 사용</button>
                      }
                      보유예치금 <strong><em>{Utils.comma(this.props.memberDeposit)}</em>원</strong>
        						</span>
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row"><span>총결제금액</span></th>
        				<td>
        					<div className="box-td">
        						<strong className="payment-amount">
                      <span className="point_color">{Utils.comma(this.state.totalCharge)}</span>원&nbsp;
                      {
                        this.state.point_total?
                        <span className="earn_point">(상품 구매시 해피포인트 <strong className="point_color">{Utils.comma(parseInt(this.state.point_total,10))}<em>P</em></strong> 적립)</span>
                        : null
                      }
                    </strong>
        					</div>
        				</td>
        			</tr>
        			<tr>
        				<th scope="row" className="vt"><span>결제방법</span></th>
        				<td>
        					<div className="box-td">
        						<div className="payment-method">
        							<ul className="igroup">
                        {
                          this.props.f_type===1?
          								<li>
          									<span className="iradio">
          										<input type="radio" id="id-pay1" name="name3" value="1"
                                checked={this.state.f_pay===1}
                                onChange={this._changePayMethod}
                              />
          										<label htmlFor="id-pay1"><em>신용카드</em></label>
          									</span>
          								</li>
                          : null
                        }
                        {
                          this.props.f_safe===1?
          								<li>
          									<div className="iradio">
          										<input type="radio" id="id-pay2" name="name3" className="escrow-tooltip" value="3"
                                checked={this.state.f_pay===3}
                                onChange={this._changePayMethod}
                              />
          										<label htmlFor="id-pay2"><em>가상계좌(에스크로)</em></label>

          										<div className="tooltip layer-escrow">
          											<h4 className="tit-h4">서비스 안내</h4>
          											<ul>
          												<li>- 주문 시 부여된 1회성 가상계좌로 주문 금액을 입금해 주시면<br/><span className="gap">구매가 완료됩니다.</span></li>
          												<li>- 에스크로를 통하여 안전거래를 보장하고 있습니다.</li>
          											</ul>
          										</div>
          									</div>
          								</li>
                          : null
                        }
                        {
                          this.props.f_safe===2||this.props.f_safe===3?
          								<li>
          									<div className="iradio">
          										<input type="radio" id="id-pay3" name="name3" className="nbankbook-tooltip" value="5"
                                checked={this.state.f_pay===5}
                                onChange={this._changePayMethod}
                              />
          										<label htmlFor="id-pay3"><em>무통장입금(전자보증)</em></label>

          										<div className="tooltip layer-nbankbook">
          											<h4 className="tit-h4">서비스 안내</h4>
          											<ul>
          												<li>- 계좌를 선택한 후 주문 금액을 입금해 주시면 구매가 완료됩니다.</li>
          												<li>- 전자보증을 통하여 안전거래를 보장하고 있습니다.</li>
          											</ul>
          										</div>
          									</div>
          								</li>
                          : null
                        }
        							</ul>

                      {
                        this.state.f_pay === 1 ?
            							<div className="payment-method_detail">
            								<div className="creditcard">
            									<Link to={"http://www.pping.kr/cardinfo"} target="_blank" className="btn-inst-benefit">무이자할부 혜택<i className="icon-chevron-right"></i></Link>
            								</div>
            							</div>
                        : null
                      }

                      {
                        this.state.f_pay === 5 ?
                          <div className="payment-method_detail">
                          	<div className="nbankbook">
                          		<ul>
                          			<li>
                          				<label htmlFor="id-bankk" className="t">입금은행</label>
                          				<select id="id-bankk" className="sstyle" style={{width:'220px'}}
                                    onChange={(e)=>{
                                      const v = parseInt(e.target.value,10);
                                      this.setState({ bank_index: v });
                                    }}
                                  >
                                    {this._shopAccountLists()}
                          				</select>

                          				<strong className="nbankbook_noti"><span>반드시 선택하신 은행의 전자보증 전용계좌로 입금</span>하셔야 매매보호가 성립</strong>
                          			</li>
                          			<li>
                          				<label htmlFor="id-bankowner" className="t">입금자명</label>
                          				<input type="text" id="id-bankowner" className="istyle" style={{width:'150px'}}
                                    value={this.state.name_pay}
                                    onChange={(e)=>{ this.setState({ name_pay: e.target.value }) }}
                                  />

                          				<span className="calendar">
                          					<label htmlFor="id-deposit">입금예정일</label>
                                    <Datepicker
                                      id="id-deposit"
                                      className="istyle num"
                                      style={{left:'65px'}}   //input 왼쪽에 label width
                                      eventChange={(value)=>{
                                        this.setState({ date_pay: value });
                                      }}
                                    />
                          				</span>
                                  {
                                    this.props.check_validation_payment['date_pay']!==0?
                                      this.props.check_validation_payment['date_pay']===1?
                                      <span className="alert-msg fail" style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>입금예정일을 입력해 주세요.</span>
                                      :
                                      <span className="alert-msg fail" style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>입금예정일을 확인해 주세요.</span>
                                    : null
                                  }
                          			</li>
                          			<li>
                          				<span className="t">전자보증 필수사항</span>

                          				<span className="iradio">
                          					<input type="radio" id="id-male" name="name-gender" value="1"
                                      checked={this.state.usafe_gender===1}
                                      onChange={ (e) => { this.setState({ usafe_gender: parseInt(e.target.value,10) }); } }
                                    />
                          					<label htmlFor="id-male"><em>남성</em></label>
                          				</span>
                          				<span className="iradio" style={{marginLeft:'20px'}}>
                          					<input type="radio" id="id-female"  name="name-gender" value="2"
                                      checked={this.state.usafe_gender===2}
                                      onChange={ (e) => { this.setState({ usafe_gender: parseInt(e.target.value,10) }); } }
                                    />
                          					<label htmlFor="id-female"><em>여성</em></label>
                          				</span>

                          				<span className="calendar">
                          					<label htmlFor="id-birth">생년월일</label>
                                    <Datepicker
                                      id="id-birth"
                                      className="istyle num"
                                      defaultValue={this.state.usafe_birthday}
                                      style={{left:'54px'}}   //input 왼쪽에 label width
                                      eventChange={(value)=>{
                                        this.setState({ usafe_birthday: value });
                                      }}
                                    />
                          				</span>
                                  {
                                    this.props.check_validation_payment['usafe_birthday']!==0?
                                      this.props.check_validation_payment['usafe_birthday']===1?
                                      <span className="alert-msg fail" style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>생년월일을 입력해 주세요.</span>
                                      :
                                      <span className="alert-msg fail" style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>생년월일을 확인해 주세요.</span>
                                    : null
                                  }
                          			</li>
                          		</ul>
                          	</div>
                          </div>
                        : null
                      }
        						</div>
        					</div>
        				</td>
        			</tr>

            {
              (this.state.f_pay === 3 || this.state.f_pay === 5) ?
                <tr>
                	<th scope="row" className="vt"><span>환불방법</span></th>
                	<td>
                		<div className="box-td">
                			<div className="refund-method">
                				<ul className="igroup">
                					<li>
                						<span className="iradio">
                							<input type="radio" id="id-refund1" name="name-refund"
                                value="0"
                                onChange={ (e) => { this.setState({ f_refund: parseInt(e.target.value,10) }); } }
                                checked={this.state.f_refund===0}/>
                							<label htmlFor="id-refund1"><em>선택안함</em></label>
                						</span>
                					</li>
                					<li>
                						<span className="iradio">
                							<input type="radio" id="id-refund2" name="name-refund"
                                value="1"
                                onChange={ (e) => { this.setState({ f_refund: parseInt(e.target.value,10) }); } }
                                checked={this.state.f_refund===1}
                              />
                							<label htmlFor="id-refund2"><em>구매자 예치금으로 적립</em></label>
                						</span>
                					</li>
                					<li>
                						<span className="iradio">
                							<input type="radio" id="id-refund3" name="name-refund"
                                value="2"
                                onChange={ (e) => { this.setState({ f_refund: parseInt(e.target.value,10) }); } }
                                checked={this.state.f_refund===2}/>
                							<label htmlFor="id-refund3"><em>본인계좌로 환불</em></label>
                						</span>
                					</li>
                				</ul>

                        {
                          this.state.f_refund === 2?
                  				<div className="refund-method_detail">
                  					<label htmlFor="id-banknumber">계좌번호 선택</label>
                  					<select id="id-banknumber" className="sstyle"
                              onChange={(e)=>{
                                const value = parseInt(e.target.value,10);
                                let isVisible = false;
                                if(value===-1){
                                  isVisible = true;
                                }
                                this.setState({
                                  refundBankVisible: isVisible,
                                  refund_bank_index: value,
                                });
                              }}
                            >
                              {this._userAccounts()}
                              {
                                this.props.memberBanks.length>0?
                                <option value="-1">직접입력</option>: null
                              }
                  					</select>
                            {
                              this.props.memberBanks.length === 0 || this.state.refundBankVisible?
                    					<div className="box">
                    						<input type="text" title="예금주" placeholder="예금주명" maxLength="10" style={{width:'80px'}}
                                  className={this.props.check_validation_payment['refund_bank']?"istyle ialert":"istyle"}
                                  value={this.state.refund_bank_name}
                                  onChange={(e)=>{ this.setState({ refund_bank_name: e.target.value.trim() }); }}
                                />
                    						<select title="은행" id="metaBank"
                                  className={this.props.check_validation_payment['refund_bank']?"sstyle ialert":"sstyle"}
                                  onChange={(e)=>{ this.setState({ refund_bank_code: parseInt(e.target.value,10) }); }}
                                >
                    							{this._banksList()}
                    						</select>
                    						<input type="text" title="계좌번호" placeholder="계좌번호 입력(-없이)" maxLength="30" style={{width:'260px'}}
                                  id="refund_bank_num"
                                  className={this.props.check_validation_payment['refund_bank']?"istyle ialert":"istyle"}
                                  value={this.state.refund_bank_num}
                                  onChange={(e)=>{
                                    const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                    this.setState({ refund_bank_num: value });
                                  }}
                                />
                    					</div>
                              : null
                            }
                            {
                              this.props.check_validation_payment['refund_bank']?
                              <div className="alert-msg fail" style={{marginLeft:'92px'}}>환불 계좌를 확인해 주세요.</div> : null
                            }
                  				</div>
                          : null
                        }
                			</div>
                		</div>
                	</td>
                </tr>
                : null
              }
              {
                (this.state.f_pay === 3 || this.state.f_pay === 5) && (this.props.f_cash ===1 || this.props.f_cash ===3)?
                <tr>
                	<th scope="row" className="vt"><span>증빙서류</span></th>
                	<td>
                		<div className="box-td">
                			<div className="doc-evidence">
                				<ul className="igroup">
                					<li>
                						<span className="iradio">
                							<input type="radio" id="id-evidence1" name="name-evidence"
                                value="0"
                                checked={this.state.f_issue===0}
                                onChange={ (e) => { this.setState({ f_issue: parseInt(e.target.value,10) }); } }
                              />
                							<label htmlFor="id-evidence1"><em>선택안함</em></label>
                						</span>
                					</li>
                					<li>
                						<span className="iradio">
                							<input type="radio" id="id-evidence2" name="name-evidence"
                                value="1"
                                checked={this.state.f_issue===1}
                                onChange={ (e) => { this.setState({ f_issue: parseInt(e.target.value,10) }); } }
                              />
                							<label htmlFor="id-evidence2"><em>현금영수증</em></label>
                						</span>
                					</li>
                				</ul>

                        {
                          this.state.f_issue ===1 ?
                          <div>
                    				<ul className="doc-evidence_noti">
                    					<li>- 현금영수증은 거래완료 후 익일 발행합니다.</li>
                    					<li>- 구매결정 후 발행을 원하면 마이페이지에서 신청이 가능합니다.</li>
                    				</ul>

                    				<div className="doc-evidence_detail">
                    					<ul className="igroup">
                    						<li>
                    							<span className="iradio">
                    								<input type="radio" id="id-evidence11" name="name-evidence2"
                                      value="2"
                                      checked={this.state.f_div_cash_receipt===2}
                                      onChange={ (e) => { this.setState({ f_div_cash_receipt: parseInt(e.target.value,10) }); } }
                                    />
                    								<label htmlFor="id-evidence11"><em>개인소득공제용</em></label>
                    							</span>
                    						</li>
                    						<li>
                    							<span className="iradio">
                    								<input type="radio" id="id-evidence22" name="name-evidence2"
                                      value="4"
                                      checked={this.state.f_div_cash_receipt===4}
                                      onChange={ (e) => { this.setState({ f_div_cash_receipt: parseInt(e.target.value,10) }); } }
                                    />
                    								<label htmlFor="id-evidence22"><em>사업자증빙용</em></label>
                    							</span>
                    						</li>
                    					</ul>

                    					{
                                this.state.f_div_cash_receipt === 2?
                      					<div className="doc-evidence_detail_slt">
                      						<label htmlFor="id-evidphone">휴대전화 입력</label>
                      						{/* <OptionData
                                    mode="mobile"
                                    id="id-evidphone"
                                    className="sstyle"
                                    defaultValue={this.state.num_issue_0}
                                    onChange={(e) => { this.setState({ num_issue_0 : e.target.value }); }}
                                  /> */}
                      						<input type="text" className="istyle num" style={{width:'80px'}} maxLength="3"
                                    value={this.state.num_issue_0}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_0:value});
                                    }}
                                  />
                      						<em className="dash"></em>
                      						<input type="text" title="중간자리" className="istyle num" style={{width:'80px'}} maxLength="4"
                                    value={this.state.num_issue_1}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_1:value});
                                    }}
                                  />
                      						<em className="dash"></em>
                      						<input type="text" title="끝자리" className="istyle num" style={{width:'80px'}} maxLength="4"
                                    value={this.state.num_issue_2}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_2:value});
                                    }}
                                  />
                                  {
                                    this.props.check_validation_payment['num_issue1']!==0?
                                      this.props.check_validation_payment['num_issue1']===1?
                                      <div className="alert-msg fail" style={{marginLeft:'100px'}}>현금영수증 발급용 휴대폰 번호를 입력해 주세요.</div>
                                      :
                                      <div className="alert-msg fail" style={{marginLeft:'100px'}}>현금영수증 발급용 휴대폰 번호를 확인해 주세요.</div>
                                    : null
                                  }
                      					</div>
                                :
                      					<div className="doc-evidence_detail_slt">
                      						<label htmlFor="id-corpnumber">사업자번호 입력</label>
                      						<input type="text" id="id-corpnumber" className="istyle num" style={{width:'80px'}} maxLength="3"
                                    value={this.state.num_issue_0}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_0:value});
                                    }}
                                  />
                      						<em className="dash"></em>
                      						<input type="text" title="중간자리" className="istyle num" style={{width:'80px'}} maxLength="2"
                                    value={this.state.num_issue_1}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_1:value});
                                    }}
                                  />
                      						<em className="dash"></em>
                      						<input type="text" title="끝자리" className="istyle num" style={{width:'80px'}} maxLength="5"
                                    value={this.state.num_issue_2}
                                    onChange={(e)=>{
                                      const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                                      this.setState({num_issue_2:value});
                                    }}
                                  />
                                  {
                                    this.props.check_validation_payment['num_issue2']!==0?
                                      this.props.check_validation_payment['num_issue2']===1?
                                      <div className="alert-msg fail" style={{marginLeft:'100px'}}>사업자번호를 입력해 주세요.</div>
                                      :
                                      <div className="alert-msg fail" style={{marginLeft:'100px'}}>사업자번호를 확인해 주세요.</div>
                                    : null
                                  }
                      					</div>
                              }
                    				</div>
                          </div>
                          : null
                        }
                			</div>
                		</div>
                	</td>
                </tr>
                : null
              }
      			</tbody>
      		</table>
      	</div>
      </article>
    );
  }
}
