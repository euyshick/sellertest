import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps } from '../actions'


class LoginDefault extends Component{
	state = {
		validStatus : 0,					// 0:기본, 1:아이디 혹은 비밀번호 미입력, 2: 일치하는 정보 없음
		isCaptcha : 0,						// 5회이상 틀림 UI - 0:없음, 1:있음, 2:입력 안함
		isStayLogin : true,				// 로그인 상태 유지
		// isScurityLogin : true,	// 보안접속
		userPw : '',							// 비밀번호는 reducer에 저장하지 않음]
		captcha_code : '',				// 자동입력 방지문자
		captchaImgUrl : null,
	}

	constructor(props){
		super(props);
		this.eventSubmit = this.eventSubmit.bind(this);
		this.eventHandleInput = this.eventHandleInput.bind(this);
		this.eventHandleCheckbox = this.eventHandleCheckbox.bind(this);
		this.loadUserInfo = this.loadUserInfo.bind(this);
		this.snsAlert = this.snsAlert.bind(this);
		this.setCookie = this.setCookie.bind(this);
	}

	componentWillUpdate(nextProps,nextState){
		if(this.state.isCaptcha !== nextState.isCaptcha && nextState.isCaptcha===1){

			//console.log(nextState.isCaptcha);
			this.eventCaptcha();

		}
	}

	eventCaptcha = () => {
		this.setState({
			captcha_code:''
		})

		request({
			url:this.props.data.apiUrl.reqCaptcha,
		}).then(rsData=>{
			this.setState({
				captcha_key:rsData.data.captcha_key,
			})
			request({
				url:this.props.data.apiUrl.showCaptcha+'?captcha_key='+rsData.data.captcha_key,
			}).then(rsData=>{
				this.setState({
					captchaImgUrl:rsData.data.img_src,
				})
			})
		})
	}

	eventHandleCaptcha = () => { //캡차 인증코드
		const rqData = {
			captcha_key:this.state.captcha_key,
			captcha_code:this.state.captcha_code,
		}
		request({
			url:this.props.data.apiUrl.authCaptcha+jsonToQueryString(rqData)
		}).then(rsData=>{

			//console.log("캡차코드:"+rsData.code);
			//console.log("캡차성곡플래그:"+rsData.success_flag);
			if(rsData.success_flag===true){
				this.setState({
					isCaptcha:0,
					//captcha_code:'',
					captchaResp:null,
				})
				//this.eventSubmit();
					//console.log("유저아이디:"+this.props.data.userId);
				 // console.log("암호코드:"+this.state.captcha_key);
				 // console.log("입력숫자코드:"+this.state.captcha_code);

				const rqDataCap = {
						user_id:this.props.data.userId,
						captcha_key:this.state.captcha_key,
						captcha_code:this.state.captcha_code,
					}
								 // console.log("입력숫자코드:"+this.state.captcha_code);
									  //console.log(this.props.data.apiUrl.loginFailreset+jsonToQueryString(rqDataCap));
					request({
						url:this.props.data.apiUrl.loginFailreset+jsonToQueryString(rqDataCap)
					}).then(rsData=>{
								if(rsData.success_flag===true){
		                    //  console.log("비밀번호가 해지되었습니다.")
                        window.location.reload(true);
								}
	          });

				return;
			}



			this.setState({
				captchaResp:rsData.message
			});
			this.eventCaptcha(); // 캡차 인증이 안맞으면 다시 불러서 로딩한다.
		})
	}

	eventHandleInput = (e) => {
		const _name = e.target.name
		const _value = e.target.value.replace(/-/gi,'')		// 공백 제거
		const _obj = {}

		_obj[_name] = _value

		if(_name==='userId'){
			this.props.setProps(_obj)
			return;
		}

		this.setState(_obj)
	//console.log(_obj);
	}

	eventHandleCheckbox = (e) => {
		const obj = {}
		const _name = e.target.name
		obj[_name] = e.target.checked
		this.setState(obj)
	}

	eventSubmit = (e) =>{                    // 로그인 버튼 함수
    if(e) e.preventDefault();

		const userId = this.props.data.userId;
		const userPw = this.state.userPw;

		if( userId==='' || userPw==='' ){
			this.setState({
				validStatus:1,
			})
			if(userId===''){
				this.refs.userId.focus();
				return;
			}
			if(userPw===''){
				this.refs.userPw.focus();
				return;
			}
		}



		//  캡차 체크해야할 경우
		if(this.state.isCaptcha>0){
			// 캡차 맞는지 확인 후 다음단계
			if(this.state.captcha_code===''){
				this.refs.captcha_code.focus();
				this.setState({
					isCaptcha:2,
				})
				return;
			}

	    this.eventHandleCaptcha(); // 캡차가 있을경우 실행해서 성공/실패 값을 리턴한다.



		}

		const callback = (rsData) => {
			//console.log(rsData.code+' : '+rsData.message);

			switch (rsData.code) {
				case 404:		// 일치하는 정보가 없음
					this.setState({
						validStatus:2,
						isCaptcha:0,
					})
					break;

				case 400:		// 비밀번호 5회 이상 틀림
					// 자동입력 방지문자 틀렷을 경우 캡차 이미지 갱신
					this.setState({
						validStatus:0,
						isCaptcha:1,
					})
					break;

				case 201:		// 로그인 성공
       //console.log(rsData.data)
				this.setState({
					validStatus:0,
					token:rsData.data.token,
					adminIdx:rsData.data.admin_idxs,
				})

				// if(this.props.data.groupJoinStatus===2){
					this.loadUserInfo() //단체회원 이동사이트

					const tokenData =this.state.token;
	  			this.setCookie("auth_token", tokenData, "240")

      // 어드민 쿠키 추가
				  const adminIdxData =this.state.adminIdx;
	        this.setCookie("wwow_admin_idx_str", adminIdxData, "240") 


				//	return;
				// }

				if(rsData.data.shop_list && rsData.data.shop_list.total_row>0){
				//	console.log('로그인 성공 어드민 UI')
					this.props.setProps({
						isAdminLogin:true,
						adminShopData:rsData.data.shop_list,
					})
		      //console.log(rsData.f_auth)
          let super_authNum = rsData.f_auth
					this.props.setProps({

				   exData:Object.assign({},this.props.data.exData, {super_auth:super_authNum}),
				 });


				}else{
					let super_authNum = rsData.data.f_auth
					this.props.setProps({

					 exData:Object.assign({},this.props.data.exData, {super_auth:super_authNum}),
				 });

				 if(this.props.data.groupJoinStatus!==2){
					// console.log('로그인 성공 인덱스로 이동')
					 window.location.href="//www.pping.kr"
	       }

				}
				break;



				case 200:		// 로그인 성공
				// 	this.setState({
				// 		validStatus:0,
				// 		token:rsData.data.token,
				// 	})
				//
				// 	// if(this.props.data.groupJoinStatus===2){
				// 		this.loadUserInfo()
				//
				// 	//	return;
				// 	// }
				//
				// 	if(rsData.data.shop_list && rsData.data.shop_list.total_row>0){
				// 		console.log('로그인 성공 어드민 UI')
				// 		this.props.setProps({
        //       isAdminLogin:true,
        //       adminShopData:rsData.data.shop_list,
        //     })
				// 	}else{
				// 		console.log('로그인 성공 인덱스로 이동')
				// 		window.location.href="//www.pping.kr"
				// 	}
				// 	break;
				//
				// default:
				// 	this.setState({
				// 		validStatus:0,
				// 	})
				// 	// UI에서 표현하는 오류 이외에 에러 alert
				// 	alert(rsData.message);

					break;
					default:
					break;
			}
		}

		request({
			url:this.props.data.apiUrl.login,
			method:'post',
			body:{
				user_id:userId,
				user_pw:userPw,
				keep_login:this.state.isStayLogin?1:0,
			},
		}).then(callback)
	}

	loadUserInfo = () => {
		// 로그인 성공 후 reducer에 데이터 저장 후 페이지 이동
		const infocallback = (rsData) => {
			const user = rsData.data.user;
			const _userName = user.user_name;
			const _userId = user.user_id;
			let _mobile = user.user_hp;
			const _idx = user.user_idx;
			const _type = user.user_type.toLowerCase();



			if(_mobile.indexOf('-')===-1){
				if(_mobile.length>10) _mobile = _mobile.slice(0,3)+'-'+_mobile.slice(3,7)+'-'+_mobile.slice(7,11);
				else _mobile = _mobile.slice(0,3)+'-'+_mobile.slice(3,6)+'-'+_mobile.slice(6,10);
			}

			this.props.setProps({
				userName:_userName,
				userMobile:_mobile,
			});
			window.UserId = _userId;
			window.UserName = _userName;
			window.UserMobile = _mobile;
			window.IDX_MEMBER = _idx;
			window.UserType = (_type==='c')? 1:2;		// 1:일반회원, 2:단체회원

      // 단체회원 가입 중 이동한 상태
      if(this.props.data.groupJoinStatus===2){
  			browserHistory.replace('/join/group2');
      }
		}

		request({
			url:this.props.data.apiUrl.memberInfo+jsonToQueryString({auth_token:this.state.token}),
		}).then(infocallback)
	}

	snsAlert = () =>{
	window.alert(" 준비중 입니다.")
	}

 	setCookie = (name, value, expiredays) =>{

   var nday = 9 + parseInt(expiredays, 10);
   var today = new Date();
   today.setTime(today.getTime()+1000*60*60*nday );
		//document.cookie = name + "=" +escape(value) + ", expires=" + today.toGMTString()+',path=/,domain=.pping.kr'; success
		//document.cookie = name + "=" +escape(value) +";path=/;expires=" + today.toGMTString();  success2
		//document.cookie = name + "=" +escape(value) +";path=/;domain=.pping.kr';expires=" + today.toGMTString();  //success3
		//console.log(value);
		// document.cookie = name + "=" +escape(value) +";path=/;domain=.pping.kr;expires="+ today.toGMTString();  //success4
		document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toGMTString() + ';domain=.pping.kr';
	}


	render(){
		return(
			<div className="content_join login">

				<section className="login_wrap">
					<h1><a href="https://pping.kr/"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_2.png" alt="행복쇼핑" /></a></h1>

					{
						this.state.validStatus === 3?
						<div className="text_guide"><strong>비밀번호와 자동입력 방지문자를 입력해주세요.</strong><br/>
							비밀번호를 5회 이상 잘못 입력하면,<br/>
							정보보호를 위해 자동입력방지 문자를 함께 입력하셔야 합니다.</div>
						: null
					}

          <form onSubmit={this.eventSubmit}>
  					<article className="joinForm">
  						<ul className="t3">
  							<li>
  								<label htmlFor="userId">
  									<input type="text" className="istyle" id="userId" placeholder="아이디 (이메일/휴대전화 번호)"
  										maxLength="30" lang="en"
  										ref="userId"
  										name="userId"
  										value={this.props.data.userId}
  										onChange={this.eventHandleInput}
  									/>
  								</label>
  							</li>
  							<li>
  								<label htmlFor="userPw">
  									<input type="password" className="istyle" id="userPw" placeholder="비밀번호"
  									 	maxLength="30" lang="en"
  										ref="userPw"
  										name="userPw"
  										value={this.state.userPw}
  										onChange={this.eventHandleInput}
  									/>
  								</label>
  							</li>
  						</ul>

							{
								this.state.validStatus===1?
								<p className="validate_msg">아이디/비밀번호를 입력해 주세요.</p> : null
							}
							{
								this.state.validStatus===2?
								<p className="validate_msg">아이디/비밀번호를 다시 확인해 주세요.<br/>
  								<span className="text-default">입력하신 아이디 또는 비밀번호가 일치하지 않거나 행복쇼핑에<br/>
  								등록되지 않은 아이디입니다. 비밀번호는 대/소문자 구분하여<br/>
  								입력하시기 바랍니다.</span>
  							</p>
								: null
							}
  					</article>

  					{
  						this.state.isCaptcha>0?
  						<div className="area_captcha">
								<p className="validate_msg">로그인 시도제한 회수를 초과하였습니다. (5회)</p>
  							<p className="text">아래 이미지를 보이는 대로 입력해 주세요.</p>
								{
									this.state.captchaImgUrl === null?
									null :
									<div className="inputs">
	  								<span className="img"><img src={this.state.captchaImgUrl} alt=""/></span>
	  								<button type="button" onClick={this.eventCaptcha}><i className="icon-repeat"></i><br/>새로고침</button>
	  							</div>
								}
  							<label htmlFor="captcha">
  								<input type="text" className="istyle" id="captcha" placeholder="자동입력 방지문자"
  									lang="en" maxLength="10"
  									ref="captcha_code"
  									name="captcha_code"
  									value={this.state.captcha_code}
  									onChange={this.eventHandleInput}
  								/>
  							</label>
  							{
  								this.state.isCaptcha===2?
  								<p className="validate_msg">자동입력 방지문자를 입력해 주세요.</p> : null
  							}
								{
									this.state.captchaResp?
									<p className="validate_msg">{this.state.captchaResp}</p> : null
								}
  						</div>
  						: null
  					}

  					<article className="btn_wrap login">
  						<button type="submit" className="btn_point">로그인</button>
  					</article>
          </form>

					<article className="option_wrap">
						<span className="icheck keep">
							<input type="checkbox" id="t1" checked={this.state.isStayLogin}
								name="isStayLogin"
								onChange={this.eventHandleCheckbox}
							/>
							<label htmlFor="t1"><em>로그인 상태 유지</em></label>
							{
								this.state.isStayLogin?
								<span className="sub">
									<i></i>
									<span className="sub_in">
										본인의 개인정보 보호를 위해 꼭<br/><strong><em>개인PC</em>에서 사용</strong>해 주세요!
									</span>
								</span>
								: null
							}
						</span>
						{/*<span className="icheck">
							<input type="checkbox" id="t2" checked={this.state.isScurityLogin}
								name="isScurityLogin"
								onChange={this.eventHandleCheckbox}
							/>
							<label htmlFor="t2"><em>보안접속</em></label>
						</span>*/}
					</article>

					{
						this.state.isCaptcha===0?
						<article className="btn_wrap sns" onClick={this.snsAlert}>
							<button type="button" className="btn_naver" ><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_naver.png" alt="NAVER" /> 로그인</button>
							<button type="button" className="btn_facebook" ><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_facebook.png" alt="facebook" /> 로그인</button>
							<button type="button" className="btn_kakao" ><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_kakao.png" alt="kakao" /> 로그인</button>
							<button type="button" className="btn_instagram"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_instagram.png" alt="instagram" /> 로그인</button>
						</article>
						: null
					}

					<ul className="links_wrap">
						<li><a href="https://pping.kr/">홈</a></li>
						<li><Link to={"identify"}>아이디 찾기</Link></li>
						<li><Link to={"identify?f=1"}>비밀번호 찾기</Link></li>
						<li><Link to={"join"}>회원가입</Link></li>
					</ul>
				</section>
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
	}
}

LoginDefault = connect(mapStateToProps, mapDispatchToProps)(LoginDefault);

export default LoginDefault;
