import React, { Component } from 'react'

import {request} from '../../utils/Utils'
import OptionData from '../../utils/OptionData'

import LayerFindOffice from './LayerFindOffice'
import LayerQuickCosts from './LayerQuickCosts'
import LayerOfficeMap from './LayerOfficeMap'

export default class Recipient extends Component{
  static propTypes = {
    f_trans: React.PropTypes.number.isRequired,
    f_basic_addr: React.PropTypes.number.isRequired,
    f_recipient: React.PropTypes.number.isRequired,
    f_mycheck: React.PropTypes.number.isRequired,
    name_addr: React.PropTypes.string.isRequired,
    name_rec: React.PropTypes.string.isRequired,
    tel_1: React.PropTypes.string.isRequired,
    zipcode: React.PropTypes.string.isRequired,
    addr_1: React.PropTypes.string.isRequired,
    addr_2: React.PropTypes.string.isRequired,
    f_addr: React.PropTypes.number.isRequired,
    system: React.PropTypes.object.isRequired,
    latelyAddresses: React.PropTypes.array.isRequired,
    managerInfo: React.PropTypes.object.isRequired,
  }
  static defaultProps = {
    f_trans:1,
    f_basic_addr:1,
    f_recipient:0,
    f_mycheck:0,
    name_rec:'',
    name_addr:'',
    zipcode:'',
    addr_1:'',
    addr_2:'',
    f_addr:'',
    tel_1_0:'',
    tel_1_1:'',
    tel_1_2:'',

    pay_s_time:0,
    pay_e_time:23,
    recive_s_time:9,
    recive_e_time:17,
    pay_selected_time:0,
    pay_selected_min:0,
    recive_selected_time:9,
    recive_selected_min:0,
    reciveDayText:'당일',
  }

  state = {
    noBasicAddr: true,
    noRecentAddr: true,
    disableTime: false,
    disableReciveTime: true,
    asideToggle0: "0",
    asideToggle1: "0",
    asideToggle2: "0",
    asideToggle3: "0",
    addressType: "0",   // 0:기본배송지, 1:최근배송지, 2:신규배송지
    displayMemo: false,
    defaultMemoValue: "0",
    defaultMemoText: "",

    f_trans: this.props.f_trans,
    f_basic_addr: this.props.f_basic_addr,    // 1: 기본배송지로
    f_recipient: this.props.f_recipient,     // 0: 본인수령, 1:대리인수령
    f_mycheck: this.props.f_mycheck,       // 1: 본인수령 동의

    name_rec: this.props.name_rec,
    name_addr: this.props.name_addr,
    zipcode: this.props.zipcode,
    addr_1: this.props.addr_1,
    addr_2: this.props.addr_2,
    f_addr: this.props.f_addr,

    tel_1_0:this.props.tel_1.split('-')[0],
    tel_1_1:this.props.tel_1.split('-')[1],
    tel_1_2:this.props.tel_1.split('-')[2],

    userSelectedTime:0,

    selectedPayDayIndex:0,   // 결제/수령시간 - 결제 예정일 선택 인덱스
    endTime:(this.props.system.week===6&&this.this.props.managerInfo.end_h_sday!==0)?this.props.managerInfo.end_h_sday:this.props.managerInfo.end_h_wday,
    pay_s_time:this.props.pay_s_time,
    pay_e_time:this.props.pay_e_time,
    recive_s_time:this.props.recive_s_time,
    recive_e_time:this.props.recive_e_time,
    today:this.props.system.year+'-'+this.props.system.month+'-'+this.props.system.day+'-'+this.props.system.week,
    payDate:this.props.system.year+'-'+this.props.system.month+'-'+this.props.system.day+'-'+this.props.system.week,
    reciveDayText:this.props.reciveDayText,

    is_working_sat:false,    // 업무하는 토요일

    time_h_pay:this.props.pay_selected_time,   //결제 예정 시간
    time_m_pay:this.props.pay_selected_min,   //결제 예정 분
    time_h_receive:this.props.recive_selected_time,   //수령 예정 시간
    time_m_receive:this.props.recive_selected_min,   //수령 예정 분
    time_date_receive:this.props.system.year+'년'+this.props.system.month+'월'+this.props.system.day+'일',   //수령예정일
  }

  constructor(props) {
    super(props);

    this._displayByType = this._displayByType.bind(this);
    this._displayByAddress = this._displayByAddress.bind(this);
  }

  componentWillMount(nextProps, nextState){

    if(this.state.name_addr==='' && this.state.f_addr<3){
      if(this.state.f_addr===1){
        this.setState({name_addr:'집'});
      } else if(this.state.f_addr===2){
        this.setState({name_addr:'회사'});
      }
    }

    if(this.props.tel_1.indexOf('-') === -1){
      this.setState({
        tel_1_0: this.props.tel_1.slice(0,3),
        tel_1_1: this.props.tel_1.slice(3,7),
        tel_1_2: this.props.tel_1.slice(7,11),
      });
    }

    // 기본배송지 없는 경우 radio 비활성화
    if(this.props.zipcode === '' && this.props.addr_1 === '' && this.props.addr_2 === ''){
      this.setState({
        addressType: "2",
        noBasicAddr: true,
        //f_basic_addr: 1,
      });
    }else{
      this.setState({
        noBasicAddr: false,
        //f_basic_addr: 0,
      });
    }

    // 최근 배송지 없는 경우 radio 비활성화
    if(this.props.latelyAddresses.length > 0 ){
      this.setState({
        noRecentAddr:false,
      });
    }

    // 업무하는 토요일
    if(this.props.system.week===6 && this.props.managerInfo.start_h_sday>0 && this.props.managerInfo.end_h_sday>0){
      this.setState({
        is_working_sat:true,
      })
    }

    if(this.state.endTime===0){
      this.setState({endTime:18})
    }
  }

  componentWillUpdate(nextProps, nextState){
    // 배송방법 변경
    if( this.state.f_trans !== nextState.f_trans ){
      // 받는 사람 기본 설정
      this.setState({
        name_rec:this.props.name_rec,
        tel_1_0:this.props.tel_1.split('-')[0],
        tel_1_1:this.props.tel_1.split('-')[1],
        tel_1_2:this.props.tel_1.split('-')[2],
      });

      const isToday = (nextState.selectedPayDayIndex===0);
      const time_h_pay = isToday?parseInt(this.props.system.hour,10):this.props.pay_s_time;
      this.setState({
        pay_s_time:isToday?parseInt(this.props.system.hour,10):this.props.pay_s_time,
        time_h_pay:time_h_pay,
      });
    }

    // 결제예정일 변경
    if(this.state.selectedPayDayIndex !== nextState.selectedPayDayIndex){
      const isToday = (nextState.selectedPayDayIndex===0);
      this.setState({
        pay_s_time:isToday?parseInt(this.props.system.hour,10):this.props.pay_s_time,
        time_h_pay:isToday?parseInt(this.props.system.hour,10):this.props.pay_s_time,
      });
    }

    // 결제시간, 결제날짜 변경으로 수령 시간 변동
    if( (this.state.time_h_pay !== nextState.time_h_pay) || (this.state.payDate !== nextState.payDate) ){
      let addDay = 0;
      let recive_s_time;
      const index = this.state.selectedPayDayIndex;

      let this_h = parseInt(this.props.system.hour,10);
      let start_h = this.props.managerInfo.start_h_wday!==0?parseInt(this.props.managerInfo.start_h_wday,10):9;
      let pay_h = parseInt(this.props.managerInfo.deliv_3_pc_pay_h_wday,10);
      let use_h = parseInt(this.props.managerInfo.deliv_3_pc_use_h_wday,10);

      if(this.state.is_working_sat){
        start_h = this.props.managerInfo.start_h_sday!==0?parseInt(this.props.managerInfo.start_h_sday,10):9;
        pay_h = parseInt(this.props.managerInfo.deliv_3_pc_pay_h_sday,10);
        use_h = parseInt(this.props.managerInfo.deliv_3_pc_use_h_sday,10);
      }

      if(this.state.f_trans===5){
        pay_h = parseInt(this.props.managerInfo.deliv_5_pc_pay_h_wday,10);
        use_h = parseInt(this.props.managerInfo.deliv_5_pc_use_h_wday,10);

        if(this.state.is_working_sat){
          start_h = this.props.managerInfo.start_h_sday!==0?parseInt(this.props.managerInfo.start_h_sday,10):9;
          pay_h = parseInt(this.props.managerInfo.deliv_5_pc_pay_h_sday,10);
          use_h = parseInt(this.props.managerInfo.deliv_5_pc_use_h_sday,10);
        }
      }

      // 오늘 결제하고 가능한 시간 일 때
      if(nextState.time_h_pay < pay_h){
        if(index===0){
          recive_s_time = this_h + use_h;
        }else{
        recive_s_time = start_h + use_h;
        }
        addDay=index;
      } else {
        recive_s_time = start_h + use_h;
        addDay=index+1;
      }

      const reciveDay = this._addWorkingDay(this.state.today,addDay);
      const setReciveData = (day) => {
        this.setState({
          reciveDayText:(addDay===0)?this.props.reciveDayText:day.split('-')[1]+'월'+day.split('-')[2]+'일',
          time_date_receive:day.split('-')[0]+'년'+day.split('-')[1]+'월'+day.split('-')[2]+'일',
          time_h_receive:recive_s_time,
        });
      }
      const checkHoliday = (day) => {
        request({
          url:window.API_URL+'/common/etc/isHoliday?sch_date='+day,
          method:'post',
        }).then(rsData=>{
          if(rsData.data.dateInfo.is_holiday){
            checkHoliday( this._addWorkingDay(day,1) );
          } else {
            setReciveData(day);
          }
        })
      }

      checkHoliday(reciveDay);
    }

    // 배송지 변경
    if( this.state.addressType !== nextState.addressType ){
      const value = nextState.addressType;
      if(value==="0"){
        this.setState({
          name_rec: this.props.name_rec,
          name_addr: this.props.name_addr,
          tel_1_0: this.props.tel_1.split('-')[0],
          tel_1_1: this.props.tel_1.split('-')[1],
          tel_1_2: this.props.tel_1.split('-')[2],
          zipcode: this.props.zipcode,
          addr_1: this.props.addr_1,
          addr_2: this.props.addr_2,
          f_addr: this.props.f_addr,
          f_basic_addr: 1,
        });
      } else if(value==="2"){
        let basicAddr = 0;
        if(this.state.noBasicAddr) basicAddr = 1;

        this.setState({
          name_rec: '',
          name_addr: '',
          tel_1_0: '010',
          tel_1_1: '',
          tel_1_2: '',
          zipcode: '',
          addr_1: '',
          addr_2: '',
          f_addr: null,
          f_basic_addr: basicAddr,
        });
      } else {
        this.setState({
          f_basic_addr:0,
        });
      }
    }

    // 수령인 변경
    if( this.state.f_recipient !== nextState.f_recipient ){
      if(nextState.f_recipient===0){
        this.setState({
          name_rec: this.props.name_rec,
          tel_1_0:this.props.tel_1.split('-')[0],
          tel_1_1:this.props.tel_1.split('-')[1],
          tel_1_2:this.props.tel_1.split('-')[2],
          f_mycheck:1,
        });
      } else if(nextState.f_recipient===1){
        this.setState({
          name_rec:'',
          tel_1_0:'010',
          tel_1_1:'',
          tel_1_2:'',
          f_mycheck:0,
        });
      }
      this.props._updateState({f_recipient:nextState.f_recipient});
    }

    // 우편변호 변경 제주 산간지역 추가배송지 체크
    if(this.state.addr_1 !== nextState.addr_1){
      this._checkDelivPrice(nextState.addr_1);
    }

    if(this.props.name_rec !== this.state.name_rec){
      this.setState({
        name_rec : nextProps.name_rec,
      });
    }
    if(this.props.tel_1 !== (this.state.tel_1_0+'-'+this.state.tel_1_1+'-'+this.state.tel_1_2)){
      this.setState({
        tel_1_0:nextProps.tel_1.split('-')[0],
        tel_1_1:nextProps.tel_1.split('-')[1],
        tel_1_2:nextProps.tel_1.split('-')[2],
      });
    }
  }

  componentDidUpdate(prevProps, prevState){
    if( this.state.name_rec !== prevState.name_rec ){
      this.props._updateState({ name_rec: this.state.name_rec });
    }
    if( this.state.f_basic_addr !== prevState.f_basic_addr ){
      this.props._updateState({ f_basic_addr: this.state.f_basic_addr });
    }
    if( this.state.zipcode !== prevState.zipcode ){
      this.props._updateState({ zipcode: this.state.zipcode });
    }
    if( this.state.addr_1 !== prevState.addr_1 ){
      this.props._updateState({ addr_1: this.state.addr_1 });
    }
    if( this.state.addr_2 !== prevState.addr_2 ){
      this.props._updateState({ addr_2: this.state.addr_2 });
    }
    if( this.state.name_addr !== prevState.name_addr ){
      this.props._updateState({ name_addr: this.state.name_addr });
    }

    // 배송 방법
    if( this.state.f_trans !== prevState.f_trans ){
      this.props._updateState({ f_trans: this.state.f_trans });

      if(this.state.noBasicAddr){
        this.setState({ addressType:"2" });
      }else{
        this.setState({ addressType:"0" });
      }
    }

    // 수령 동의
    if( this.state.f_mycheck !== prevState.f_mycheck ){
      this.props._updateState({ f_mycheck: this.state.f_mycheck });
    }

    // 연락처 변경
    if(this.state.tel_1_0 !== prevState.tel_1_0){
      this.props._updateState({ tel_1_0: this.state.tel_1_0 });
    }
    if(this.state.tel_1_1 !== prevState.tel_1_1){
      this.props._updateState({ tel_1_1: this.state.tel_1_1 });
    }
    if(this.state.tel_1_2 !== prevState.tel_1_2){
      this.props._updateState({ tel_1_2: this.state.tel_1_2 });
    }

    // 메모
    if(this.state.defaultMemoValue !== prevState.defaultMemoValue && this.state.defaultMemoValue !== '-1'){
      this.props._updateState({ req_memo: this.state.defaultMemoValue });
    }
    if(this.state.defaultMemoText !== prevState.defaultMemoText){
      this.props._updateState({ req_memo: this.state.defaultMemoText });
    }

    // 결제예정 시간,분 변경
    if(this.state.time_h_pay !== prevState.time_h_pay){
      this.props._updateState({time_h_pay: this.state.time_h_pay});
    }
    if(this.state.time_m_pay !== prevState.time_m_pay){
      this.props._updateState({time_m_pay: this.state.time_m_pay});
    }

    // 수령 예정일, 시간,분 변경
    if(this.state.time_h_receive !== prevState.time_h_receive){
      this.props._updateState({time_h_receive: this.state.time_h_receive});
    }
    if(this.state.time_m_receive !== prevState.time_m_receive){
      this.props._updateState({time_m_receive: this.state.time_m_receive});
    }
    if(this.state.time_date_receive !== prevState.time_date_receive){
      this.props._updateState({time_date_receive:this.state.time_date_receive});
    }
  }

  _displayByType = (e) => {
    const value = parseInt(e.target.value,10);

    this.setState({ f_trans: value });
  }

  _displayByAddress = (e) => {
    const value = e.target.value;

    if(this.state.addressType===value || this.state.noRecentAddr) return;

    this.setState({ addressType: value });
  }

  _displayMessageBox = (e) => {
    let v = false;
    if(e.target.value==='-1'){
      v = true;
    }
    this.setState({
      displayMemo: v,
      defaultMemoValue: e.target.value,
    });
  }

  _changeNameRec = (e) => {
    const value = e.target.value;
    this.setState({ name_rec:value });
  }

  _changeAddress = (e) => {
    const index = parseInt(e.target.getAttribute("data-index"),10);
    const selectAddr = this.props.latelyAddresses[index];
    const d = {
      name_rec: selectAddr.name_rec,
      name_addr: selectAddr.name_addr,
      tel_1_0: selectAddr.rec_tel_1.split('-')[0],
      tel_1_1: selectAddr.rec_tel_1.split('-')[1],
      tel_1_2: selectAddr.rec_tel_1.split('-')[2],
      zipcode: selectAddr.rec_zipcode,
      addr_1: selectAddr.rec_addr_1,
      addr_2: selectAddr.rec_addr_2,
      f_basic_addr: 0,
    };
    this.setState(d);

    document.querySelector(".delivery-recent").style.display="none";
  }

  _recentAddress = () => {
    if( this.props.latelyAddresses.length < 1) return false;

    const item = (data) => {
      return data.map((data, index) => {
        if(data.rec_zipcode!=='')
          return(<li key={index} onClick={this._changeAddress} data-index={index}>ㆍ({data.rec_zipcode}) {data.rec_addr_1} {data.rec_addr_2}</li>);
        else
          return false;
      });
    }
    return(
      <div className="delivery-recent">
        <ul>
          {item(this.props.latelyAddresses)}
        </ul>
      </div>
    )
  }

  _popZipcode = (e) => {
    const element_wrap = document.getElementById('zipcodePopContainer');
    const _this = this;
    // 현재 scroll 위치를 저장해놓는다.
    const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new window.daum.Postcode({
       oncomplete: function(data) {
         // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

         // 각 주소의 노출 규칙에 따라 주소를 조합한다.
         // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
         let fullAddr = data.address; // 최종 주소 변수
         let extraAddr = ''; // 조합형 주소 변수

         // 기본 주소가 도로명 타입일때 조합한다.
         if(data.addressType === 'R'){
             //법정동명이 있을 경우 추가한다.
             if(data.bname !== ''){
                 extraAddr += data.bname;
             }
             // 건물명이 있을 경우 추가한다.
             if(data.buildingName !== ''){
                 extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
             }
             // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
             fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
         }

         // 우편번호와 주소 정보를 해당 필드에 넣는다.
         //document.getElementById('sample3_postcode').value = data.zonecode; //5자리 새우편번호 사용
         //document.getElementById('sample3_address').value = fullAddr;
         _this.setState({
           zipcode: data.zonecode,
           addr_1: fullAddr,
         });
         _this.props._updateState({
           zipcode: data.zonecode,
           addr_1: fullAddr,
         });

         // iframe을 넣은 element를 안보이게 한다.
         // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
         element_wrap.style.display = 'none';

         // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
         document.body.scrollTop = currentScroll;
       },
       // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
       onresize : function(size) {
         element_wrap.style.height = size.height+'px';
       },
       width : '100%',
       height : '100%'
    }).embed(element_wrap);

    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
  }

  _asideToggle = (e) => {
    if( e.target.className === "tit-h5" || e.target.nodeName.toLowerCase() === 'h5'){
      const index = e.target.getAttribute('data-index');
      const type = e.target.getAttribute('data-case');

      switch( type ){
        default:
        case "0":
          this.setState({ asideToggle0: index });
          break;
        case "1":
          this.setState({ asideToggle1: index });
          break;
        case "2":
          this.setState({ asideToggle2: index });
          break;
        case "3":
          this.setState({ asideToggle3: index });
          break;
      }
    }
  }

  // 주소지 추가 배송지 체크
  _checkDelivPrice = (_addr) => {
    request({
      url:this.props.apiUrl+'/deliveryCostByBackcountry',
      method:'post',
      body:{area:_addr},
    }).then(rsData=>{
      this.props._updateState({
        deliv_price_add: rsData.data.additionalDeliveryCostInfo.cost
      });
    })
  }

  // 결제/수령시간
  _drawPayDate(){
    const getWeekName = (w) =>{
      let value = '';
      if(w>6)w-=6;
      switch(w){
        default:
        case 0: value = '일'; break;
        case 1: value = '월'; break;
        case 2: value = '화'; break;
        case 3: value = '수'; break;
        case 4: value = '목'; break;
        case 5: value = '금'; break;
        case 6: value = '토'; break;
      }
      return value;
    }
    const days = this.props.miniShopWeekDays;

    return days.map((days,i)=>{
      let y = days.split('-')[0];
      let m = days.split('-')[1];
      let d = days.split('-')[2];
      let w = (parseInt(this.props.system.week,10)+i);

      return(
        <li key={i}>
          <span className="iradio">
            <input type="radio"
              name="selectedPayDay"
              id={"selectedDay"+i}
              value={i}
              data-value={y+'-'+m+'-'+d+'-'+w}
              checked={this.state.selectedPayDayIndex===i}
              onChange={(e)=>{ this.setState({
                disableReciveTime:true,
                selectedPayDayIndex:parseInt(e.target.value,10),
                payDate:y+'-'+m+'-'+d+'-'+w,
              }) }}
            />
            <label htmlFor={"selectedDay"+i}><em>{m}월 {d}일({getWeekName(w)})</em></label>
          </span>
        </li>
      )
    });
  }

  _hourOption(_s,_e){
    let startTime = _s;
    let endTime = _e;
    let timeArr = [];
    for(let i = startTime;i<=endTime;i++){
      if(i<13){
        timeArr.push({
          value:i,
          text:'오전'+i+'시'
        });
      }else{
        timeArr.push({
          value:i,
          text:'오후 '+(i-12)+'시',
        });
      }
    }

    const selectedValue = this.state.selectedPayDayIndex===0?parseInt(this.props.system.hour,10):parseInt(this.props.pay_s_time,10);

    return timeArr.map((arr) =>
      <option value={arr.value} key={arr.value} selected={arr.value===selectedValue}>{arr.text}</option>
    );
  }
  _hourOption2(_s,_e){
    let startTime = _s;
    let endTime = _e;
    let timeArr = [];
    for(let i = startTime;i<=endTime;i++){
      if(i<13){
        timeArr.push({
          value:i,
          text:'오전'+i+'시'
        });
      }else{
        timeArr.push({
          value:i,
          text:'오후 '+(i-12)+'시',
        });
      }
    }

    const selectedValue = this.state.time_h_receive;

    return timeArr.map((arr) =>
      <option value={arr.value} key={arr.value} selected={arr.value===selectedValue}>{arr.text}</option>
    );
  }
  _addWorkingDay = (day,n) =>{
    let y = parseInt(day.split('-')[0],10);
    let m = parseInt(day.split('-')[1],10);
    let d = parseInt(day.split('-')[2],10);
    let w = parseInt(day.split('-')[3],10);

    d+=n;
    w+=n;

    if(w>6) w-=6;

    if(m===2){
      let _d = 28;
      if(y%4===0) _d = 29;

      if(d>_d){
        d-=_d;
        m+=1;
      }
    }else if( (m%2===0 && m<8) || (m%2===0 && m>=8) ){
      if(d>30){
        d-=30;
        m+=1;
      }
    }else if( (m%2===1 && m<8) || (m%2===1 && m>=8) ){
      if(d>31){
        d-=31;
        m+=1;
      }
    }

    if(m>12){
      m-=12;
      y+=1;
    }
    if(m<10) m = String('0'+m);
    if(d<10) d = String('0'+d);

    return y+'-'+m+'-'+d+'-'+w;
  }

  _changePayTime = (e) =>{
    this.setState({
      disableReciveTime:false,
      time_h_pay:parseInt(e.target.value,10),
    });
  }


  render(){
    //배송방법
    const deliveryType = (
      <tr>
        <th scope="row"><span>배송방법 선택</span></th>
        <td>
          <div className="box-td">
            <div className="delivery">
              <ul className="igroup">
                <li>
                  <span className="iradio">
                    <input type="radio" id="f_trans1" name="f_trans" value="1"
                      checked={this.state.f_trans===1}
                      onChange={this._displayByType}
                    />
                    <label htmlFor="f_trans1"><em>택배</em></label>
                  </span>
                </li>
              {
                this.props.managerInfo.f_deliv_3 === 1?
                <li>
                  <span className="iradio">
                    <input type="radio" id="f_trans3" name="f_trans" value="3"
                      checked={this.state.f_trans===3}
                      onChange={this._displayByType}
                    />
                    <label htmlFor="f_trans3"><em>퀵서비스</em></label>
                  </span>
                </li>
                : null
              }
              {
                this.props.managerInfo.f_deliv_6 === 1?
                <li>
                  <span className="iradio">
                    <input type="radio" id="f_trans6" name="f_trans" value="6"
                      checked={this.state.f_trans===6}
                      onChange={this._displayByType}
                    />
                    <label htmlFor="f_trans6"><em>화물</em></label>
                  </span>
                </li>
                : null
              }
              {
                this.props.managerInfo.f_deliv_4 === 1?
                <li>
                  <span className="iradio">
                    <input type="radio" id="f_trans4" name="f_trans" value="4"
                      checked={this.state.f_trans===4}
                      onChange={this._displayByType}
                    />
                    <label htmlFor="f_trans4"><em>직접수령</em></label>
                  </span>
                </li>
                : null
              }
              </ul>
            </div>
          </div>
        </td>
      </tr>
    );

    const aboutServiceCorp = (
      <tr>
        <th scope="row"><span>택배 수령</span></th>
        <td>
          <div className="box-td">
            <span className="delivery-name">{this.props.managerInfo.name_deliv}</span>
            <img src={this.props.managerInfo.image_delivery} alt={this.props.managerInfo.name_deliv} className="delivery-logo" height="25"/>
          </div>
        </td>
      </tr>
    );
    const aboutQuick = (
      <tr>
        <th scope="row"><span>퀵서비스 수령이란</span></th>
        <td>
          <div className="box-td">
            수도권 지역에서 당일 빠른 시간안에 제품을 수령하는 방법입니다. <span className="point_color">(일/공휴일 제외)</span>
          </div>
        </td>
      </tr>
    );
    const aboutCargo = (
      <tr>
        <th scope="row"><span>화물 수령</span></th>
        <td>
          <div className="box-td">
            선택하신 영업소로 오전에 직접 방문하셔서 주문상품을 수령하는 방법입니다. <span className="point_color">(일/공휴일 제외)</span>
          </div>
        </td>
      </tr>
    );
    const aboutDirect = (
      <tr>
      	<th scope="row"><span>직접수령이란?</span></th>
      	<td>
      		<div className="box-td">
      			결제 이후 매장에 직접 방문하여 주문상품을 수령하는 방법입니다. <span className="point_color">(일/공휴일 제외)</span>
      		</div>
      	</td>
      </tr>
    );

    //배송지 선택
    const selectDelivery = (
      <tr>
      	<th scope="row"><span className="required">배송지 선택</span></th>
      	<td>
      		<div className="box-td">
      			<div className="delivery">
      				<ul className="igroup">
      					<li>
      						<span className="iradio">
      							<input type="radio" id="id-di11" name="addressType" value="0"
                      disabled={this.state.noBasicAddr}
                      checked={this.state.addressType==="0"}
                      onChange={this._displayByAddress}
                    />
      							<label htmlFor="id-di11"><em>기본 배송지</em></label>
      						</span>
      					</li>
      					<li>
      						<span className="iradio">
      						<input type="radio" id="id-di22" name="addressType" value="1"
                    disabled={this.state.noRecentAddr}
                    checked={this.state.addressType==="1"}
                    onChange={this._displayByAddress}
                  />
      						<label htmlFor="id-di22" onMouseDown={this._displayByAddress}><em>최근 배송지</em></label>
      						</span>
      					</li>
      					<li>
      						<span className="iradio">
      						<input type="radio" id="id-di33" name="addressType" value="2"
                    checked={this.state.addressType==="2"}
                    onChange={this._displayByAddress}
                  />
      						<label htmlFor="id-di33"><em>신규 배송지</em></label>
      						</span>
      					</li>
      				</ul>

              {
                this.state.addressType === "1"? <this._recentAddress /> : ''
              }
      			</div>
      		</div>
      	</td>
      </tr>
    );

    //이름
    const userName = (
      <tr>
      	<th scope="row"><label htmlFor="id-name" className="required">이름</label></th>
      	<td>
      		<div className="box-td">
      			<input type="text" id="id-name"
              className={this.props.check_validation_recipient['name_rec']===1?"istyle ialert":"istyle"}
              style={{width:'250px'}}
              maxLength="30"
              value={this.state.name_rec}
              onChange={this._changeNameRec}
            />
            {
              this.props.check_validation_recipient['name_rec']===1?
              <div className="alert-msg fail">이름(성명)을 입력해 주세요.</div> : null
            }
      		</div>
      	</td>
      </tr>
    );

    //배송지명
    const deliverName = (
      <tr>
      	<th scope="row"><label htmlFor="id-destName">배송지명</label></th>
      	<td>
    			<div className="box-td">
    				<input type="text" id="id-destName" className="istyle" style={{width:'250px'}}
              maxLength="30"
              value={this.state.name_addr}
              onChange={(e) => {
                this.setState( {name_addr:e.target.value} );
              }}
            />
    			</div>
      	</td>
      </tr>
    );

    //연락처
    const userTel = (
      <tr>
      	<th scope="row"><label htmlFor="id-phone" className="required">연락처</label></th>
      	<td>
    			<div className="box-td">
            <OptionData
              mode="tels"
              id="id-phone"
              className={this.props.check_validation_recipient['tel_1']?"sstyle ialert":"sstyle"}
              defaultValue={this.state.tel_1_0}
              onChange={(e) => {this.setState({ tel_1_0 : e.target.value });}}
            />
  					<em className="dash"></em>
  					<input type="text" title="중간자리" style={{width:'80px'}}
              className={this.props.check_validation_recipient['tel_1']?"istyle num ialert":"istyle num"}
              maxLength="4"
              value={this.state.tel_1_1}
              onChange={(e) => {
                const value = isNaN(parseInt(e.target.value,10))?'':parseInt(e.target.value,10);
                this.setState({ tel_1_1 : value });
              }}
            />
  					<em className="dash"></em>
  					<input type="text" title="끝자리" style={{width:'80px'}}
              className={this.props.check_validation_recipient['tel_1']?"istyle num ialert":"istyle num"}
              maxLength="4"
              value={this.state.tel_1_2}
              onChange={(e) => {
                const value = isNaN(parseInt(e.target.value,10))?'':parseInt(e.target.value,10);
                this.setState({ tel_1_2 : value });
              }}
            />
  					{/* <span className="safe-number">
  						<span className="icheck"><input type="checkbox" id="id-safe" name="name-safe"/>
  							<label htmlFor="id-safe"><em>안심번호 사용</em></label>
  						</span>
  					</span>

  					<button type="button" className="btn-question-tip btn-safenumber-guide"><img src="http://img.happyshopping.kr/img_static/img_pres/_v3/ico_question.png" alt="안심번호" /></button>

  					<div className="tooltip layer-safenumber">
							<h4 className="tit-h4">안심번호 서비스 이용 안내</h4>
							<p>안심번호 서비스는 구매회원의 개인정보보호를 위해 상품 주문시<br/>실제 연락처 정보가 판매자 또는 택배사에게 노출되지 않도록<br/>일회용 안심번호를 발급해 드리는 서비스입니다.</p>

							<ol>
								<li>1. 개인정보인 연락처 정보 대신 일회용 안심번호가 사용됩니다.<br/>판매자와 택배사는 실제 연락처 정보를 알 수 없도록 안심번호가<br/>전달됩니다.</li>
								<li>2. 주문처리 종료(구매확정, 취소/환불완료), 또는 일정기간 이후<br/>안심번호는 자동으로 해지되며, 해지 이후 발생되는 클레임<br/>요청 시에는 회원님의 실제 연락처가 판매자에게 제공됩니다.</li>
								<li>3. 안심번호 사용 시, 판매자가 주문처리 과정에서 개인적으로<br/>발송하는 SMS나택배사에서 발송하는 배송예정기간 등의 알림<br/>SMS가 전달되지 않을 수 있습니다.</li>
								<li>4. 본 서비스는 ○○○○에서 위탁해 무료로 제공해 드리며, 해당<br/>업체에 회원님의 연락처 정보가 제공됩니다.</li>
							</ol>
  					</div> */}
            {
              this.props.check_validation_recipient['tel_1']?
              <div className="alert-msg fail">연락처를 확인해 주세요.</div> : null
            }
    			</div>
      	</td>
      </tr>
    );

    //배송지
    const deliveryAddr = (
      <tr>
      	<th scope="row" className="vt"><label htmlFor="zipcode" className="required">배송지</label></th>
      	<td>
    			<div className="box-td">
  					<div className="zipcode">
							<input type="text" id="zipcode" name="zipcode" style={{width:'100px'}} maxLength="6"
                className={this.props.check_validation_recipient['addr']?"istyle num ialert":"istyle num"}
                value={this.state.zipcode}
                readOnly={true}
                onClick={this._popZipcode}
              />
							<button type="button" className="btn-zipcode" onClick={this._popZipcode}>우편번호</button>

							<span className="icheck defalut-delivery">
            		<input type="checkbox" id="f_basic_addr" name="f_basic_addr"
                  checked={this.state.f_basic_addr===1}
                  onChange={(e)=>{
                    if( this.state.addressType === "0") return false;
                    const value = e.target.checked? 1: 0;
                    this.setState({f_basic_addr:value});
                  }}
                />
            		<label htmlFor="f_basic_addr"><em>기본 배송지로 선택</em></label>
							</span>
  					</div>
            <div id="zipcodePopContainer" style={{
              display:'none',
              border:'1px solid #999',
              width:'448px',
              height:'300px',
              marginBottom:'10px',
              position:'relative'}}>
              <img src="//t1.daumcdn.net/localimg/localimages/07/postcode/320/close.png"
                id="zipcodePopClose"
                style={{
                  cursor:'pointer',
                  position:'absolute',
                  right:0,
                  top:'-1px',
                  zIndex:1
                }} onClick={(e)=>{
                  document.getElementById('zipcodePopContainer').style.display='none';
                }} alt="접기 버튼"/>
            </div>

  					<input type="text" title="상세주소1" style={{width:'450px', marginRight:'10px'}}
              className={this.props.check_validation_recipient['addr']?"istyle ialert":"istyle"}
              readOnly={true}
              value={this.state.addr_1}
            /><input type="text" title="상세주소2" style={{width:'240px'}}
              className={this.props.check_validation_recipient['addr']?"istyle ialert":"istyle"}
              maxLength="100"
              value={this.state.addr_2}
              onChange={(e)=>{ this.setState({ addr_2: e.target.value }); }}
            />
            {
              this.props.check_validation_recipient['addr']?
              <div className="alert-msg fail">배송지를 입력해 주세요.</div> : null
            }
    			</div>
      	</td>
      </tr>
    );

    //배송메모
    const userMemo = (
      <tr>
      	<th scope="row" className="vt"><label htmlFor="id-memo">배송 메모</label></th>
      	<td>
    			<div className="box-td">
  					<select id="id-memo" className="sstyle memo-slt"
              onChange={this._displayMessageBox}
              defaultValue={this.state.defaultMemoValue}
            >
							<option value="0">메세지를 선택해 주세요</option>
              <option value="직접 받을게요.">직접 받을게요.</option>
              <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
              <option value="경비실에 맡겨 주세요.">경비실에 맡겨 주세요.</option>
              <option value="집앞에 놔주세요.">집앞에 놔주세요.</option>
              <option value="택배함에 넣어주세요.">택배함에 넣어주세요.</option>
              <option value="부재시 핸드폰으로 연락주세요.">부재시 핸드폰으로 연락주세요.</option>
              <option value="부재시 집 앞에 놔주세요.">부재시 집 앞에 놔주세요.</option>
              <option value="부재시 경비실에 맡겨주세요.">부재시 경비실에 맡겨주세요.</option>
              <option value="-1">직접입력</option>
  					</select>

            {
              this.state.displayMemo?
    					<div className="direct-memo">
      					<textarea cols="50" rows="5" className="itext" maxLength="50"
                  onKeyUp={(e) => {
                    this.setState({ defaultMemoText:e.target.value });
                    document.querySelector("#menuCnt").innerHTML = e.target.value.length;
                  }}
                  defaultValue={this.state.defaultMemoText}
                ></textarea><span className="ls-nor word-cnt"><strong id="menuCnt">0</strong>/50</span>
    					</div>
              : null
            }
    			</div>
      	</td>
      </tr>
    );

    //방문영업소 선택
    const selectOffice = (
      <tr>
      	<th scope="row" className="vt"><label htmlFor="id-office" className="required">방문 영업소 선택</label></th>
      	<td>
          <LayerFindOffice
            apiUrl={this.props.apiUrl}
            check_validation_recipient={this.props.check_validation_recipient}
          />
      	</td>
      </tr>
    );

    //결제/수령시간 선택
    const selectPickupTime = (
      <tr>
      	<th scope="row" className="vt"><span className="required">결제/수령 시간</span></th>
      	<td>
          <div className="box-td">
            <div className="paymentdate">
            	<span className="t">결제 예정일</span>
            	<ul className="igroup">
                {this._drawPayDate()}
            	</ul>
            </div>

            <div className="quickservice">
              <label htmlFor="id-oclock" style={{cursor:'default'}}>결제 예정시간(변경가능)</label>
              <select id="id-oclock" className="sstyle"
                disabled={this.state.disableTime}
                //defaultValue={this.state.time_h_pay}
                onChange={this._changePayTime}
              >
                { this._hourOption(this.state.pay_s_time,this.state.pay_e_time) }
              </select>
              <select title="분 선택"
                className="sstyle"
                name="time_m_pay"
                disabled={this.state.disableTime}
                defaultValue={this.state.time_m_pay}
                onChange={(e)=>{this.setState({time_m_pay:parseInt(e.target.value,10)})}}
              >
                <option value="0">0분</option>
                <option value="30">30분</option>
              </select>
              <span>까지 결제하실 경우</span>
            </div>
            <div className="quickservice">
              <label htmlFor="id-oclock" style={{cursor:'default'}}>수령 예정시간(변경가능)</label>
              <em>{this.state.reciveDayText}</em>
              <select id="id-oclock" className="sstyle"
                disabled={this.state.disableReciveTime}
                //defaultValue={this.state.time_h_receive}
              >
                { this._hourOption2(this.state.time_h_receive,this.state.endTime) }
              </select>
              <select title="분 선택" className="sstyle" name="time_m_receive"
                disabled={this.state.disableReciveTime}
                //defaultValue={this.state.time_m_receive}
                onChange={(e)=>{this.setState({time_m_receive:parseInt(e.target.value,10)})}}
              >
                <option value="0">0분</option>
                <option value="30">30분</option>
              </select>
              <span>이후에 수령 가능</span>
            </div>

            <ul className="service-noti">
              <li>- 결제 예정시간과 실제 결제 시간이 다를 경우에는 상품 준비 시간이 지연될 수 있습니다.</li>
              <li>- 교통상황, 기상악화 등으로 도착시간이 다소 지연될 수 있습니다.</li>
            </ul>
          </div>
      	</td>
      </tr>
    );

    //수령인 선택
    const selectReceiver = (
      <tr>
      	<th scope="row" className="vt"><span className="required">수령인 선택</span></th>
      	<td>
      		<div className="box-td">
      			<div className="agent-info_slt">
      				<ul className="igroup">
      					<li>
      						<span className="iradio">
      							<input type="radio" id="f_recipient0" name="f_recipient" value="0"
                      checked={this.state.f_recipient===0}
                      onChange={(e) => { this.setState({f_recipient:parseInt(e.target.value,10)}) }}
                    />
      							<label htmlFor="f_recipient0"><em>본인 수령(본인 신분증 지참)</em></label>
      						</span>
      					</li>
      					<li>
      						<span className="iradio">
      							<input type="radio" id="f_recipient1" name="f_recipient" value="1"
                      checked={this.state.f_recipient===1}
                      onChange={(e) => { this.setState({f_recipient:parseInt(e.target.value,10)}) }}
                    />
      							<label htmlFor="f_recipient1"><em>대리인 수령</em></label>
      						</span>
      					</li>
      				</ul>

              {
                this.state.f_recipient === 1 ?
          				<div className="agent-info_slt_chk">
          					<span className={this.props.check_validation_recipient['f_mycheck']?"icheck ialert":"icheck"}>
                      <input type="checkbox" id="f_mycheck" name="f_mycheck"
                        checked={this.state.f_mycheck===1}
                        onChange={(e)=>{
                          const value = e.target.checked? 1:0;
                          this.setState({ f_mycheck: value });
                          this.props._updateState({ f_mycheck: value });
                        }}
                      />
          						<label htmlFor="f_mycheck"><em>대리인 수령동의 <span className="point_color">(대리인 신분증 지참)</span></em></label>
          					</span>
                    {
                      this.props.check_validation_recipient['f_mycheck']?
                      <div className="alert-msg fail" style={{marginLeft:0}}>대리인 수령동의를 체크해 주세요.</div> : null
                    }

          					<ul>
          						<li>
          							<label htmlFor="name_rec">대리인 성명</label>
          							<input type="text" id="name_rec" name="name_rec" style={{width:'300px'}} maxLength="10"
                          className={this.props.check_validation_recipient['name_rec']!==0?"istyle ialert":"istyle"}
                          value={this.state.name_rec}
                          onChange={this._changeNameRec}
                        />
          						</li>
          						<li>
          							<label htmlFor="id-agentphone">대리인 연락처</label>
            						<OptionData
                          mode="tels"
                          id="id-agentphone"
                          className={this.props.check_validation_recipient['name_rec']!==0?"sstyle ialert":"sstyle"}
                          defaultValue={this.state.tel_1_0}
                          onChange={(e) => {this.setState({ tel_1_0 : e.target.value });}}
                        />
          							<em className="dash"></em>
          							<input type="text" title="중간자리" style={{width:'80px'}} maxLength="4"
                          className={this.props.check_validation_recipient['name_rec']!==0?"istyle num ialert":"istyle num"}
                          value={this.state.tel_1_1}
                          onChange={(e)=>{
                            const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                            this.setState({tel_1_1:value});
                          }}
                        />
          							<em className="dash"></em>
          							<input type="text" title="끝자리" style={{width:'80px'}} maxLength="4"
                          className={this.props.check_validation_recipient['name_rec']!==0?"istyle num ialert":"istyle num"}
                          value={this.state.tel_1_2}
                          onChange={(e)=>{
                            const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                            this.setState({tel_1_2:value});
                          }}
                        />
          						</li>
          					</ul>
                    {
                      this.props.check_validation_recipient['name_rec']!==0?
                        this.props.check_validation_recipient['name_rec']===1?
                        <div className="alert-msg fail">대리인 정보를 입력해 주세요.</div>
                        :
                        <div className="alert-msg fail">대리인 정보를 확인해 주세요.</div>
                      : null
                    }
          				</div>
                  :
                  ''
              }
      			</div>
      		</div>
      	</td>
      </tr>
    );

    //택배 layout
    let tableLayout;
    switch (this.state.f_trans) {
    	default:
    	case 1:
    		tableLayout = (
    			<tbody>
    				{deliveryType}
    				{aboutServiceCorp}
    				{selectDelivery}
    				{userName}
    				{deliverName}
    				{userTel}
    				{deliveryAddr}
    				{userMemo}
    			</tbody>
    		);
    	break;
    	case 3:
    		tableLayout = (
    			<tbody>
    				{deliveryType}
    				{aboutQuick}
            {selectPickupTime}
            {selectDelivery}
    				{userName}
    				{userTel}
    				{deliveryAddr}
    				{userMemo}
    			</tbody>
    		);
    	break;
    	case 6:
    		tableLayout = (
    			<tbody>
    				{deliveryType}
    				{aboutCargo}
    				{selectOffice}
    				{selectReceiver}
    				{userMemo}
    			</tbody>
    		);
    	break;
    	case 4:
    		tableLayout = (
    			<tbody>
    				{deliveryType}
    				{aboutDirect}
    				{selectReceiver}
    				{selectPickupTime}
    				{userMemo}
    			</tbody>
    		);
    	break;
    }

    //오른쪽 layout
    let asideLayout;
    switch (this.state.f_trans) {
      default:
      case 1:
        asideLayout = (
          <div className="delivery-guide">
          	<div className="delivery-guide_step">
          		<h4 className="tit-h4">택배 진행 순서</h4>
          		<ol onClick={this._asideToggle}>
          			<li className={this.state.asideToggle0 === "0"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="0" data-case="0"><em>1</em>상품 주문 및 결제<i className="ic"></i></h5>
          					<div className="step">
          						당일발송 가능 결제시간
          						<ul>
          							<li>ㆍ평일 오전 10:00 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:00 ~ 오후 11:00</li>
          						</ul>
          						※ 조립PC의 경우
          						<ul>
          							<li>ㆍ평일 오전 10:00 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:00 ~ 오후 11:00</li>
          						</ul>
          					</div>
          				</div>
          			</li>
            			<li className={this.state.asideToggle0 === "1"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="1" data-case="0"><em>2</em>상품 준비 및 포장<i className="ic"></i></h5>
          					<div className="step">
          						부품일 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 2시간  소요</li>
          						</ul>
          						조립PC의 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 3시간  소요</li>
          						</ul>
          						결제 확인 후 상품 준비 및 포장
          					</div>
          				</div>
          			</li>
            			<li className={this.state.asideToggle0 === "2"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="2" data-case="0"><em>3</em>택배 발송<i className="ic"></i></h5>
          					<div className="step">
          						<span className="base_color3">발송 후 <em className="base_color1">송장번호 문자메시지가 발송</em><br/>됩니다.</span>
          					</div>
          				</div>
          			</li>
            			<li className={this.state.asideToggle0 === "3"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="3" data-case="0"><em>4</em>배송 완료<i className="ic"></i></h5>
          					<div className="step"><span className="base_color3">고객님이 선택한 배송지로 안전하게<br/>배송됩니다.</span></div>
          				</div>
          			</li>
          		</ol>
          	</div>

          	<div className="delivery-guide_guide">
          		<h4 className="tit-h4">이용안내</h4>
          		<ul>
          			<li>
          				택배추적은 제품 발송일 다음날 오전부터<br/>
          				택배사 홈페이지에서 확인 가능 합니다.
          			</li>
          			<li>
          				배송기간은 제품 발송 후 1~2일 이내에<br/>
          				받으실 수 있습니다.
          			</li>
          		</ul>
          	</div>
          </div>
        )
      break;
      case 3:
        asideLayout = (
          <div className="delivery-guide">
          	<div className="delivery-guide_step">
              <LayerQuickCosts
                apiUrl={this.props.apiUrl}
              />

          		<ol onClick={this._asideToggle}>
                <li className={this.state.asideToggle1==="0"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="0" data-case="1"><em>1</em>상품 주문 및 결제<i className="ic"></i></h5>
          					<div className="step">
          						당일 퀵서비스 가능 결제시간
          						<ul>
          							<li>ㆍ평일 오전 10:30 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:30 ~ 오후 11:00</li>
          						</ul>
          						※ 조립PC의 경우
          						<ul>
          							<li>ㆍ평일 오전 10:30 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:30 ~ 오후 11:00</li>
          						</ul>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle1==="1"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="1" data-case="1"><em>2</em>상품 준비 및 포장<i className="ic"></i></h5>
          					<div className="step">
          						부품일 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 4시간  소요</li>
          						</ul>
          						조립PC의 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 5시간  소요</li>
          						</ul>
          						결제 확인 후 상품 준비 및 포장
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle1==="2"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="2" data-case="1"><em>3</em>택배 발송<i className="ic"></i></h5>
          					<div className="step">
          						<span className="base_color3">퀵서비스 발송완료 후 <em className="base_color1">문자메시지가<br/>발송</em>됩니다.</span>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle1==="3"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="3" data-case="1"><em>4</em>배송 완료<i className="ic"></i></h5>
          					<div className="step"><span className="base_color3">고객님이 선택한 배송지로 안전하게<br/>배송됩니다.</span></div>
          				</div>
          			</li>
          		</ol>
          	</div>

          	<div className="delivery-guide_guide">
          		<h4 className="tit-h4">이용안내</h4>
          		<ul>
          			<li>
          				배송 지연 제품 / 대량구매제품 / 조립PC 수량<br/>주문은 준비시간이 지연될 수 있으니 담당자와<br/>통화하여 상품 준비 소요시간을 꼭 확인하시기<br/>바랍니다.
          			</li>
          			<li>
          				입금마감시간 이후에 결제확인이 된 주문건은<br/>익일 수령이 가능합니다. (단, 주말/공휴일 제외)
          			</li>
          		</ul>
          	</div>
          </div>
        )
      break;
      case 6:
        asideLayout = (
          <div className="delivery-guide">
          	<div className="delivery-guide_step">
          		<h4 className="tit-h4">경동화물 진행 순서</h4>

          		<ol onClick={this._asideToggle}>
          			<li className={this.state.asideToggle2==="0"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="0" data-case="2"><em>1</em>상품 주문 및 결제<i className="ic"></i></h5>
          					<div className="step">
          						당일발송 가능 결제시간
          						<ul>
          							<li>ㆍ평일/토요일 휴무</li>
          						</ul>
          						※ 조립PC의 경우 당일발송 없이<br/>
          						<span className="gap">다음날 발송됩됩니다.</span>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle2==="1"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="0" data-case="2"><em>2</em>상품 준비 및 포장<i className="ic"></i></h5>
          					<div className="step">
          						부품일 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 0시간 소요</li>
          						</ul>
          						조립PC의 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 0시간 소요</li>
          						</ul>
          						결제 확인 후 상품 준비 및 포장
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle2==="2"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="2" data-case="2"><em>3</em>경동화물 발송<i className="ic"></i></h5>
          					<div className="step">
          						<span className="base_color3">경동화물 상품 발송 후<br/><em className="base_color1">송장번호 문자메시지가 발송</em>됩니다.</span>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle2==="3"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="3" data-case="2"><em>4</em>배송 완료<i className="ic"></i></h5>
          					<div className="step"><span className="base_color3">고객님이 선택한 영업소로 방문하셔서<br/>직접 상품 수령하시면 됩니다.</span></div>
          				</div>
          			</li>
          		</ol>
          	</div>

          	<div className="delivery-guide_guide">
          		<h4 className="tit-h4">이용안내</h4>
          		<ul>
          			<li>
          				경동화물은 고객님께서 선택하신 영업소로<br/>방문하여 상품을 수령해야 합니다.
          			</li>
          		</ul>
          	</div>
          </div>
        )
      break;
      case 4:
        asideLayout = (
          <div className="delivery-guide">
          	<div className="delivery-guide_step">
          		<LayerOfficeMap
                apiUrl={this.props.apiUrl}
                map_info_public={this.props.managerInfo.map_info_public}
                map_info_parking={this.props.managerInfo.map_info_parking}
                addr_1={this.props.managerInfo.addr_1}
                addr_2={this.props.managerInfo.addr_2}
              />

          		<ol onClick={this._asideToggle}>
          			<li className={this.state.asideToggle3==="0"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="0" data-case="3"><em>1</em>상품 주문 및 결제<i className="ic"></i></h5>
          					<div className="step">
          						당일발송 가능 결제시간
          						<ul>
          							<li>ㆍ평일 오전 10:30 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:30 ~ 오후 11:00</li>
          						</ul>
          						※ 조립PC의 경우
          						<ul>
          							<li>ㆍ평일 오전 10:30 ~ 오후 4:00</li>
          							<li>ㆍ토요일 오전 10:30 ~ 오후 11:00</li>
          						</ul>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle3==="1"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="1" data-case="3"><em>2</em>상품 준비 및 포장<i className="ic"></i></h5>
          					<div className="step">
          						부품일 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 4시간  소요</li>
          						</ul>
          						조립PC의 경우 소요시간
          						<ul>
          							<li>ㆍ결제 확인 후 5시간  소요</li>
          						</ul>
          						결제 확인 후 상품 준비 및 포장
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle3==="2"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="2" data-case="3"><em>3</em>포장 완료<i className="ic"></i></h5>
          					<div className="step">
          						<span className="base_color3">포장완료 후 직접수령 가능<br/><em className="base_color1">문자메시지가 발송</em>됩니다.</span>
          					</div>
          				</div>
          			</li>
          			<li className={this.state.asideToggle3==="3"? 'active': null}>
          				<div className="box">
          					<h5 className="tit-h5" data-index="3" data-case="3"><em>4</em>배송 완료<i className="ic"></i></h5>
          					<div className="step">
          						<span className="base_color3">매장에 방문하여 제품을 수령합니다.</span><br/>
          						제품 수령 가능시간
          						<ul>
          							<li>ㆍ평일 오전 10:30 ~ 오후 07:00</li>
          							<li>ㆍ토요일 오전 10:30 ~ 오후 03:00</li>
          						</ul>
          					</div>
          				</div>
          			</li>
          		</ol>
          	</div>

          	<div className="delivery-guide_guide">
          		<h4 className="tit-h4">이용안내</h4>
          		<ul>
          			<li>
          				배송 지연 제품 / 대량구매제품 / 조립PC 수량<br/>주문은 준비시간이 지연될 수 있으니 담당자와<br/>통화하여 제품 준비 소요시간을 꼭 확인
          			</li>
          		</ul>
          	</div>
          </div>
        )
      break;
    }

    return(
      <article className="order-body_row" id="areaRecipient">
      	<div className="order-body_row_head">
      		<h3 className="tit-h3">받는사람/배송지 정보</h3>
      		<span className="noti-required">표시는 필수 입력</span>
      	</div>

      	<p className="delivery-noti">도서산간 지역의 경우 추후 수령 시 추가 배송비가 과금될 수 있습니다.</p>

        <div className="box-board responsive">
          <div className="box-board_body">
            <table className="board thead-lft">
              <caption><span>받는사람/배송지 정보 보기</span></caption>
              <colGroup>
                <col style={{width:'150px'}} />
                <col />
              </colGroup>
              { tableLayout }
            </table>
          </div>

          { asideLayout }
        </div>
      </article>
    );
  }
}
