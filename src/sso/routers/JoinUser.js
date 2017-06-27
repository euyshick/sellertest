import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { setProps, changeInput, changeRadio } from '../actions'
import { format, request, jsonToQueryString } from '../../utils/Utils'
import OptionData from '../../utils/OptionData'

import FormUserId from '../components/FormUserId'
import FormPw from '../components/FormPw'
import FormPw2 from '../components/FormPw2'
import FormUserName from '../components/FormUserName'
import FormMobile from '../components/FormMobile'
import FormEmail from '../components/FormEmail'
import TermsDefault from '../components/TermsDefault'
import TermsAdult from '../components/TermsAdult'
import LayerTerms from '../components/LayerTerms'
import FormNickname from '../components/FormNickname'

class JoinUser extends Component{
	componentWillMount(){
		this.props.setProps({
			pageId : 'JoinUser',
		});
	}

	componentWillUpdate(nextProps,nextState){
		if(this.props.data.ci !== nextProps.data.ci){
		//	console.log('change ci data')
		}
	}

	/*
		components
	*/
	_certification = () => {
		const {data} = this.props;
		return(
			<ul>
				<li>
					<dl className="t1">
						<dt>본인인증</dt>
						<dd className="certify_wrap">
							<span className="radio_wrap">
								<input type="radio"
								 name="authMethod"
								 id="authMethod1"
								 value="0"
								 checked={data.authMethod===0 && data.authState>0}
								 disabled={data.authState>10}
								 onChange={this._authStart} />
								<label htmlFor="authMethod1">휴대전화 인증</label>
							</span>
							<span className="radio_wrap">
								<input type="radio"
								 name="authMethod"
								 id="authMethod2"
								 value="1"
								 checked={data.authMethod===1 && data.authState>0}
								 disabled={data.authState>10}
								 onChange={this._authStart} />
								<label htmlFor="authMethod2">이메일 인증</label>
							</span>
						</dd>
					</dl>
					{
						data.authState===-1?
							data.authMethod===0?
								<p className="validate_msg t2">휴대전화 번호를 확인해 주세요.</p>
								:
								<p className="validate_msg t2">이메일을 확인해 주세요.</p>
							: null
					}
					{
						data.authState>0?
						<div>
							<div className="certify_input">
								<label htmlFor="userCertify" className="box_wrap">
									<input type="tel" className="istyle" id="userCertify" placeholder="인증번호 입력"
										lang="en"
										maxLength="6"
										name="authNum"
										disabled={data.authState===3}
										value={data.authNum}
										onChange={(e)=>{
											this.props.setProps({
												authNum:e.target.value
											})
										}}
									/>
								</label>
								<button type="button" className="btn_join3"
									onClick={this._authSubmit}
									disabled={data.authState===3}>확인</button>
							</div>
							{
								data.authState!==3?
									data.authMethod===0?
									<div>
										<p className="info_msg text-info">휴대전화 번호로 인증번호가 발송되었습니다.</p>
										<p className="info_msg">인증 유효시간 : <em lang="en">{this.state.cntMin>0?this.state.cntMin+'분':null}{this.state.cntSec}초</em></p>
									</div>
									:
									<div>
										<p className="info_msg text-info">이메일로 인증번호가 발송되었습니다.</p>
										<p className="info_msg">인증번호는 발송 후 1시간 내에만 유효합니다.</p>
									</div>
								: null
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
				</li>
			</ul>
		);
	}

	/*
		events
	*/
	_displayMsg = (_type,_addClass) => {
		const indentSet = ['birth','mobile','gender'];
    const value = this.props.data.validStatus[_type];
    if(value===0 || !this.props.data.validMsg[_type] || !this.props.data.validMsg[_type][value]) return;
    return(<p className={indentSet.indexOf(_type)!==-1||_addClass?"validate_msg t2":"validate_msg"}>{this.props.data.validMsg[_type][value]}</p>);
  }

	_changeBirth = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const obj = {};
    obj[name] = value;

    // 만 14세 미만 체크
    const {data} = this.props;
    const y = name.indexOf('y')!==-1?value : parseInt(data.formData.birth_y,10);
    const m = name.indexOf('m')!==-1?value : parseInt(data.formData.birth_m,10);
    const d = name.indexOf('d')!==-1?value : parseInt(data.formData.birth_d,10);
    const propsObj = {};

    // 만 14세 미만 기준 오늘 임시
    const sy = parseInt(window.SDAY.split('-')[0],10);
    const sm = parseInt(window.SDAY.split('-')[1],10);
    const sd = parseInt(window.SDAY.split('-')[2],10);
    let isUnder = false;
    if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){
      if(sy-y>14){
        isUnder = false;
      }else if(sy-y===14){
        if(sm-m>0){
          isUnder = false;
        }else if(sm-m===0){
          if(sd-d>=0)
            isUnder = false;
          else
            isUnder = true;
        }else{
          isUnder = true;
        }
      }else{
        isUnder = true;
      }

      if(isUnder){
        propsObj['birth'] = 2;
      }else{
        propsObj['birth'] = 0;
      }

      this.props.setProps({
        under14:isUnder,
        authState:0,
        authNum:'',
        authMethod:null,
        validStatus:Object.assign({},this.props.data.validStatus, propsObj),
        formData: Object.assign({},this.props.data.formData,obj)
      })
    } else {
      this.props.setProps({
        under14:isUnder,
        formData: Object.assign({},this.props.data.formData,obj)
      });
    }
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


	const {data} = this.props;

					if(e.target.getAttribute('id')==="authMethod2" ){

					//	console.log("이메일 ")


						if(data.formData.email_id===""){

								//console.log("휴대폰 ")
								this.props.setProps({
									email:'',
									validStatus:Object.assign({},data.validStatus, {email:1}),
								});

						 }
					}



					if(e.target.getAttribute('id')==="authMethod1"){

            if(data.formData.mobile_1===""){


							//	console.log("휴대폰 ")
								this.props.setProps({
									mobile:'',
									validStatus:Object.assign({},data.validStatus, {mobile:1}),
								});

             }



					}



		                       // 휴대전화 인증
		const _method = parseInt(e.target.value,10);


		if(_method===0 && data.validStatus.mobile!==4) return;
		if(_method===1 && data.validStatus.email!==4) return;

		// 휴대전화/이메일 형식 체크
		const mobile_0 = !data.under14? data.formData.mobile_0 : data.formData.adultMobile_0;
		const mobile_1 = !data.under14? data.formData.mobile_1 : data.formData.adultMobile_1;

		let _isFormat = false;
		let _numMobile;
		if(mobile_0==='' || mobile_1===''){

			_isFormat = true;
		}else{
			_numMobile = mobile_0+'-'+mobile_1.substring(0,4)+'-'+mobile_1.substring(4,8);
			if(mobile_1.length<8){
				_numMobile = mobile_0+'-'+mobile_1.substring(0,3)+'-'+mobile_1.substring(3,7);

			}
			if(!format.isMobile(_numMobile)) _isFormat = true;
		}
		if( (_method===0 && (_isFormat || mobile_1.length<8))
			|| (_method===1 && (data.formData.email_id==='' || data.formData.email_domain===''))
		){



			const obj = {
	      authState:-1,
				authMethod:_method,
			};
			if(data.under14){
				let v = 2;
				if(mobile_0==='' || mobile_1===''){
					v = 1;
				}
				obj['validStatus'] = Object.assign({},data.validStatus, {adultMobile:v});
			}
			this.props.setProps(obj);
			return false;
		}

//중복체크



//console.log(data.validStatus.mobile)

		// 인증 UI시작

		// 휴대전화 인증
		let rqData = {
			kind:'1',
			senddata:_numMobile,
		}
		let callbackUI = () => {
			// 3분 타이머 시작
			this._timer = window.setInterval(function(){
				let s = this.state.cntSec - 1;
				if(s < 0){
					s = data.cntSec;
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
		}

		// 이메일 인증
		if(_method===1){
			rqData = {
				kind:'2',
				senddata:data.formData.email_id+'@'+data.formData.email_domain,
			}

			callbackUI = () => {
				// 1시간 타이머 시작
				this._timerEmail = window.setTimeout(function(){
					this._countDownInit();
				},1000*60*60);
			}
		}

		request({
			url:this.props.data.apiUrl.authMsgSend+jsonToQueryString(rqData),
		}).then(rsData=>{
			if(_method===1){ // 이메일
				this.setState({
					certifyCodeHash:rsData.authcode,
				});
			} else { // 모바일
				this.setState({
					cntMin:data.cntMin,
					cntSec:data.cntSec,
					certifyCodeHash:rsData.authcode,
				});
			}

			this.props.setProps({
				authNum:'',
				authState:1,
				authMethod:_method,
				validStatus:Object.assign({},data.validStatus, {authNum:0}),
			});

			callbackUI();
		});
  }
  _authSubmit = (e) => {
		// 휴대전화/이메일 인증
		request({
      url:this.props.data.apiUrl.authHashData+'/'+this.props.data.authNum,
    }).then(rsData=>{
    	let v = 0;
			if(rsData.authhashcode === this.state.certifyCodeHash){     // 인증 성공
				v = 3;
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

	_adultAuthStart = (e) => {
		request({
			url:this.props.data.apiUrl.requestHPAuth, // 보호자 핸드폰인증
		}).then(rsData=>{

			if(rsData.message==="success"){

				//console.log("보호자인증 진행중")

				this.props.setProps({
					authNum:'',  //3 보호자 인증이 완료되었습니다.
					validStatus:Object.assign({},this.props.data.validStatus, {authNum:3}),
				});

			}
			this.props.setProps({
				req_info: rsData.authdata.sEncryptedDatas,
				// rtn_url: rsData.authdata.postretUrl,
				cpid: rsData.authdata.cpid,
			});

			const document = window.document;

			let form = document.createElement('form')
			form.action= window.hscert_URl
			form.method='post'
			form.target='DRMOKWindow'

			let input_req_info = document.createElement('input')
			input_req_info.type='hidden'
			input_req_info.name='req_info'
			input_req_info.value=rsData.authdata.sEncryptedDatas

			let input_rtn_url = document.createElement('input')
			input_rtn_url.type='hidden'
			input_rtn_url.name='rtn_url'
			//input_rtn_url.value=rsData.authdata.postretUrl
			input_rtn_url.value=window.location.origin+'/join/authreturn'

			let input_cpid = document.createElement('input')
			input_cpid.type='hidden'
			input_cpid.name='cpid'
			input_cpid.value=rsData.authdata.cpid

			form.appendChild(input_req_info)
			form.appendChild(input_rtn_url)
			form.appendChild(input_cpid)
			document.body.appendChild(form)

			const DRMOK_window = window.open('', 'DRMOKWindow', 'width=425, height=550, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250' );
			if(DRMOK_window == null){
				alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는\n화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다.\n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
			}

			form.submit();

			this.props.setProps({
				adultAuth:true
			});
		});
	}

	// 처리
	_submit = (e) => {
		const {data} = this.props;

		if(!this._formValid()) return;

		const rqData = {
			f_reg:1,
			f_auth:0,

			id:data.formData.userId,
			pw:data.formData.userPw,
			nm:data.formData.userName,
			nm_nick:data.formData.userNickname,
			f_sex:parseInt(data.formData.gender+1,10),
			birth:data.formData.birth_y+'-'+data.formData.birth_m+'-'+data.formData.birth_d,
			hp:data.formData.mobile_0+data.formData.mobile_1,
			mail1:data.formData.email_id,
			mail2:data.formData.email_domain,
			id_ref:data.formData.recomId,

			f_secret:data.termAgree4?2:1,
			f_mail:data.termAgree3?1:0,
			f_mms:data.termAgree3?1:0,
			b_zipcode:data.formData.zipcode,
			b_addr_1:data.formData.addr_1,
			b_addr_2:data.formData.addr_2,

			nm_p:document.formAdultAuth.nm_p.value,
			f_sex_p:document.formAdultAuth.f_sex_p.value,
			f_nation_p:document.formAdultAuth.f_nation_p.value,
			birth_p:document.formAdultAuth.birth_p.value,
			hp_p:document.formAdultAuth.hp_p.value,
			num_p:document.formAdultAuth.num_p.value,
			di_p:document.formAdultAuth.di.value,
			ci_p:document.formAdultAuth.ci.value,
		}

		// console.log(rqData)
		// return;

		// 데이터 정리 후 전송
		request({
			url:data.apiUrl.memberRegist,
			method:'post',
			body:rqData,
		}).then(rsData=>{

					if(!rsData.message) return;
					if(rsData.message.toLowerCase()==='success'){
						// 성공시 완료 페이지로
						browserHistory.replace('/join/complete');
						// console.log('success!!')
						// console.log(rqData)
						return;
					}else if(rsData.message.toLowerCase()==='dup'){

							       switch(rsData.resultmsg){

											 case "ID":

											 	//	console.log("아이디가 중복 입니다")
											  break;
												case "Mail":

													//console.log("메일 중복 입니다")

								 				break;
												case "HP":
													//console.log("핸드폰 중복 입니다.")

								 			  break;

												default :
												break;
										 }

			    }
		})
	}

	_formValid = () => {
    const {data} = this.props;
    let checkCnt = 0;
    let newObj = {};

		let collectError = {
	      element:[]
	    }


		if(!data.under14){
			if(data.authState!==3){
	      newObj['authNum'] = 1;
	      checkCnt +=1;
	    }
		} else {
			if(window.document.formAdultAuth.authState.value !=='3'){
	      newObj['authNum'] = 1;
	      checkCnt +=1;
			}
		}

    if(data.formData.userId==='' || data.validStatus.userId!==0){
					collectError.element.push('#userId');
      if(data.validStatus.userId===0){
        newObj['userId'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['userId'] = 0;
    }

		if(data.formData.userNickname==='' || data.validStatus.userNickname!==0){
					collectError.element.push('#userNickname');
			if(data.validStatus.userNickname===0){
				newObj['userNickname'] = 1;
			}
			checkCnt +=1;
		}else{
			newObj['userNickname'] = 0;
		}

    if(data.formData.userPw==='' || data.passwordLevel<2){
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

    if(data.formData.userName===''){
			collectError.element.push('#userName');
      if(data.validStatus.userName===0){
        newObj['userName'] = 1;
      }
      checkCnt +=1;
    }else{
      newObj['userName'] = 0;
    }

    if(data.formData.mobile_1===''){
				collectError.element.push('#mobile_1');
      if(data.validStatus.mobile===0){
        newObj['mobile'] = 1;
      }
      checkCnt +=1;
		}else if(data.validStatus.mobile>1 && data.validStatus.mobile!==4){
      checkCnt +=1;
    }else{
      newObj['mobile'] = 0;
    }

		if(data.formData.email_id==='' || data.formData.email_domain===''){
					if(data.formData.email_id===''){
							collectError.element.push('#userEmail1');
						}else if(data.formData.email_domain===''){
						collectError.element.push('#userEmail2');
						}
      if(data.validStatus.email===0){
        newObj['email'] = 1;
      }
      checkCnt +=1;
		}else if(!format.isEmail(data.formData.email_id+'@'+data.formData.email_domain)){
      if(data.validStatus.email===0){
        newObj['email'] = 2;
      }
      checkCnt +=1;
		}else if(data.validStatus.email>1 && data.validStatus.email!==4){
      checkCnt +=1;
    }else{
      newObj['email'] = 0;
    }

		if(data.formData.gender===null){
			if(data.validStatus.gender===0){
        newObj['gender'] = 1;
      }
      checkCnt +=1;
		}else{
			newObj['gender'] = 0;
		}

		if(data.formData.birth_y===''||data.formData.birth_m===''||data.formData.birth_d===''){
			if(data.validStatus.birth===0){
        newObj['birth'] = 1;
      }
      checkCnt +=1;
		}else{
  		newObj['birth'] = 0;
		}

    if(!data.termAgree1 || !data.termAgree2){		//필수 약관만 확인
      checkCnt +=1;
      newObj['terms'] = 1;


    }else{
      newObj['terms'] = 0;
			this.props.setProps({
				terms:'',
				validStatus:Object.assign({},data.validStatus, {terms:0}),
			});


    }

		if(data.under14){
			if(!data.adultTermAgree1 || !data.adultTermAgree2 || !data.adultTermAgree3 || !data.adultTermAgree4){		//필수 약관만 확인
				checkCnt +=1;
				newObj['adultTerms'] = 1;
			}else{
				newObj['adultTerms'] = 0;
			}
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

    if(checkCnt>0) return false;
		return true;
	}

	render(){
		const {data, changeInput, changeRadio} = this.props;

		return(
			<div className="container">
				<div className="content_wrap">
					<div className="content_join">
						<h2>행복쇼핑 간편 회원가입</h2>
						<section className="joinForm">
							<ul className="t2">
								<FormUserId />
								<FormPw />
								<FormPw2 />
							</ul>
							<ul>
								<FormUserName/>
								<FormNickname/>
								<li>
					        <dl className="t1">
					          <dt>성별</dt>
										<dd className="gender_wrap">
											<span>
												<span className="radio_wrap">
													<input type="radio" value="0"
													 name="gender"
													 id="gender0"
													 checked={data.formData.gender===0}
													 onChange={changeRadio} />
													<label htmlFor="gender0">남자</label>
												</span>
												<span className="radio_wrap">
													<input type="radio" value="1"
														name="gender"
														id="gender1"
														checked={data.formData.gender===1}
														onChange={changeRadio} />
													<label htmlFor="gender1">여자</label>
												</span>
											</span>
										</dd>
					          {this._displayMsg('gender')}
					        </dl>
					      </li>
								<li>
									<dl className="t1">
										<dt>생일</dt>
										<dd>
											<div className="birth">
												<span className="birth_y">
													<OptionData
														mode="year"
														name="birth_y"
														onChange={this._changeBirth}
													/>
												</span>
												<span className="birth_m">
													<OptionData
														mode="month"
														name="birth_m"
														onChange={this._changeBirth}
													/>
												</span>
												<span className="birth_d">
													<OptionData
														mode="day"
														name="birth_d"
														onChange={this._changeBirth}
													/>
												</span>
											</div>
										</dd>
									</dl>
									{this._displayMsg('birth')}
					      </li>
								<FormMobile />
								<FormEmail />
							</ul>

							<ul>
								<li>
									<dl className="t1">
										<dt>추천인</dt>
										<dd>
											<label htmlFor="recomId" className="box_wrap">
												<input type="text" className="istyle"
												 	maxLength="30" lang="en"
													placeholder="추천인 아이디를 입력해 주세요"
												 	id="recomId"
													name="recomId"
													value={data.formData.recomId}
													onChange={changeInput}
												/>
											</label>
										</dd>
									</dl>
								</li>
							</ul>

							{
								!data.under14? this._certification() : null
							}

							<TermsDefault />
						</section>
						{
							data.under14?
							<section className="joinForm t2 adult">
								<h3>보호자 동의</h3>
								<TermsAdult />
								<ul>
									<li>
										<dl className="t1">
											<dt>보호자 인증</dt>
											<dd className="certify_wrap">
												<span className="radio_wrap radio_full">
													<input name="adultAuth" id="adultAuth" type="radio"
														checked={data.adultAuth}
														onChange={this._adultAuthStart}
													/>
													<label htmlFor="adultAuth">휴대전화 본인인증</label>
												</span>
											</dd>
										</dl>
										{
											data.validStatus.authNum === 1?
											<p className="validate_msg t2">보호자 인증이 필요합니다.</p> : null
										}
										{
											// data.validStatus.authNum === 3?
											// <p className="validate_msg t2">인증 되었습니다.</p> : null
										}
										{/*
											data.authState===2?
											<p className="validate_msg">{data.validMsg.authNum['2']}</p> : null
										*/}
										{/*
											data.authState===3?
											<p className="info_msg text-info">{data.validMsg.authNum['3']}</p> : null
										*/}
										{/*<p className="validate_msg t2">다시 인증해 주세요.</p>
										<p className="validate_msg t2">보호자 인증이 필요합니다.</p>
										<p className="info_msg text-info t2">인증되었습니다.</p>*/}
									</li>
								</ul>
							</section>
							: null
						}
						<form name="formAdultAuth" id="formAdultAuth">
							<input type="hidden" name="ci" value="" />
							<input type="hidden" name="di" value="" />
							<input type="hidden" name="hp_p" value="" />
							<input type="hidden" name="birth_p" value="" />
							<input type="hidden" name="f_sex_p" value="" />
							<input type="hidden" name="f_nation_p" value="" />
							<input type="hidden" name="num_p" value="" />
							<input type="hidden" name="nm_p" value="" />
							<input type="hidden" name="authState" value={this.props.data.authState} />
						</form>
						<article className="btn_wrap">
							<button type="button" className="btn_join1" id="submit_join" onClick={this._submit}>회원 가입하기</button>
						</article>
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
    changeRadio : (v) => dispatch(changeRadio(v)),
	}
}

JoinUser = connect(mapStateToProps, mapDispatchToProps)(JoinUser);

export default JoinUser;
