import React, { Component } from 'react'
import moment from 'moment'

import {request, format} from '../../utils/Utils'

/* layout components */
import Buyer from '../components/Buyer'
import Recipient from '../components/Recipient'
import ProductInfo from '../components/ProductInfo'
import Coupon from '../components/Coupon'
import PaymentInfo from '../components/PaymentInfo'
import MinishopInfo from '../components/MinishopInfo'
import Terms from '../components/Terms'

/* style */
import '../../css/layers.css'
import '../../css/forms.css'
import '../../css/order.css'
import '../../css/minishop.css'

let DATA_SUBMIT;    // nicepay 성공시 전송할 데이터
let F_PAY;    // nicepay 성공시 결과 화면에 전송
let GOODS_NAME='';    // 상품 이름
let CLICK_SUBMIT=false;
let DATA_STATUS=0;    // 0:데이터 통신 전. 1:데이터 정상 받음, 2:데이터 통신 오류

const GO_NEXT = (_d) => {
  if(_d.code === 200){
    //주문번호 rsData.data.orderResult;
    window.location.href='/order/complete?num_ord='+_d.data.orderResult.num_ord;
  } else {
    window.location.href='/order/error?f_pay='+F_PAY;
  }
}

const NICE_PROCESS = (rsData) => {
  if(rsData.code === 200){
    GO_NEXT(rsData);
  } else {
    if(rsData.message){
      if(window.sessionStorage) window.sessionStorage.setItem("fail_message",rsData.message);
      alert(rsData.message);
    } else {
      alert('일시적인 장애가 발생하였습니다.\n잠시 후에 다시 시도해 주십시오.');
    }
    GO_NEXT(rsData);
  }
}

/******** nicepay 전용 함수 ********/
//결제 요청 함수
window.nicepay = function(){
  window.goPay(document.payForm);
};
// 결제 취소시 호출하게 되는 함수
window.nicepayClose = function(){
  //console.log(DATA_SUBMIT)
  window.alert("결제가 취소 되었습니다");
};
// 카드사 인증후 결제 요청시 호출되는 함수
window.nicepaySubmit = () =>{
  DATA_SUBMIT.EdiDate = document.payForm.EdiDate.value;
  DATA_SUBMIT.EncryptData = document.payForm.EncryptData.value;
  DATA_SUBMIT.TrKey = document.payForm.TrKey.value;
  DATA_SUBMIT.VbankExpDate = document.payForm.VbankExpDate.value;
  DATA_SUBMIT.GoodsName = document.payForm.GoodsName.value;

  request({
    url:window.API_URL+'/front/v1/order/payment/'+window.IDX_B_MANAGER+'/'+window.IDX_MEMBER,
    method:'post',
    body:DATA_SUBMIT
  }).then(NICE_PROCESS)
};
/******** //nicepay 전용 함수 ********/

export default class Order extends Component{
  static defaultProps = {
    idx_b_manager:window.IDX_B_MANAGER,
    idx_member:window.IDX_MEMBER,
    idx_cart:window.IDX_CARTS,
    apiUrl:window.API_URL+'/front/v1/order',
    apiUrlSumit:window.API_URL+'/front/v1/order/payment/'+window.IDX_B_MANAGER+'/'+window.IDX_MEMBER,
  }
  static propTypes = {
    idx_b_manager: React.PropTypes.number.isRequired,
    idx_member: React.PropTypes.number.isRequired,
    idx_cart: React.PropTypes.array,
    apiUrl: React.PropTypes.string.isRequired,
  }
  state = {
    // 기본 값 설정
    order_items:[],     //주문상품정보 ["상품아이디|상품가격|수량", "상품아이디|상품가격|수량"]
    pay_total:0,       //최종 결제금액
    deliv_pay_total:0, //최종 배송비 0: 무료배송
    f_pay:5,           //결제방법. 1: 카드, 3: 가상계좌(에스크로), 5: 무통장 매매보호 (전자보증)
    f_trans:1,         //배송방법 (1: 택배, 3: 퀵서비스, 4: 직접방문, 6: 경동화물)

    f_basic_addr:1,    //기본 배송지로 선택 (1: 기본 배송지)
    zipcode:'',         //배송지 우편번호
    addr_1:'',          //배송지 주소1
    addr_2:'',          //배송지 주소2
    name_rec:'',        //수령인명, 대리인명
    tel_1:'010--',           //수령인 연락처, 대리인 연락처 ('-' 포함)
    tel_1_0:'010',
    tel_1_1:'',
    tel_1_2:'',
    time_h_pay:0,      //결제 예정 ~시(24시)
    time_m_pay:0,      //결제 예정 ~분
    time_h_receive:0,  // 수령 예정 ~시(24시)
    time_m_receive:0,    //수령 예정 ~분
    f_recipient:0,        //수령인 선택 (0: 본인 수령, 1: 대리인 수령)
    f_mycheck:0,        //대리인 수령동의 (1: 동의)
    id_deliv_1:0,     //택배사 코드
    id_deliv_6:null,       //화물 영업소 코드
    point_use:0,      //사용 포인트
    deposit_use:0,      //사용 예치금
    bank_index:0,     // 입금 계좌 select 선택 인덱스
    bank_code:0,      //입금은행
    bank_account_name:'',     //입금은행 계좌주명
    bank_account_num:'',      //입금은행 계좌번호 (숫자만)
    name_pay:'',      //입금자명
    date_pay:moment().add('1','days').format("YYYY-MM-DD"),      //입금예정일 2017-03-21
    usafe_birthday:0, //전자보증 필수사항 생년월일 (숫자만) 19990101
    usafe_gender:null,   //전자보증 필수사항 성별 (1: 남성, 2: 여성)
    f_refund:0,     //환불방법 (0: 선택안함, 1:구매자 예치금으로 적립, 2: 본인계좌로 환불)
    refund_bank_index:0,    // 본인 환불계좌 select 선택 인덱스
    refund_bank_code:null,    //환불계좌 은행코드
    refund_bank_account_name:'',    //환불계좌 예금주명
    refund_bank_account_num:'',     //환불계좌 번호
    f_issue:0,     //증빙서류 발급 여부 (0:선택안함, 1:현금영수증)
    f_issue_0:'010',
    f_issue_1:'',
    f_issue_2:'',
    f_div_cash_receipt:2,   //현금영수증  (1: 주민등록번호, 2: 휴대폰번호(개인소득공제용), 3: 현금영수증카드번호, 4: 사업자등록번호(사업자증빙용))
    num_issue:'',     //현금영수증 발행을 위한 사용자 정보 ( '-' 포함해서 입력 )
    req_memo:'',      //배송 메모
    //month_instmt:0,   //할부 개월
    idx_coupons:[],    //쿠폰 idx

    get_encryp:false,
    get_pgval:false,

    isAgreed0:false,    // 약관 동의 상태
    isAgreed1:false,
    isAgreed2:false,

    data_Status_message:'',

    check_validation_terms:{
      agree1:false,
      agree2:false,
      agree3:false,
    },
    check_validation_recipient:{
      tel_1:false,
      name_rec:0, //0:ok, 1:error, 2:wrong format
      addr:false,
      f_mycheck:false,
      id_deliv_6:false,
    },
    check_validation_payment:{
      num_issue1:0,     //0:ok, 1:error, 2:wrong format
      num_issue2:0,     //0:ok, 1:error, 2:wrong format
      usafe_birthday:0, //0:ok, 1:error, 2:wrong format
      date_pay:0,       //0:ok, 1:error, 2:wrong format
      refund_bank:false,
    },

    deliv_price_add:0,    // 제주 산간 추가 배송비
  }

  constructor(props, context) {
    super(props);

    this._beforeSubmit = this._beforeSubmit.bind(this);
  }

  componentWillMount(nextProps,nextState){
    if( DATA_STATUS === 0 ){
      request({
        url:this.props.apiUrl+'/orderInfo/'+this.props.idx_b_manager+'/'+this.props.idx_member,
        method:'post',
        body:{
          idx_b_manager:this.props.idx_b_manager,
          idx_member:this.props.idx_member,
          idx_cart:this.props.idx_cart,
        }
      }).then(d=>{
        if(!d.data) return;
        if(d.code !== 200){
          DATA_STATUS = 2;
          this.setState({
            data_Status_message:d.message ? d.message : "일시적인 장애가 발생하였습니다. 잠시 후에 다시 시도해 주십시오.",
          });
          return;
        }

        DATA_STATUS = 1;

        const rsData = d.data;

        // tel 데이터 - 없는 경우
        let tel1 = rsData.memberInfo.tel_1;
        if(tel1.length>10 && tel1.indexOf('-')===-1){
          tel1 = this.state.memberInfo.tel_1.slice(0,3)+'-'+this.state.memberInfo.tel_1.slice(3,7)+'-'+this.state.memberInfo.tel_1.slice(7,11);
        }
        rsData.memberInfo.tel_1 = tel1;

        // 제주산간 추가배송비 체크
        request({
          url:this.props.apiUrl+'/deliveryCostByBackcountry',
          method:'post',
          body:{area:rsData.memberInfo.addr_1},
        }).then(rsData=>{
          this.setState({deliv_price_add:rsData.data.additionalDeliveryCostInfo.cost})
        })

        // 사용할 데이터 세팅
        this.setState( Object.assign({}, this.state, rsData) );
        this.setState({
          //f_basic_addr:this.state.f_basic_addr,
          zipcode:rsData.memberInfo.zipcode?rsData.memberInfo.zipcode:'',
          addr_1:rsData.memberInfo.addr_1?rsData.memberInfo.addr_1:'',
          addr_2:rsData.memberInfo.addr_2?rsData.memberInfo.addr_2:'',
          name_rec:rsData.memberInfo.name_recip?rsData.memberInfo.name_recip:rsData.memberInfo.name,
          name_addr:rsData.memberInfo.name_addr?rsData.memberInfo.name_addr:'',
          tel_1:rsData.memberInfo.tel_1?rsData.memberInfo.tel_1:rsData.memberInfo.hp,
          tel_1_0:rsData.memberInfo.tel_1?rsData.memberInfo.tel_1.split('-')[0]:rsData.memberInfo.hp.split('-')[0],
          tel_1_1:rsData.memberInfo.tel_1?rsData.memberInfo.tel_1.split('-')[1]:rsData.memberInfo.hp.split('-')[1],
          tel_1_2:rsData.memberInfo.tel_1?rsData.memberInfo.tel_1.split('-')[2]:rsData.memberInfo.hp.split('-')[2],
          //pay_total:rsData.paymentsInfo.total+rsData.paymentsInfo.deliv_price_total+parseInt(this.state.deliv_price_add,10),
          deliv_pay_total:rsData.paymentsInfo.deliv_price_total,
          id_deliv_1:rsData.managerInfo.id_deliv,
          name_pay:rsData.memberInfo.name?rsData.memberInfo.name:'',
          usafe_birthday:rsData.memberInfo.birthday_auth?rsData.memberInfo.birthday_auth:'',
          usafe_gender:rsData.memberInfo.f_sex?rsData.memberInfo.f_sex:this.state.usafe_gender,
          //bank_index:this.state.bank_index,
          bank_code:rsData.managerBankInfo.length? rsData.managerBankInfo[this.state.bank_index].id_bank:this.state.bank_code,
          bank_account_name:rsData.managerBankInfo.length? rsData.managerBankInfo[this.state.bank_index].name_bank:this.state.bank_account_name,
          bank_account_num:rsData.managerBankInfo.length? rsData.managerBankInfo[this.state.bank_index].num_bank:this.state.bank_account_num,
          //refund_bank_index:this.state.refund_bank_index,
          refund_bank_code:rsData.memberBanks.length? rsData.memberBanks[this.state.bank_index].id_bank:this.state.refund_bank_code,
          refund_bank_account_name:rsData.memberBanks.length? rsData.memberBanks[this.state.bank_index].name:this.state.refund_bank_name,
          refund_bank_account_num:rsData.memberBanks.length? rsData.memberBanks[this.state.bank_index].num_bank:this.state.refund_bank_num,

          // 기본 결제 방법: 카드몰 경우(f_type:1) 카드가 기본, 그리고 매매옵션이 에스크로 경우(f_safe:1) 가상계좌가 기본, 아닐 경우 무통장이 기본
          f_pay:rsData.managerInfo.f_type===1? 1 : rsData.managerInfo.f_safe===1?3:5,

          order_items: this._setOrderItem(rsData.cartItems),
        });
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    // 입금 계좌번호 변경
    if(prevState.bank_index !== this.state.bank_index){
      const index = this.state.bank_index;
      this.setState({
        bank_code: this.state.managerBankInfo[index].id_bank,
        bank_account_name: this.state.managerBankInfo[index].name_bank,
        bank_account_num: this.state.managerBankInfo[index].num_bank,
      })
    }
    // 환별 계좌번호 변경
    if(prevState.refund_bank_index !== this.state.refund_bank_index){
      const index = this.state.refund_bank_index;
      if(index===-1){
        this.setState({
          refund_bank_code:1,
          refund_bank_account_name:'',
          refund_bank_account_num:'',
        });
        return;
      }
      this.setState({
        refund_bank_code:this.state.memberBanks[index].id_bank,
        refund_bank_account_name:this.state.memberBanks[index].name,
        refund_bank_account_num:this.state.memberBanks[index].num_bank,
      });
    }

    // 연락처 변경
    if(this.state.tel_1_0 !== prevState.tel_1_0
      || this.state.tel_1_1 !== prevState.tel_1_1
      || this.state.tel_1_2 !== prevState.tel_1_2
    ){
      this.setState({ tel_1 : this.state.tel_1_0+'-'+this.state.tel_1_1+'-'+this.state.tel_1_2, });
    }

    // 현금영수증 발행 번호 변경
    if(this.state.num_issue_0 !== prevState.num_issue_0
      || this.state.num_issue_1 !== prevState.num_issue_1
      || this.state.num_issue_2 !== prevState.num_issue_2
    ){
      this.setState({ num_issue : this.state.num_issue_0+'-'+this.state.num_issue_1+'-'+this.state.num_issue_2, });
    }

    // submit and get pg datas
    if(this.state.get_encryp && this.state.get_pgval && CLICK_SUBMIT){
      F_PAY = this.state.f_pay;

      document.payForm.GoodsName.setAttribute('value',GOODS_NAME);
      document.payForm.PayMethod.value = (this.state.f_pay===3)?'VBANK':'CARD';
      document.payForm.TransType.value = (this.state.f_pay===3)?'1':'0';
      document.payForm.MID.value = (this.state.f_pay===3)?this.state.merchantID_escrow:this.state.merchantID;

      this._startPayProcess();

      CLICK_SUBMIT = false;
    }
  }

  // 쿠폰 금액, 쿠폰 idx 구하기
  _getCouponStatus = (_mode) => {
    const _coupon = this.state.coupon;
    let i=0;
    let len = _coupon.length;
    if(_mode==='price'){
      let price = 0;
      for(;i<len;i++){
        if(_coupon[i].rslt.toLowerCase()==='success')
          price += _coupon[i].coupon_price * _coupon[i].couponCount;
      }
      return price;
    }else if(_mode==='idx'){
      let arr = [];
      for(;i<len;i++){
        if(_coupon[i].rslt.toLowerCase()==='success')
          arr = arr.concat(_coupon[i].pr_idx);
      }
      return arr;
    }
  }

  _startPayProcess = () =>{
    F_PAY = this.state.f_pay;   // 실패시 페이지에 넘기는 파라메터

    const actionMobile = () =>{
      const d = DATA_SUBMIT;
      d.order_items = d.order_items.toString();
      d.f_mobile = 1;

      const returnURL = document.createElement('input');
      returnURL.type = 'hidden';
      returnURL.name = "ReturnURL";
      returnURL.value = "https://order.pping.kr/ordercallback";
      document.payForm.appendChild(returnURL);

      for(let key in d){
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = d[key];
        document.payForm.appendChild(input);
      }

      document.chacharacterSetrset = 'euc-kr';
      document.payForm['acceptCharset'] = "euc-kr";
      document.payForm.target = "_blank";
      document.payForm.method = "post";
      document.payForm.action = "https://web.nicepay.co.kr/smart/paySmart.jsp";
      document.payForm.MID.value = (this.state.f_pay===3)?this.state.merchantID_escrow:this.state.merchantID;
      document.payForm.submit();
    }

    // 결제 금액 없을 때
    if(this.state.pay_total===0){
      DATA_SUBMIT.f_pay = 5;
      F_PAY = null;

      request({
        url:this.props.apiUrlSumit,
        method:'post',
        body:DATA_SUBMIT,
      }).then(GO_NEXT)
      return;
    }

    // 무통장입금(전자보증) 경우
    if(this.state.f_pay === 5){
      request({
        url:this.props.apiUrlSumit,
        method:'post',
        body:DATA_SUBMIT,
      }).then(rsData=>{
        // 무통장  ==> 결과 4002 일때 에스크로전환 후 nicepay();
        if(rsData.code === 4002) {
          // 에스크로 전환 값 설정
          this.setState({ f_pay:3 });
          document.payForm.PayMethod.value = 'VBANK';
          document.payForm.TransType.value = '1';
          document.payForm.MID.value = this.state.merchantID_escrow;
          DATA_SUBMIT.f_pay = 3;

          // 모바일 경우
          if(this.state.system.is_mobile){
            DATA_SUBMIT.f_mobile = 1;
            actionMobile();
            return;
          }

          // PC경우
          window.nicepay();
          return;
        }

        NICE_PROCESS(rsData);
      })
      return;
    }

    // 모바일 경우
    if(this.state.system.is_mobile){
      actionMobile();
      return;
    }

    // PC 신용카드, 에스크로
    window.nicepay();
  }

  _beforeSubmit = (e) => {
    e.preventDefault();

    DATA_SUBMIT = {
      idx_member: this.props.idx_member,
      idx_b_manager: this.props.idx_b_manager,
      order_items: this.state.order_items,
      pay_total: this.state.pay_total,
      deliv_pay_total: this.state.f_trans===1?parseInt(this.state.deliv_pay_total,10)+parseInt(this.state.deliv_price_add,10):0,
      f_pay: this.state.f_pay,
      f_trans: this.state.f_trans,
      f_basic_addr: this.state.f_basic_addr,
      zipcode: this.state.zipcode,
      addr_1: this.state.addr_1,
      addr_2: this.state.addr_2,
      name_rec: this.state.name_rec.trim()===''?window.UserName:this.state.name_rec,
      tel_1: this.state.tel_1_0+'-'+this.state.tel_1_1+'-'+this.state.tel_1_2,
      f_recipient: this.state.f_recipient,
      time_h_pay: this.state.time_h_pay,
      time_m_pay: this.state.time_m_pay,
      time_h_receive: this.state.time_h_receive,
      time_m_receive: this.state.time_m_receive,
      f_mycheck: this.state.f_mycheck,
      id_deliv_1: this.state.id_deliv_1,
      name_addr: this.state.name_addr,
      point_use: this.state.point_use,
      deposit_use: this.state.deposit_use,
      bank_code: this.state.bank_code,
      bank_account_name: this.state.bank_account_name,
      bank_account_num: this.state.bank_account_num,
      name_pay: this.state.name_pay,
      date_pay: format.setFormat(this.state.date_pay,'YYYY-MM-DD'),
      usafe_birthday: format.setFormat(this.state.usafe_birthday,'YYYY-MM-DD'),
      usafe_gender: this.state.usafe_gender,
      f_refund: this.state.f_refund,
      refund_bank_code: this.state.refund_bank_code,
      refund_bank_account_name: this.state.refund_bank_account_name,
      refund_bank_account_num: this.state.refund_bank_account_num,
      f_issue: this.state.f_issue,
      f_div_cash_receipt: this.state.f_div_cash_receipt,
      req_memo: this.state.req_memo,
      idx_coupons:this._getCouponStatus('idx'),
    };

    if(this.state.f_issue===1 && (this.state.f_div_cash_receipt===2 || this.state.f_div_cash_receipt===4) ){
      const v = this.state.num_issue_0?this.state.num_issue_0:'010';
      DATA_SUBMIT.num_issue = v+'-'+this.state.num_issue_1+'-'+this.state.num_issue_2;
    }

    //화물 방문 영업소 선택 했을 때
    if(this.state.f_trans===6){
      const idx = parseInt(document.getElementById('id-office').getAttribute('data-idx'),10);
      this.setState({ id_deliv_6:idx });
    }

    GOODS_NAME = this.state.cartItems.length>1? this.state.cartItems[0].item_name+' 외'+(this.state.cartItems.length-1):this.state.cartItems[0].item_name;
    document.payForm.GoodsName.value = GOODS_NAME;

    // form validation
    if( !this._formValid() ) return false;

    // 결제 진행 시작
    CLICK_SUBMIT = true;
    this._callPGModule();
    this._callEncrypData();

    e.stopPropagation();
  }

  _callPGModule = () =>{
    if(this.state.get_pgval) return;

    request({
      url:this.props.apiUrl+'/pgRequestVal',
      method:'post',
      body:{idx_b_manager:this.props.idx_b_manager}
    }).then(rsData=>{
      this.setState({
        ip: rsData.data.ip,    //사용자IP
        ediDate: rsData.data.ediDate, //현재시각
        merchantKey: rsData.data.merchantKey,  //상점인증키
        merchantID: rsData.data.merchantID,  //상점아이디
        merchantKey_escrow: rsData.data.merchantKey_escrow,  //에스크로상점인증키
        merchantID_escrow: rsData.data.merchantID_escrow, //에스크로아이디
        vDate: rsData.data.vDate,  //가상계좌 입금예정 만료일
        get_pgval:true,
      });
    })
  }

  _callEncrypData = () =>{
    if(this.state.get_encryp) return;

    request({
      url:this.props.apiUrl+'/pgEncryptData',
      method:'post',
      body:{
        idx_b_manager:this.props.idx_b_manager,
        paytype: this.state.f_pay===3? 'escrow':'card',   //결재방식(에스크로:escrow   그외 :card)
        price: this.state.pay_total,   //총결재금액
      }
    }).then(rsData=>{
      this.setState({
        EncryptData: rsData.data.EncryptData,
        get_encryp:true,
      });
    })
  }

  _formValid = () => {
    let collectError = {
      element:[],
      data:{
        check_validation_recipient:{},
        check_validation_payment:{},
        check_validation_terms:{},
      }
    }

    const {f_trans, name_rec, tel_1_0, tel_1_1, tel_1_2, addr_1, addr_2, zipcode, id_deliv_6, f_recipient, f_mycheck,
      f_pay, date_pay, usafe_birthday, f_refund, refund_bank_code, refund_bank_account_name, refund_bank_account_num,
      f_issue, f_div_cash_receipt, num_issue_0, num_issue_1, num_issue_2,
      isAgreed0, isAgreed1, isAgreed2, point_use, deposit_use} = this.state;

    // 배송지 정보
    if( (f_trans === 1 || f_trans === 3) && name_rec===''){
      //console.log('이름(성명)을 입력해 주세요.');
      collectError.element.push('#id-name');    // focus할 요소 querySelector
      collectError.data.check_validation_recipient.name_rec = 1;    // setstate 할 값
    } else {
      collectError.data.check_validation_recipient.name_rec = 0;
    }

    if( (f_trans === 1 || f_trans === 3) &&
      (isNaN(parseInt(tel_1_1,10)) || isNaN(parseInt(tel_1_2,10)) || tel_1_1.length < 3 || tel_1_2.length < 4)
    ){
      //console.log('연락처를 확인해 주세요.');
      collectError.element.push('#id-phone');
      collectError.data.check_validation_recipient.tel_1 = true;
    } else {
      collectError.data.check_validation_recipient.tel_1 = false;
    }
    if((f_trans === 1 || f_trans === 3) && (addr_1==='' ||addr_2.trim()===''||zipcode==='')){
      //console.log('배송지를 입력해 주세요.');
      collectError.element.push('#zipcode');
      collectError.data.check_validation_recipient.addr = true;
    } else {
      collectError.data.check_validation_recipient.addr = false;
    }
    if(f_trans===6 && !id_deliv_6){
      const value = parseInt(document.getElementById('id-office').getAttribute('data-idx'),10);
      if(!value){
        //console.log('방문 영업소를 선택해 주세요.');
        collectError.element.push('#id-office');
        collectError.data.check_validation_recipient.id_deliv_6 = true;
      } else {
        collectError.data.check_validation_recipient.id_deliv_6 = false;
      }
    }
    if((f_trans === 4 || f_trans ===6) && f_recipient===1){
      if(f_mycheck!==1){
        //console.log('대리인 수령동의를 체크해 주세요.');
        collectError.element.push('#f_mycheck');
        collectError.data.check_validation_recipient.f_mycheck = true;
      } else {
        collectError.data.check_validation_recipient.f_mycheck = false;
      }
      if(name_rec ==='' || tel_1_1 ==='' || tel_1_2===''){
        //console.log('대리인 정보를 입력해 주세요.');
        collectError.element.push('#name_rec');
        collectError.data.check_validation_recipient.name_rec = 1;
      }else if(name_rec.length<2 || tel_1_1.length<3 || tel_1_2.length<4){
        //console.log('대리인 정보를 확인해 주세요.');
        collectError.element.push('#name_rec');
        collectError.data.check_validation_recipient.name_rec = 2;
      } else {
        collectError.data.check_validation_recipient.name_rec = 0;
      }
    }

    // 결제 정보
    if(f_pay === 5){
      if(date_pay===''){
        //console.log('입금예정일을 입력해 주세요.');
        collectError.element.push('#id-deposit');
        collectError.data.check_validation_payment.date_pay = 1;
      }else if(!format.isDate(date_pay)){
        //console.log('입금예정일을 확인해 주세요.');
        collectError.element.push('#id-deposit');
        collectError.data.check_validation_payment.date_pay = 2;
      } else {
        collectError.data.check_validation_payment.date_pay = 0;
      }
      if(usafe_birthday===''){
        //console.log('생년월일을 입력해 주세요.');
        collectError.element.push('#id-birth');
        collectError.data.check_validation_payment.usafe_birthday = 1;
      }else if(!format.isDate(usafe_birthday)){
        //console.log('생년월일을 확인해 주세요.');
        collectError.element.push('#id-birth');
        collectError.data.check_validation_payment.usafe_birthday = 2;
      } else {
        collectError.data.check_validation_payment.usafe_birthday = 0;
      }
    }
    if( (f_pay===3 || f_pay===5) && f_refund===2){
      if(!refund_bank_code ||  refund_bank_account_name===undefined || refund_bank_account_name==='' || refund_bank_account_num==='' || !format.isNumber(refund_bank_account_num)){
        //console.log('환불 계좌를 확인해 주세요.');
        collectError.element.push('#refund_bank_num');
        collectError.data.check_validation_payment.refund_bank = true;
      } else {
        collectError.data.check_validation_payment.refund_bank = false;
      }
    }
    if(f_issue===1){
      if(f_div_cash_receipt===2){
        const v = num_issue_1+num_issue_2;
        if( v === ''){
          //console.log('현금영수증 발급용 휴대폰 번호를 입력해 주세요.');
          collectError.element.push('#id-evidphone');
          collectError.data.check_validation_payment.num_issue1 = 1;
        }else if( isNaN(parseInt(num_issue_1,10)) || isNaN(parseInt(num_issue_2,10)) || num_issue_1.length < 3 || num_issue_2.length < 4 ){
          //console.log('현금영수증 발급용 휴대폰 번호를 확인해 주세요.');
          collectError.element.push('#id-evidphone');
          collectError.data.check_validation_payment.num_issue1 = 2;
        } else {
          collectError.data.check_validation_payment.num_issue1 = 0;
        }
      }else if(f_div_cash_receipt===4){
        const v = num_issue_0+num_issue_1+num_issue_2;
        if( v === ''){
          //console.log('사업자번호를 입력해 주세요.');
          collectError.element.push('#id-corpnumber');
          collectError.data.check_validation_payment.num_issue2 = 1;
        }else if( !format.isBizNum(v) ){
          //console.log('사업자번호를 확인해 주세요.');
          collectError.element.push('#id-corpnumber');
          collectError.data.check_validation_payment.num_issue2 = 2;
        } else {
          collectError.data.check_validation_payment.num_issue2 = 0;
        }
      }
    }

    // 약관
    if(!isAgreed0 && !isAgreed1){
      //console.log('개인정보 제3자 제공 동의하셔야 결제가 진행됩니다.');
      //console.log('주의사항에 동의하셔야 결제가 진행됩니다.');
      collectError.element.push('#id-p');
      collectError.element.push('#id-p2');
      collectError.data.check_validation_terms.agree1 = 3;
    } else if(!isAgreed0 && isAgreed1){
      collectError.element.push('#id-p');
      collectError.data.check_validation_terms.agree1 = 1;
    } else if(isAgreed0 && !isAgreed1){
      collectError.element.push('#id-p2');
      collectError.data.check_validation_terms.agree1 = 2;
    } else {
      collectError.data.check_validation_terms.agree1 = 0;
    }
    if(!isAgreed2){
      //console.log('결재대행서비스에 동의하셔야 결제가 진행됩니다.');
      collectError.element.push('#id-pc');
      collectError.data.check_validation_terms.agree2 = true;
    } else {
      collectError.data.check_validation_terms.agree2 = false;
    }

    if(collectError.element.length>0){
      const firstElement = document.querySelector(collectError.element[0]);
      const offset = firstElement.getBoundingClientRect().top + window.pageYOffset-10;

      this.setState( Object.assign({}, collectError.data) );
      firstElement.focus();
      window.scrollTo(0,offset);

      return;
    }


    // set submit datas
    // tel_1 데이터 정리
    if(tel_1_0===''){
      this.setState({ tel_1_0 : '010'})
    }
    this.setState({
      tel_1: tel_1_0+'-'+tel_1_1+'-'+tel_1_2,
    });
    // 화물 방문 영업소 선택
    if(f_trans===6){
      this.setState({
        id_deliv_6:parseInt(document.getElementById('id-office').getAttribute('data-idx'),10),
      });
    }
    // 본인계좌로 환불 선택
    if(f_refund===2 && refund_bank_account_num.indexOf('-')!==-1){
      this.setState({
        refund_bank_account_num: refund_bank_account_num.replace(/-/gi,'')
      });
    }
    // 현금영수증 발행 선택
    if(f_issue===1){
      if(num_issue_0 === ''){
        this.setState({
          num_issue_0: '010',
          num_issue: '010-'+num_issue_1+'-'+num_issue_2,
        });
      } else {
        this.setState({
          num_issue: num_issue_0+'-'+num_issue_1+'-'+num_issue_2,
        });
      }
    }
    // 직접수령이고 기본배송지 없는 경우
    if(f_trans===4){
      if(!name_rec){
        this.setState({ name_rec: this.state.memberInfo.name, });
      }
      if(tel_1_1===undefined || tel_1_1==='' || tel_1_2===undefined || tel_1_2===''){
        this.setState({ tel_1: this.state.memberInfo.hp, });
      }
    }

    // 포인트 및 예치금 불법 사용 방지
    if(point_use > this.state.memberInfo.point){
      window.alert('보유한 포인트 이상 사용은 불가능합니다.');
      return false;
    }
    if(deposit_use > this.state.memberInfo.deposit){
      window.alert('보유한 예치금 이상 사용은 불가능합니다.');
      return false;
    }

    return true;
  }

  _updateState = (obj) => {
    this.setState( Object.assign({}, obj) );

    if( JSON.stringify(obj).indexOf('f_trans')!==-1){
      this.setState({
        check_validation_recipient:{
          tel_1:false,
          name_rec:0, //0:ok, 1:error, 2:wrong format
          addr:false,
          f_mycheck:false,
          id_deliv_6:false,
        }
      });
    }
  }

  _setOrderItem(data){
    // ["상품아이디|상품가격|수량", "상품아이디|상품가격|수량"]
    return data.map((data)=> data.item_id+'|'+data.price+'|'+data.cnt_item);
  }

  render(){
    if(DATA_STATUS === 0){
      return(
        <div style={{position:'relative',textAlign:'center'}}>
          <a href="http://www.pping.kr/goodbyeie"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/bnr_goodbye_ie.jpg" alt="" height="338"/></a>

          <img src="//img.happyshopping.kr/img_static/img_pres/_v3/loading_w.gif" alt="" style={{
            position:'absolute',
            left:'50%',
            top:'50%',
            margin:'-20px 0 0 -20px'
          }}/>
        </div>
      )
    }
    if(DATA_STATUS === 2){
      return(
        <div style={{position:'relative',textAlign:'center',padding:'160px 0'}}>
          {this.state.data_Status_message}
        </div>
      )
    }

    return(
      <section className="order-body">
        <div className="order-body_top">
          <h2 className="tit-h2">주문/결제</h2>
          <ol>
            <li><span>01</span> 장바구니</li>
            <li><strong><span>02</span> 주문/결제</strong></li>
            <li><span>03</span> 결제완료</li>
          </ol>
        </div>

        <Buyer
          apiUrl={this.props.apiUrl}
          idx_member={this.props.idx_member}
          name={this.state.memberInfo.name}
          email={this.state.memberInfo.email}
          hp={this.state.memberInfo.hp}
        />

        <form name="payInfo">
        <Recipient
          apiUrl={this.props.apiUrl}
          _updateState={this._updateState.bind(this)}

          f_trans={this.state.f_trans}
          f_basic_addr={this.state.f_basic_addr}
          f_recipient={this.state.f_recipient}
          f_mycheck={this.state.f_mycheck}

          name_addr={this.state.memberInfo.name_addr}
          name_rec={this.state.name_rec}
          tel_1={this.state.tel_1}
          zipcode={this.state.memberInfo.zipcode}
          addr_1={this.state.memberInfo.addr_1}
          addr_2={this.state.memberInfo.addr_2}
          f_addr={this.state.memberInfo.f_addr}

          system={this.state.system}
          latelyAddresses={this.state.latelyAddresses}
          managerInfo={this.state.managerInfo}
          check_validation_recipient={this.state.check_validation_recipient}
          miniShopWeekDays={this.state.miniShopWeekDays}
        />

        <Coupon
          coupon={this.state.coupon}
          couponDiscount={this._getCouponStatus('price')}
        />

        <ProductInfo
          f_trans={this.state.f_trans}
          deliv_price_total={this.state.paymentsInfo.deliv_price_total}
          deliv_price_add={this.state.deliv_price_add}
          cartItems={this.state.cartItems}
          plusday={this.state.plusday}
        />

        <PaymentInfo
          _updateState={this._updateState.bind(this)}
          apiUrl={this.props.apiUrl}
          coupon={this.state.coupon}
          couponDiscount={this._getCouponStatus('price')}
          memberName={this.state.memberInfo.name}
          memberBirthday={this.state.memberInfo.birthday_auth}
          memberGender={this.state.memberInfo.f_sex}
          memberPoint={this.state.memberInfo.point}
          memberDeposit={this.state.memberInfo.deposit}
          //memberPoint={10000} memberDeposit={30000}
          //memberCoupon={this.state.useCouponPoint}
          memberBanks={this.state.memberBanks}
          paymentsInfo={this.state.paymentsInfo}
          managerBankInfo={this.state.managerBankInfo}
          f_cash={this.state.managerInfo.f_cash}
          f_type={this.state.managerInfo.f_type}
          f_safe={this.state.managerInfo.f_safe}
          f_pay={this.state.f_pay}
          f_issue={this.state.f_issue}
          f_div_cash_receipt={this.state.f_div_cash_receipt}
          f_trans={this.state.f_trans}
          //deliv_price_total={this.state.paymentsInfo.deliv_price_total}
          deliv_price_add={this.state.deliv_price_add}
          check_validation_payment={this.state.check_validation_payment}
        />

        <MinishopInfo
          apiUrl={this.props.apiUrl}
          idx_member={this.props.idx_member}
          idx_b_manager={this.props.idx_b_manager}
          managerInfo={this.state.managerInfo}
          reviews={this.state.reviews}
          zzim_state={this.state.zzim_state}
        />

        <Terms
          _updateState={this._updateState.bind(this)}
          terms={this.state.terms}
          isAgreed0={this.state.isAgreed0}
          isAgreed1={this.state.isAgreed1}
          isAgreed2={this.state.isAgreed2}
          check_validation_terms={this.state.check_validation_terms}
        />
        </form>

        <form name="payForm">
          {/*Mall Parameters */}

          {/* 현금영수증 발행 불가 */}
          <input type="hidden" name="OptionList" value="no_receipt"/>

          {/*결제 수단 CARD:카드, VBANK:가상계좌 */}
          <input type="hidden" name="PayMethod" value=""/>

          {/*결제 타입 0:일반, 1:에스크로 */}
          <input type="hidden" name="TransType" value=""/>

          {/*상품 가격(상단의 price에서 가격을 지정하십시요) */}
          <input type="hidden" name="Amt" value={this.state.pay_total}/>

          {/*구매자명 */}
          <input type="hidden" name="BuyerName" value={this.state.memberInfo.name}/>

          {/*상점아이디 */}
          <input type="hidden" name="MID" value={(this.state.f_pay===3)?this.state.merchantID_escrow:this.state.merchantID}/>

          {/*상품명 */}
          <input type="hidden" name="GoodsName" value=""/>

          {/*구매자 이메일 */}
          <input type="hidden" name="BuyerEmail" value={this.state.memberInfo.email}/>

          {/*가상계좌 입금예정 만료일  */}
          <input type="hidden" name="VbankExpDate" value={this.state.vDate}/>

          {/*암호화 항목 */}
          <input type="hidden" name="EncodeParameters" value=""/>

          {/* 변경불가 */}
          <input type="hidden" name="EdiDate" value={this.state.ediDate}/>
          <input type="hidden" name="EncryptData" value={this.state.EncryptData}/>
          <input type="hidden" name="TrKey" value=""/>
          <input type="hidden" name="SocketYN" value="Y"/>
          <input type="hidden" name="MallIP" value=""/>
          <input type="hidden" name="UserIP" value={this.state.ip}/>
          <input type="hidden" name="BuyerTel" value={this.state.tel_1}/>
          <input type="hidden" name="GoodsCnt" value={this.state.order_items.length}/>
        </form>

        <div className="button-group ctr">
          <a href="http://pc.pping.kr" className="btn-continue-shopping">계속 쇼핑하기</a>
          <input type="button" value="구매하기" className="btn-buy-submit" onClick={this._beforeSubmit} />
        </div>

        {/* <button
          style={{position:'fixed',right:'10px',top:'10px',zIndex:'100',width:'100px',height:'30px',backgroundColor:'black',color:'#fff',}}
          onClick={(e)=>{
            e.preventDefault();
            console.log(this.state)
          }}
        >view state</button> */}

      </section>
    );
  }
}
