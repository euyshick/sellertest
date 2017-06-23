import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { setProps, changeInput, blurInput } from '../actions'
import { request, format, jsonToQueryString } from '../../utils/Utils'
import OptionData from '../../utils/OptionData'

import FormUserId from '../components/FormUserId'
import FormPw from '../components/FormPw'
import FormPw2 from '../components/FormPw2'

import TermsDefault from '../components/TermsDefault'
import LayerTerms from '../components/LayerTerms'

class JoinGroup2 extends Component{
  state = {
    groupJoinStatus:null,
    idx_data:window.IDX_MEMBER,
  }
  componentWillMount(){
		this.props.setProps({
      pageId : 'JoinGroup2',
		});
//console.log(window.IDX_MEMBER)
    // JoinGroup1 페이지 안거치고 온 경우 JoinGroup1으로 redirect
    if(this.props.data.bizNum0 === '' && this.props.data.bizNum1 === '' && this.props.data.bizNum2 === ''){
      browserHistory.replace('/join/group1');
    }else{
      let _mobile = window.UserMobile;
      if(_mobile && _mobile.indexOf('-')===-1){
				if(_mobile.length>10) _mobile = _mobile.slice(0,3)+'-'+_mobile.slice(3,7)+'-'+_mobile.slice(7,11);
				else _mobile = _mobile.slice(0,3)+'-'+_mobile.slice(3,6)+'-'+_mobile.slice(6,10);
			}

      this.props.setProps({
        userName:window.UserName,
        userId:window.UserId,
        userMobile:_mobile,
      });

      if( window.UserName===undefined || window.UserId===undefined || _mobile===undefined ){ //  로컬용
        this.setState({
          groupJoinStatus:1,
        });
      }

      // if( window.UserName==="" || window.UserId==="" || _mobile==="" ){ //  개발용
      //   this.setState({
      //     groupJoinStatus:1,
      //   });
      // }


      else{
        this.setState({
          groupJoinStatus:3,
        });
      }
    }
  }


  componentWillReceiveProps(){

    if(this.props.termAgree1 ||this.props.termAgree2){		//필수 약관만 확인


    }


//console.log(this.props.data.formData.bizTel_0+this.props.data.formData.bizTel_1)


}

  _bizType = (type) => {
    switch (type) {
      case '0':
        return '개인사업자';
      case '1':
        return '영리법인';
      case '2':
        return '비영리법인';
      case '3':
        return '공식단체';
      default:
        return '-';
    }
  }

  _displayMsg = (_type) => {
    const indentSet = ['addr','bizTel'];
    const value = this.props.data.validStatus[_type];
    if(value===0 || !this.props.data.validMsg[_type] || !this.props.data.validMsg[_type][value]) return;
    return(<p className={indentSet.indexOf(_type)!==-1?"validate_msg t3":"validate_msg"}>{this.props.data.validMsg[_type][value]}</p>);
  }

  _formValid = () => {
    const {data} = this.props;
    let checkCnt = 0;
    let newObj = {};

    let collectError = {
        element:[]
      }


    // if(data.authState!==3){
    //   newObj['authNum'] = 1;
    //   checkCnt +=1;
    // }

    if(data.formData.userId==='' || data.validStatus.userId!==0){
      	collectError.element.push('#userId');
      if(data.validStatus.userId===0){
        newObj['userId'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['userId'] = 0;
    }

    if(data.formData.userPw==='' || this.props.passwordLevel<2){
      collectError.element.push('#userPw');
      if(data.validStatus.userPw===0){
        newObj['userPw'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['userPw'] = 0;
    }

    if(data.formData.userPw2==='' || data.validStatus.userPw2!==0){
      collectError.element.push('#userPw2');
      if(data.validStatus.userPw2===0){
        newObj['userPw2'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['userPw2'] = 0;
    }

    if(data.formData.groupName===''){
      collectError.element.push('#groupName');
      if(data.validStatus.groupName===0){
        newObj['groupName'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['groupName'] = 0;
    }

    if(data.formData.presentName===''){
          collectError.element.push('#presentName');
      if(data.validStatus.presentName===0){
        newObj['presentName'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['presentName'] = 0;
    }

    if(data.formData.zipcode==='' || data.formData.addr_1==='' || data.formData.addr_2===''){
         if(data.formData.addr_2===''){
               collectError.element.push('#address3');
              }

      if(data.validStatus.addr===0){
        newObj['addr'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['addr'] = 0;
    }

    if(data.formData.bizType===''){
        collectError.element.push('#businessType');
      if(data.validStatus.bizType===0){
        newObj['bizType'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['bizType'] = 0;
    }

    if(data.formData.bizCond===''){
        collectError.element.push('#businessStatus');
      if(data.validStatus.bizCond===0){
        newObj['bizCond'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['bizCond'] = 0;
    }

    if(data.formData.bizTel_1===''){
      collectError.element.push('#companyPhone2');
      if(data.validStatus.bizTel===0){
        newObj['bizTel'] = 1;
      }
      //checkCnt +=1;
    }else if(data.validStatus.bizTel>1){
      checkCnt +=1;
    }else{
      newObj['bizTel'] = 0;
    }

    // if(!data.formData.attachFile){
    //   checkCnt +=1;
    //   newObj['attachFile'] = 1;
    // }else{
    //   newObj['attachFile'] = 0;
    // }

    if(!data.termAgree1 || !data.termAgree2){		//필수 약관만 확인
      checkCnt +=1;
      newObj['terms'] = 1;
    }else{
      newObj['terms'] = 0;


    //  console.log("진행")
    }





    this.props.setProps({
      validStatus : Object.assign({},data.validStatus, newObj)
    });

    if(collectError.element.length>0){
  const firstElement = document.querySelector(collectError.element[0]);
  const offset = firstElement.getBoundingClientRect().top + window.pageYOffset-10;

  this.setState( Object.assign({}, collectError.data) );
  firstElement.focus();
  window.scrollTo(0,offset);

  return;
}
//console.log(checkCnt)
    if(checkCnt>0) return false;
    return true;


  }

  _submit = (e) => {
    const {data} = this.props;
  if(!this._formValid()) return;


  //  console.log(this.state.idx_data)
  //  console.log(data.newauthState)
    // 데이터 정리 후 전송
    request({
      url:data.apiUrl.memberRegist,
			method:'post',
			body:{
        f_reg:2,
        id:data.formData.userId,
        pw:data.formData.userPw,
        nm:data.formData.groupName,
        f_sex:parseInt(data.formData.gender+1,10),
        birth:data.formData.birth_y+'-'+data.formData.birth_m+'-'+data.formData.birth_d,
        hp:data.formData.bizTel_0+data.formData.bizTel_1, //data.formData.mobile_0+data.formData.mobile_1,
        mail1:data.formData.email_id,
        mail2:data.formData.email_domain,
        f_auth:data.newauthState===3?1:0,
				f_secret:data.termAgree4?2:1,
        f_firm:parseInt(data.bizType,10)+1,
        f_mail:data.termAgree3?1:0,
	      f_mms:data.termAgree3?1:0,
        idx_login_mng:window.IDX_MEMBER,
        b_num_firm:data.bizNum1,
        b_num_u:data.bizType===3?data.bizNum2:data.bizNum0,
        b_nm_head:data.formData.presentName,
        b_condit:data.formData.bizCond,
        b_type:data.formData.bizType,
        b_zipcode:data.formData.zipcode,
        b_addr_1:data.formData.addr_1,
        b_addr_2:data.formData.addr_2,
	      id_ref:data.formData.recomId,
	      nm_p:"",//document.formAdultAuth.nm_p.value,
        f_sex_p:0,
        f_nation_p:0,
        birth_p:null,
         hp_p:null,
         num_p:null,
         di_p:null,
         ci_p:null,

      }
    }).then(rsData=>{
      // 성공시 완료 페이지로
            //  console.log(rsData);
      if(!rsData.message) return;
			if(rsData.message.toLowerCase()==='success'){

				browserHistory.replace('/join/complete');

				return;
			}
		},d=>{
      // 통신 실패시
			//console.log(d)
		})
  }

  _zipcode = (e) => {
    const _this = this;
    new window.daum.Postcode({
      oncomplete: function(data) {
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

        const newObj = {
          addr_1:fullAddr,
          zipcode:data.zonecode,
        }
        _this.props.setProps({
          formData: Object.assign({}, _this.props.data.formData, newObj),
        });
        _this.refs.addr_2.focus();
      }
    }).open();
  }

  // 인증
  _timer = null
  _countDownInit = () => {
    clearInterval(this._timer);
    this.props.setProps({
      authState:0,
    });
  }


  _authStart = (e) => {
    // 관리자 휴대전화 번호 유효성 체크
    if( !format.isMobile(this.props.data.userMobile) ){
      this.props.setProps({
        authState:-1
      });
      return false;
    }

    let _mobileSet = this.props.data.userMobile;
    let  _mobile = _mobileSet.replace(/\-/g,'');

  //  console.log(_mobile);
  //  console.log(_mobileSet);

	  let rqData = {
		  kind:'1',
		  senddata:_mobile,
		}



	// 인증 UI시작   수정
	request({
	url:this.props.data.apiUrl.authMsgSend+jsonToQueryString(rqData), //핸드폰 인증 url
	}).then(rsData=>{
	 // console.log(rsData.authcode)
	  this.setState({
		cntMin:this.props.data.cntMin,
		cntSec:this.props.data.cntSec,
		certifyCodeHash:rsData.authcode,
	  });

	  this.props.setProps({
		authNum:'',
		authState:1,
		authMethod:0,
		validStatus:Object.assign({},this.props.validStatus, {authNum:0}),
	  });

	  this._timer = window.setInterval(function(){
		let s = this.state.cntSec - 1;
		if(s < 0){
		  s = this.props.data.cntSec;
		  let m = this.state.cntMin - 1;
		  if(m>-1){
			this.setState({ cntMin:m });
		  } else {
			this._countDownInit();
		  }
		}

		this.setState({
		  cntSec: s
		});
	  }.bind(this),1000);
	});
	}


	_authSubmit = (e) => {
	request({
	  url:this.props.data.apiUrl.authHashData+'/'+this.props.data.authNum,
	}).then(rsData=>{
	  let v = 0;
	  if(rsData.authhashcode === this.state.certifyCodeHash){     // 인증 성공
		v = 3;
    this.props.setProps({
     newauthState:v,

   });
	  } else {			// 인증 실패
		v = 2;
	  }
	  this.props.setProps({
	   authState:v,
	   validStatus:Object.assign({},this.props.data.validStatus, {authNum:0}),
	 });
	 clearInterval(this._timer);
	});
	}


	render(){
    const {data, changeInput, blurInput} = this.props;

    const bizInfoTable = (
      <div className="joinTbl_wrap">
        <table>
          <caption>가입 내용 목록</caption>
          <tbody>
            <tr>
              <th scope="col">
                <strong className="b">단체구분</strong>
              </th>
              <td>
                <strong>{this._bizType(data.bizType)}</strong>
              </td>
            </tr>
            {
              data.bizType==="1" || data.bizType==="2"?
              <tr>
                <th scope="col">
                  <strong className="b">법인등록번호</strong>
                </th>
                <td>
                  <strong lang="en">{data.bizNum0}</strong>
                </td>
              </tr>
              : null
            }
            {
              data.bizType!=="3"?
              <tr>
                <th scope="col">
                  <strong className="b">사업자등록번호</strong>
                </th>
                <td>
                  <strong lang="en">{data.bizNum1}</strong>
                </td>
              </tr>
              : null
            }
            {
              data.bizType==="3"?
              <tr>
                <th scope="col">
                  <strong className="b">고유번호</strong>
                </th>
                <td>
                  <strong lang="en">{data.bizNum2}</strong>
                </td>
              </tr>
              : null
            }
          </tbody>
        </table>
      </div>
    )

		return(
      <div className="container">

        {/*<button type="button" lang="en" style={{
          position:'fixed',right:'10px',top:'10px',background:'#000',color:'yellow',padding:'5px',
        }}
          onClick={(e)=>{console.log(data)}}
        >view props</button>*/}

        <div className="content_wrap">
          <div className="content_join">

            <h2>행복쇼핑 단체회원 가입</h2>
            <div className="titExp">
              단체회원은 행복쇼핑 개인 아이디가 있어야 가입 가능합니다.
            </div>
            {
              this.state.groupJoinStatus===1?
              <section>
                {bizInfoTable}
                <h3>관리자 확인</h3>
                <div className="joinInfo">
                  <ul>
                    <li>
                      <i></i> <span>단체회원 가입을 위해 먼저 행복쇼핑 개인 아이디로 로그인해 주세요.</span>
                    </li>
                    <li>
                      <i></i> <span>단체 아이디를 관리할 고객님의 행복쇼핑 아이디로 로그인하시면 됩니다.</span>
                    </li>
                  </ul>
                </div>
                <div className="joinInfobox">
                  <p className="tit">
                    단체회원 관리자란?
                  </p>
                  <ol>
                    <li>
                      <i>1</i> <span>관라자에게는 단체회원의 가입 및 탈퇴, 정보 수정 등 아이디를<br /> 관리할 수 있는 권한이 주어집니다.</span>
                    </li>
                    <li>
                      <i>2</i> <span>등록된 관리자 휴대전화번호 및 메일주소를 통해 단체회원과 관련된<br /> 안내를 받으실 수 있습니다.</span>
                    </li>
                  </ol>
                </div>
              </section>
              :

              <section>
                {bizInfoTable}
                <div className="joinBox">
                  <p className="tit">
                    현재 로그인 된 아이디 <strong lang="en">{data.userId}</strong>
                  </p>
                  <p>
                    <a href="http://mypage.minishop.pping.kr/member/" target="_blank" className="btn_join4">회원정보 수정하기</a>
                  </p>
                </div>
                <div className="joinTbl_wrap">
                  <table>
                    <caption>개인 가입 내용 목록</caption>
                    <tbody>
                      <tr className="t2">
                        <th scope="col">
                          <strong>관리자 이름</strong>
                        </th>
                        <td>
                          <strong>{data.userName}</strong>
                        </td>
                      </tr>
                      <tr className="t2">
                        <th scope="col">
                          <strong>관리자 아이디</strong>
                        </th>
                        <td>
                          <strong lang="en">{data.userId}</strong>
                        </td>
                      </tr>
                      <tr className="t2_1">
                        <th scope="col">
                          <strong>관리자 휴대전화 번호</strong>
                        </th>
                        <td>
                          <div className="certify_input">
                            <label htmlFor="adminPhone" className="box_wrap">
                              <input type="tel" id="adminPhone" className="istyle" lang="en" placeholder="휴대전화 번호" readOnly={true} value={data.userMobile} />
                            </label>
                            <button type="button" className="btn_join3"
                             onClick={this._authStart}
                             disabled={data.authState!==0}
                             >인증</button>
                          </div>
                          {
                            data.authState===-1?
                            <p className="validate_msg">관리자 휴대전화 번호가 유효하지 않습니다. 회원정보에서 수정해 주세요.</p> : null
                          }
                          {
                            data.authState>0?
                            <div style={{marginTop:'10px'}}>
                              <div className="certify_input">
                                <label htmlFor="userCertify" className="box_wrap">
                                  <input type="tel" id="userCertify" className="istyle" placeholder="인증번호 입력"
                                    lang="en"
                                    maxLength="6"
                                    name="authNum"
                                    disabled={data.authState===3}
                                    value={data.authNum}
                                    onChange={changeInput}
                                  />
                                </label>
                                <button type="button" className="btn_join3_1"
                                 onClick={this._authSubmit}
                                 disabled={data.authState===3}>확인</button>
                              </div>
                              {
                                data.authState!==3?
                  				      <p className="info_msg">인증 유효시간 : <em lang="en">{this.state.cntMin>0?this.state.cntMin+'분':null}{this.state.cntSec}초</em></p> : null
                              }
                              {
                                data.authState===2?
                                <p className="validate_msg">{data.validMsg.authNum['2']}</p> : null
                              }
                      				{
                                data.authState===3?
                                <p className="info_msg text-info">{data.validMsg.authNum['3']}</p> : null
                              }
                            </div>
                            : null
                          }
                          {this._displayMsg('authNum')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            }

            {
              this.state.groupJoinStatus===3?
              <section className="joinForm">
                <h3>단체 정보입력</h3>
                <ul className="t2">
                  <FormUserId />
                  <FormPw />
                  <FormPw2 />
                </ul>

                <ul>
                  <li>
                    <label htmlFor="groupName" className="box_wrap">
                      <input type="text" className="istyle" id="groupName" placeholder="단체명"
                        maxLength="30"
                        name="groupName"
                        value={data.formData.groupName}
                        onChange={changeInput}
                        onBlur={blurInput}
                      />
                    </label>
                    {this._displayMsg('groupName')}
                  </li>
                  <li>
                    <label htmlFor="presentName" className="box_wrap">
                      <input type="text" className="istyle" id="presentName" placeholder="대표자명"
                        maxLength="30"
                        name="presentName"
                        value={data.formData.presentName}
                        onChange={changeInput}
                        onBlur={blurInput}
                      />
                    </label>
                    {this._displayMsg('presentName')}
                  </li>
                  <li>
                    <dl className="t2">
                      <dt>사업장 소재지</dt>
                      <dd>
                        <div className="adress_wrap">
                          <label htmlFor="address1" className="box_wrap address1">
                            <input type="text" className="istyle" id="address1" maxLength="5" placeholder="우편번호" lang="en" readOnly={true}
                              value={data.formData.zipcode}
                              onClick={this._zipcode}
                            />
                          </label>
                          <button type="button" className="btn_join3 btn_zipcode" onClick={this._zipcode}>우편번호 검색</button>
                        </div>
                        <div className="adress_wrap">
                          <label htmlFor="address2" className="box_wrap"><input type="text" className="istyle" id="address2" placeholder="주소" readOnly={true}
                            value={data.formData.addr_1}
                            onClick={this._zipcode}
                          /></label>
                        </div>
                        <div className="adress_wrap">
                          <label htmlFor="address3" className="box_wrap"><input type="text" className="istyle" id="address3" placeholder="나머지 주소"
                            name="addr_2"
                            value={data.formData.addr_2}
                            onChange={changeInput}
                            onBlur={blurInput}
                            ref="addr_2"
                          /></label>
                        </div>
                      </dd>
                    </dl>
                    {this._displayMsg('addr')}
                  </li>
                  <li>
                    <label htmlFor="businessType" className="box_wrap">
                      <input type="text" className="istyle" id="businessType" placeholder="업종"
                        name="bizType"
                        value={data.formData.bizType}
                        onChange={changeInput}
                        onBlur={blurInput}
                      />
                    </label>
                    {this._displayMsg('bizType')}
                  </li>
                  <li>
                    <label htmlFor="businessStatus" className="box_wrap">
                      <input type="text" className="istyle" id="businessStatus" placeholder="업태"
                        name="bizCond"
                        value={data.formData.bizCond}
                        onChange={changeInput}
                        onBlur={blurInput}
                      />
                    </label>
                    {this._displayMsg('bizCond')}
                  </li>
                  <li>
                    <dl className="t2">
                      <dt>대표 전화번호</dt>
                      <dd>
                        <div className="phone_wrap">
                          <div className="phone">
                            <span className="phone1">
                              <OptionData
                                mode="tel"
                                name="bizTel_0"
                                defaultValue={data.formData.bizTel_0}
                                className="sstyle"
                                onChange={(e)=>{
                                  this.props.setProps({
                                    formData:Object.assign({}, data.formData, {bizTel_0: e.target.value})
                                  })
                                }}
                              />
                            </span>
                            <span className="hyphen"></span>
                            <span className="phone2">
                              <label htmlFor="companyPhone2"><input type="tel" id="companyPhone2" className="istyle"
                                lang="en" maxLength="9"
                                name="bizTel_1"
                                value={data.formData.bizTel_1}
                                onChange={changeInput}
                                onBlur={blurInput}
                              /></label>
                            </span>
                          </div>
                        </div>
                      </dd>
                    </dl>
                    {this._displayMsg('bizTel')}
                  </li>
                </ul>
                <TermsDefault/>
                {/*<ul className="t3">
                  <li>
                    <div className="file_wrap">
                      <label htmlFor="attachFile" className="box_wrap">
                        <input type="text" className="istyle" id="attachFile" placeholder="가입증빙 서류 (재직증명서) 첨부" />
                      </label>
                      <input type="file"/>
                      <button type="button" className="btn_join3">찾아보기</button>
                    </div>
                    <div className="joinInfo t2">
                      <ul>
                        <li>
                          <i></i> <span lang="en">jpg, png, gif, pdf</span>만 업로드 가능합니다. <a href="//img.happyshopping.kr/img_static/files/재직증명서_양식.pdf" target="_blank" className="btn_download">재직증명서 양식<i className="icon-get_app"></i></a>
                          {this._displayMsg('attachFile')}
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>*/}
              </section>
              : null
            }

            {
              this.state.groupJoinStatus===1?
              <article className="btn_wrap">
                <div className="row1">
                  <button type="button" className="btn_join1" onClick={(e)=>{
                    //this.props.setProps({groupJoinStatus:2});
                    this.props.setProps({
                      groupJoinStatus:2,
                    });
                    this.setState({
                      groupJoinStatus:2,
                    });
                    browserHistory.replace('/');
                  }}>관리자(개인 아이디)로 로그인</button>
                </div>
                <div className="row2 person">
                  <a href="user" className="btn_join4">개인회원 가입하기</a>
                  <p className="exp">
                    개인사업자는 반드시 대표자 명의의 개인 아이디로 로그인하셔야 합니다.
                  </p>
                </div>
              </article>
              :
              <article className="btn_wrap">
               <button type="button" className="btn_join1" onClick={this._submit}>단체회원 가입하기</button>
              </article>
            }
          </div>

          {
						data.viewTermLayer?
						<LayerTerms
							viewTermId={this.props.data.viewTermId}
							setProps={this.props.setProps.bind(this)}
						/>
						: null
					}
        </div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
    data: state.setDatas.data,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
    setProps : (v) => dispatch(setProps(v)),
    changeInput : (v) => dispatch(changeInput(v)),
    blurInput : (v) => dispatch(blurInput(v)),
	}
}

JoinGroup2 = connect(mapStateToProps, mapDispatchToProps)(JoinGroup2);

export default JoinGroup2;
