import React, { Component } from 'react'

import Utils from '../../utils/Utils'

export default class Buyer extends Component{
  static defaultProps = {
    cntMin:2,     // 입력시간 표시(분)
    cntSec:59,    // 입력시간 표시(초)
    disableModify:false,  // 휴대폰 수정 불가능 상태
    disabledInput:false,  // 수정 요청 중이면 true
    inputTelState: 0,    // 0: 기본 상태, 1:입력 중 유효하지 않음, 2: 입력 중 동일 번호, 3: 입력중 유효함
    isAuthValid:true,    // 입력한 인증여부 유효성 여부
    isAuthComplete:false, // 인증 성공 여부
  }

  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    idx_member: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    hp: React.PropTypes.string.isRequired,
  }

  state = {
    disableModify:this.props.disableModify,
    inputTelState:this.props.inputTelState,
    isAuthValid:this.props.isAuthValid,
    isAuthComplete:this.props.isAuthComplete,
    authedTel:this.props.hp,    // 인증 된 사용자 번호
    authTel:this.props.hp,   // 변경하는 사용자 번호
    authNum: '',  // 변경시 받은 인증 번호
  }

  // componentWillMount(nextProps, nextState){
  // }

  _updateTel = () => {
    const element = document.getElementById('userTel');
    const newhp = this._numToTel(this.state.authTel);
    this.setState({ authTel: newhp });    // 번호 형식 정리

    // 번호가 같으면
    if( newhp === this.state.authedTel){
      this.setState({ inputTelState:2 });
      element.className = 'phone-number fail';
      return;
    }

    // 번호가 유효하지 않으면
    if( !Utils.format.isMobile(newhp) ){
      this.setState({ inputTelState:1 });
      element.className = 'phone-number fail';
      return;
    }

    // 번호가 유호하면 send하고 countdown 한다
    const eventSend = () =>{
      Utils.request({
        url:this.props.apiUrl+'/sendCertifyCodeByPhone/'+this.props.idx_member,
        method:'post',
        body:{
          idx_member:this.props.idx_member,
          hp:newhp,
        },
      }).then(rsData=>{
        this.setState({
          authNum:'',
          certifyCodeHash:rsData.data.certifyCodeHash,
          isAuthValid:true,
          isAuthComplete:false,
        });
      })
    }
    element.className = 'phone-number success';
    this.setState({ inputTelState:3 });
    this._countDown('start');
    eventSend();
  }

  _numToTel = (a) => {
    if( a.split('-').length !== 3){
      let newhp = a.replace(/-/gi,'');
      return newhp.substring(0,3) + '-' + newhp.substring(3,7) + '-' + newhp.substring(7,11);
    } else {
      return a;
    }
  }

  _timer = null

  _countDowninit = () => {
    clearInterval(this._timer);
    this.setState({
      disableModify:this.props.disableModify,
      disabledInput:this.props.disabledInput,

      inputTelState:this.props.inputTelState,
      isAuthValid:this.props.isAuthValid,
      isAuthComplete:this.props.isAuthComplete,
      authTel:this.state.authedTel,
      cntMin:this.props.cntMin,
      cntSec:this.props.cntSec,
    });
  }

  _countDown = (arg) => {
    if(arg==='start'){
      this.setState({
        cntMin:this.props.cntMin,
        cntSec:this.props.cntSec,
        disableModify:true,
        disabledInput:true,
      });

      this._timer = window.setInterval(function(){
        let s = this.state.cntSec - 1;
        if( s < 0){
          s = 59;
          let m = this.state.cntMin - 1;
          if(m>-1){
            this.setState({ cntMin:m });
          } else {
            // 시간 만료 상태 초기화
            this._countDowninit();
          }
        }

        this.setState({
          cntSec: s
        });
      }.bind(this),1000);
    } else if(arg==='end'){
      this._countDowninit();
    }
  }

  _updateUserInfo = () =>{
    Utils.request({
      url:this.props.apiUrl+'/updatePhone/'+this.props.idx_member,
      method:'post',
      body:{
        idx_member: this.props.idx_member,
        hp: this.state.authTel,
      }
    })
  }

  _authSubmit = (e) =>{
    const value = this.refs.inputAuthNum.value;
    const element = document.getElementById('authTel');

    Utils.request({
      url:this.props.apiUrl+'/certifyCodeConfirm',
      method:'post',
      body:{
        certifyCodeHash:this.state.certifyCodeHash,
        certifyCode:value,
      }
    }).then(rsData=>{
      if(rsData.data.resultCode === 2110){     // 인증 성공
        element.className = 'certi-number success';
        this.setState({
          isAuthValid:true,
          isAuthComplete:true,
          authedTel:this.state.authTel,
        });

        setTimeout(function(){
          element.className = 'certi-number';
          this.setState({
            disableModify:false,
            disabledInput:false,
            isAuthComplete:false,
            inputTelState:0,
          });
          this._countDowninit();
          document.getElementById('userTel').className = 'phone-number';
        }.bind(this),1000);

        this._updateUserInfo();
      //} else if(rsData.data.resultCode === 2111) {     // 유효하지 않은 코드
      } else {
        element.className = 'certi-number fail';
        this.setState({
          isAuthValid:false,
          isAuthComplete:false,
        });
      }
    })
  }

  render(){
    return(
      <article className="order-body_row">
      	<h3 className="tit-h3">구매자 정보</h3>
      	<div className="box-board">
      		<table className="board thead-lft">
      			<caption><span>구매자 정보 보기</span></caption>
      			<colgroup>
      				<col style={{width:'150px'}}/>
      				<col/>
      			</colgroup>
      			<tbody>
      			<tr>
      				<th scope="row"><span>이름</span></th>
      				<td>
      					<div className="box-td">
      						<strong>{this.props.name}</strong>
      					</div>
      				</td>
      			</tr>
      			<tr>
      				<th scope="row"><span>이메일</span></th>
      				<td>
      					<div className="box-td">
      						<strong className="ls-nor">{this.props.email}</strong>
      					</div>
      				</td>
      			</tr>
      			<tr>
      				<th scope="row"><label htmlFor="id-phonenumber">휴대폰 번호</label></th>
      				<td>
      					<div className="box-td">
                  <div id="userTel">
                    <input type="text" id="id-phonenumber" ref="phoneNumber" className="istyle" style={{width:'190px'}}
                      maxLength="13"
                      value={this.state.authTel}
                      onChange={(e)=>{
                        const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                        this.setState({authTel:value}
                      )}}
                      disabled={this.state.disabledInput}
                    />
                    <button type="button" className="btn-phone-change"
                      onClick={this._updateTel}
                      disabled={this.state.disableModify}>수정</button>
                    <span className="phone-number_noti">휴대폰 번호 수정시 회원정보도 같이 변경됩니다.</span>
                  </div>

                  {
                    this.state.inputTelState===1?
                    <span className="alert-msg">휴대폰 번호를 확인해 주세요.</span>
                    : null
                  }
                  {
                    this.state.inputTelState===2?
                    <span className="alert-msg">새로운 번호를 입력해 주세요.</span>
                    : null
                  }
                  {
                    this.state.inputTelState===3?
                    <span className="alert-msg">휴대폰 번호로 인증번호가 발송되었습니다.</span>
                    : null
                  }

                  {
                    this.state.inputTelState===3?
                    <div className={this.state.authNum.length===6?"certi-number success":"certi-number"} id="authTel">
                    	<input type="text" placeholder="인증번호 입력" title="인증번호" className="istyle"
                        style={{width:'190px'}}
                        value={this.state.authNum}
                        ref="inputAuthNum"
                        onChange={(e)=>{
                          const value = isNaN(parseInt(e.target.value,10))?'':e.target.value;
                          this.setState({ authNum: value });
                        }}
                      />
                      <button type="button" className="btn-certi-number"
                        onClick={this._authSubmit}
                      >인증완료</button>
                      {/* &nbsp;<button type="button" className="btn-certi-cncl">취소</button> */}
                      {
                        !this.state.isAuthComplete?
                        <span className="certi-number_time">인증 유효시간 : <em>{this.state.cntMin>0?this.state.cntMin+'분':null}{this.state.cntSec}초</em></span>
                        : null
                      }
                    </div>
                    : null
                  }

                  {
                    !this.state.isAuthValid?
                    <span className="alert-msg">인증번호가 올바르지 않습니다.</span>
                    : null
                  }
                  {
                    this.state.isAuthComplete?
                    <span className="alert-msg">휴대폰 번호 인증이 완료되었습니다.</span>
                    : null
                  }
      					</div>
      				</td>
      			</tr>
      			</tbody>
      		</table>
      	</div>
      </article>
    );
  }
}
