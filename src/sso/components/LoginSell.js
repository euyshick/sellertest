import React, {Component} from 'react'
import { connect } from 'react-redux'
import {browserHistory } from 'react-router'
import { Link} from 'react-router'
import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps } from '../actions'


class LoginSell extends Component{ 
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
		this.loadSellerInfo = this.loadSellerInfo.bind(this);


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

				const rqDataCap = {
						user_id:this.props.data.userId,
						captcha_key:this.state.captcha_key,
						captcha_code:this.state.captcha_code,
					}

					request({
						url:this.props.data.apiUrl.loginFailreset+jsonToQueryString(rqDataCap)
					}).then(rsData=>{
								if(rsData.success_flag===true){

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
					this.loadSellerInfo() //단체회원 이동사이트

					let super_authNum = rsData.data.f_auth
  					this.props.setProps({
             exData:Object.assign({},this.props.data.exData, {super_auth:super_authNum}),
  				 });



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


	loadSellerInfo = () => {
		// 단체회원 로그인 성공 후 reducer에 데이터 저장 후  단체회원 페이지 이동

		const infocallback = (rsData) => {
      console.log(rsData)
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
			//window.UserId = _userId;
			//window.UserName = _userName;
			window.UserMobile = _mobile;
			window.IDX_MEMBER = _idx;
			window.UserType = (_type==='c')? 1:2;		// 1:일반회원, 2:단체회원

   let sellerDataObject ={

		UserGroupId : _userId,
		MainUserId : "drhong1234",  //담당자 id (개인 아이디)
		MainUserName :"홍의식",     //담당자 id  ( 개인 이름)
		groupCompanyName : _userName,      //상호(단체명)
		groupePresentName :"대표자홍의식",       // 대표자명

		lawNumber :"110111-6400355",       // 법인등록번호
		companyNumber :"504-87-00712",       // 사업자등록번호
		uniqueNumber :"12345",              //    고유번호
		mainCompanyTelNumber:"02-333-2222",    // 대표 전화 번호
		bizType:"",                          // 단체 구분   개인,영리법인,비영리법인,공식단체
    successLogin:1                         //로그인 성공
	 }


					this.props.setProps({
					 seller:Object.assign({},this.props.data.seller, sellerDataObject),
				 });

  		browserHistory.replace('/sell/apply');

		}

		request({
			url:this.props.data.apiUrl.memberInfo+jsonToQueryString({auth_token:this.state.token}),
		}).then(infocallback)
	}


	render(){
		return(
      <div id="container">
        <section className="section-sellermember">
          <article className="section-sellermember_login">
            <h2 className="tit-h2">행복쇼핑 판매회원 신청</h2>
            <p className="dsc">
              <strong>행복쇼핑의 <span>단체 아이디로 로그인</span>해 주세요.<br />판매회원은 신청 후 가입 완료까지 심사 대기시간이 있습니다.</strong>
            </p>

            <div className="section-sellermember_login_input">

              {
      						this.state.validStatus === 3?
      						<div className="text_guide"><strong>비밀번호와 자동입력 방지문자를 입력해주세요.</strong><br/>
      							비밀번호를 5회 이상 잘못 입력하면,<br/>
      							정보보호를 위해 자동입력방지 문자를 함께 입력하셔야 합니다.</div>
      						: null
      					}

              <form onSubmit={this.eventSubmit}>
                <fieldset>
                  <legend><span>판매회원 로그인</span></legend>
                  <input type="text" title="아이디 (이메일/휴대전화 번호) 입력" placeholder="단체회원 아이디 (이메일/휴대전화 번호)" className="istyle ilogin"
                          id="userId" maxLength="30" lang="en"
                          ref="userId"
                          name="userId"
                          value={this.props.data.userId}
                          onChange={this.eventHandleInput}
                   />


                  <input type="password" title="비밀번호 입력" placeholder="비밀번호" id="userPw" className="istyle ilogin ipassword"
                             maxLength="30" lang="en"
          										ref="userPw"
          										name="userPw"
          										value={this.state.userPw}
          										onChange={this.eventHandleInput}
                   />

                {
  								this.state.validStatus===1?
  								<p className="validate_msg">아이디/비밀번호를 입력해 주세요.</p> : null
  							}
  							{
  								this.state.validStatus===2?
                  <p className="validate_msg"><span>아이디/비밀번호를 다시 확인해 주세요.</span><br />
                  입력하신 아이디 또는 비밀번호가 일치하지 않거나 행복쇼핑에<br />
                  등록되지 않은 아이디입니다. 비밀번호는 대/소문자 구분하여<br />입력하시기 바랍니다.</p>

  								: null
  							}


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
                  <input type="submit" value="로그인" className="btn_login_submit" />
                </fieldset>
              </form>
            </div>
            <ul className="section-sellermember_login_menu">
              <li><Link to={"identify"}>단체회원 아이디 찾기</Link></li>
              <li><Link to={"identify?f=1"}>단체회원 비밀번호 찾기</Link></li>
              <li><Link to={"join/group1"} >단체 회원가입</Link></li>
            </ul>
          </article>
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

LoginSell = connect(mapStateToProps, mapDispatchToProps)(LoginSell);

export default LoginSell;
