import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { setProps, changeInput } from '../actions'
import { getParameter,request, format, jsonToQueryString } from '../../utils/Utils'

import FormUserId from '../components/FormUserId'
import FormPw from '../components/FormPw'
import FormPw2 from '../components/FormPw2'
import FormUserName from '../components/FormUserName'
import FormMobile from '../components/FormMobile'
import FormEmail from '../components/FormEmail'

class Identify extends Component{
	state = {
		tabMode:0,		//0:아이디찾기, 1:비번찾기
		findBy:0,			//0:휴대전화로 찾기, 1:이메일로 찾기
		statusId:0,		//0:정보 입력, 1:아이디찾기 인증 성공, 2:인증 성공 계정 정보 없음
		statusPw:0,		//0:정보 입력, 1:비번찾기 인증 성공, 2:인증 성공 계정 정보 없음, 3:비번 재설정 완료
	}
//console.log()
	componentWillMount(){
		this.props.setProps({
			pageId : 'Identify',
		});

		if(getParameter('f')){

			this.setState({
				tabMode: parseInt(getParameter('f'),10),
			})
		}

}

	componentWillUpdate(nextProps,nextState){

		if(this.state.tabMode!==nextState.tabMode && this.state.findBy!==0){
			this.setState({
				findBy:0,
			});
		}
		if(this.state.tabMode!==nextState.tabMode || this.state.findBy!==nextState.findBy){
			const obj_validStatus = {
				userId:0,
				userPw:0,
				userPw2:0,
				userName:0,
				authNum:0,
				mobile:0,
				email:0,
			}
			const obj_formData = {
				userName:'',
				userPw:'',
				userPw2:'',
				userId:'',
				mobile_0:'010',
				mobile_1:'',
				mobile_id:'',
				mobile_domain:'',
			}
			this.props.setProps({
				authState:0,
				authNum:'',
				formData:Object.assign({},this.props.data.validStatus,obj_formData),
				validStatus:Object.assign({},this.props.data.validStatus,obj_validStatus),
			});
			if(window.TIMER){
				clearInterval(window.TIMER);
			}
		}


	}



	/*
		components
	*/
	_certification = (isEmail) => {
		const {data,changeInput} = this.props;

		if(isEmail){
			return(
				<li>
					<div className="certify_input">
						<label htmlFor="userCertify" className="box_wrap">
							<input type="text" className="istyle" id="userCertify" placeholder="인증번호"
								maxLength="6" lang="en"
								name="authNum"
								disabled={data.authState===3}
								value={data.authNum}
								onChange={changeInput}
							/>
						</label>
					   <button type="button" className="btn_join3" 	disabled={data.authState===3} onClick={this._checkStep}>확인</button>
          </div>

					{
						data.authNum===""?
						<p className="validate_msg">인증번호를 입력해주세요.</p> : null
					}
					{
						data.authState===1?
						<p className="form_exp">인증번호는 발송 후 1시간 내에만 유효합니다.</p> : null
					}
					{
						data.authState===2?
						<p className="validate_msg">{data.validMsg.authNum['2']}</p> : null
					}
					{
						data.authState===3?
					  <p className="validate_msg">인증에 성공하였습니다.</p> : null
					}
				</li>
			);
		}
		else if(this.props.data.exData.statId===2){

						return;

		}

		else {
		return(

				<li>
					<div className="certify_input">
						<label htmlFor="userCertify" className="box_wrap">
							<input type="text" className="istyle" id="userCertify" placeholder="인증번호"
								maxLength="6" lang="en"
								name="authNum"
								disabled={data.authState===3}
								value={data.authNum}
								onChange={changeInput}
							/>
						</label>
						 <button type="button" className="btn_join3" disabled={data.authState===3} onClick={this._checkStep}>확인</button>
					</div>
					{
						data.authState===1?
						<p className="info_msg">인증 유효시간 : <em lang="en">{data.cntMin>0?data.cntMin+'분':null}{data.cntSec}초</em></p> : null
					}
					{
						data.authState===2?
						<p className="validate_msg">{data.validMsg.authNum['2']}</p> : null
			    }
					{
						data.authState===3?
						<p className="validate_msg">인증에 성공하였습니다.</p> : null
					}
				</li>


			);
		}
	}

	/*
		events
	*/
_login =()=>{
			window.location.href="https://www.pping.kr/"
}

//인증 확인 이벤트
_checkStep=()=>{

	const {data} = this.props;
	this._formValid();

 if(this.props.data.authNum==="") return;   //인증번호 없으면 정지
			const obj_exData = {
					auNum:0,
					statId:0,
					tab_Mode:0,
					statPw:0,
					find_By:0,
					exchord:"",
					id:"",
				}

			const mobile_0 = data.formData.mobile_0;
			const mobile_1 = data.formData.mobile_1;

if(!this._formValid()) return;

if(this.state.tabMode===0){		// tabMode:0  아이디 찾기

// API로 아이디 찾기 코드 시작

let rqData = {};

if(this.state.findBy===0){  // findBy:0 핸드폰으로 찾기

		rqData = { // 핸드폰으로 찾기
			 kind: 1,
			 pdata: mobile_0 + mobile_1,
			 nm: data.formData.userName,
			 authkey: data.authNum,
			 authcode: data.exData.exchord,
	 }

}else{ // 이메일로 찾기

	rqData = {
	 kind:2,
	 pdata:data.formData.email_id+'@'+data.formData.email_domain,
	 nm:data.formData.userName,
	 authkey:data.authNum,
	 authcode:data.exData.exchord,
	 }

}

	request({
		url:this.props.data.apiUrl.idfind+'/'+jsonToQueryString(rqData),
	}).then(rsData=>{

		let v = 0; //인증전

		if(rsData.message.toLowerCase()==='success'){     // 인증 성공

				  v = 3; // 인증성공

						//console.log("아이디가 인증되었습니다:"+rsData.id)
					 obj_exData.id = rsData.id;
					 obj_exData.statId = 1;   // 아이디찾기 인증 성공
					 this.props.setProps({
					 exData:Object.assign({},obj_exData),
					 });
				// let statusValue  =this.props.data.exData.statId; // 다음 클릭에 아이디 인증 필요
				//  this.setState({
				// 			statusId:statusValue,
				// 			});

			} else {			// 인증 실패

					v = 2;  //값이 유효하지않음

					//console.log("fail")
			}

			this.props.setProps({
			 authState:v,
			 validStatus:Object.assign({},this.props.data.validStatus, {authNum:0}),
		 });

	}); // then end

 // 비밀번호 찾기

} else if(this.state.tabMode===1){	// tabMode:1 비밀번호 찾기

						if(this.state.statusPw===0){		// statusPw:0 비번찾기 정보입력


						} else if(this.state.statusPw===1){		// statusPw:1 비번찾기 인증성공

							if(data.passwordLevel2===1){      // 1 비번 재입력 일치
								this.setState({
									statusPw:3,   // statusPw:3 비번 재설정 완료
								});
							}
						}   //  statusPw:1 비번찾기 인증성공  END

		 // 비밀번호 재설정

		if(this.state.statusPw===1){   // statusPw:1 비번찾기 인증 성공

		}else{      //비밀번호 찾기 인증

			request({
				url:this.props.data.apiUrl.authHashData+'/'+this.props.data.authNum,
			}).then(rsData=>{
				let v = 0;
				if(rsData.authhashcode === this.props.data.exData.exchord){     // 인증 성공
						v = 3;
						//console.log('비밀번호 찾기 인증 :success');
						// this.setState({
						// 	statusPw:1,  // statusPw:1  비밀번호 인증에 성공
						// });
				} else {		// 인증 실패

							//console.log('비밀번호 찾기 인증 :fail');
						v = 2;
						this.setState({
							statusPw:2,
						});

				}
				this.props.setProps({
				 authState:v,
				 validStatus:Object.assign({},this.props.data.validStatus, {authNum:0}),
			 });

			});

		}

} //비밀번호 찾기 끝


}

_nextStep = (e)=>{

		const {data} = this.props;
		//console.log(this.props.data.validStatus.mobile===2) //휴대전화 미입력시 문구
		this._formValid();

     if(this.props.data.authNum==="") return;   //인증번호 없으면 정지

		const mobile_0 = data.formData.mobile_0;
		const mobile_1 = data.formData.mobile_1;

		if(!this._formValid()) return;

		if(data.authState===3){  // authState:3 인증성공  아이디 찾기 인증 성공하면

						   if(this.state.tabMode===0){	//tabMode:0  아이디찾기
										let statusValue  =this.props.data.exData.statId;
									  this.setState({
												statusId:statusValue,   //statusId :1 아이디찾기 인증성공
												});

							}else if(this.state.tabMode===1){ //tabMode:1  비번찾기

										this.setState({
						 					statusPw:1,  // statusPw:1  비밀번호 인증에 성공
						 				});
				      }

		}

  if(this.state.tabMode===1){	// tabMode:1 비밀번호 찾기

				if(this.state.statusPw===1){   // statusPw:1 비번찾기 인증 성공

								let setValueData="";  // 핸드폰과 이메일 값 변수
								let kindValue=0;      // 1: 핸드폰, 2: 이메일

								if(this.state.findBy===1){   // findBy:1 이메일로 찾기

									setValueData= data.formData.email_id+'@'+data.formData.email_domain;
									kindValue =2; // 이메일로 찾기

								 }else{    // findBy:0 휴대전화로 찾기

								  setValueData =mobile_0+mobile_1;
								  kindValue =1;  // 휴대전화로 찾기
								}

						request({
							url:this.props.data.apiUrl.repwd,
							method:'post',
							body:{
										kind:kindValue,
										pdata:setValueData,
										nm:data.formData.userName,
										uid:data.formData.userId,
										pw:data.formData.userPw2,
							},
						}).then(rsData=>{

							   let v = 0;  //authState: 0 인증전
									if(rsData.message.toLowerCase()==='success'){     // 인증 성공

											 v = 3;  //authState: 3 인증성공
											//console.log('비밀번호 재설정 :success');
											this.setState({
												statusPw:3,  //비밀번호 재설정 완료
											});

									} else {			// 인증 실패

											v = 2;   // authState: 2 값이 유효하지않음
											this.setState({
												statusPw:2, // 인증 계정정보 없음
											});
									}

								this.props.setProps({
								 authState:v,
								 validStatus:Object.assign({},this.props.data.validStatus, {authNum:0}),
							  });
						});  // then END
				}
    } //비밀번호 찾기 끝
}// NEXT STEP 다음버튼 끝


_formValid = () => {
		const {data} = this.props;
		let checkCnt = 0;
    let newObj = {};

		let collectError = {
				element:[]
			}
			if(this.state.tabMode===1){		//비밀번호 찾기
				if(data.formData.userId==='' || data.validStatus.userId!==0){
							collectError.element.push('#userId');
		      if(data.validStatus.userId===0){
		        newObj['userId'] = 1;
		      }
		      checkCnt +=1;
		    }else{
		      newObj['userId'] = 0;
		    }
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

		if(this.state.findBy===0){		// 휴대폰으로 찾기
			if(data.formData.mobile_1===''){
						collectError.element.push('#mobile_1');
	      if(data.validStatus.mobile===0){
	        newObj['mobile'] = 1;
	      }
	      checkCnt +=1;
			}else if(data.validStatus.mobile>1){
	      checkCnt +=1;
	    }else{
	      newObj['mobile'] = 0;
	    }
		} else if(this.state.findBy===1) {		// 이메일로 찾기

			if(data.formData.email_id==='' || data.formData.email_domain===''){
				collectError.element.push('#userEmail1');
	      if(data.validStatus.email===0){
	        newObj['email'] = 1;
	      }
	      checkCnt +=1;
				//console.log(data.validStatus.email)
			}else if(!format.isEmail(data.formData.email_id+'@'+data.formData.email_domain)){
	      if(data.validStatus.email===0){
	        newObj['email'] = 2;
	      }
	      checkCnt +=1;
			}else if(data.validStatus.email>1){
	      checkCnt +=1;
	    }else{
	      newObj['email'] = 0;
	    }
		}

		if(data.authState!==1 && data.authState!==2 && data.authState!==3){		// 인증번호 유효성 검사
			newObj['authNum'] = 1;
			checkCnt +=1;
		}else{
			newObj['authNum'] = 0;
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

	componentDidUpdate(){

		// if((this.props.data.validStatus.mobile>0 && this.props.data.validStatus.mobile!==4) || (this.props.pageId === 'Identify' && this.props.authState===-1)){
		//
		// 	console.log("휴대전화")
		// }
		// else{
		//
		// 	console.log("닫힘")
		//
		// }
	}

	render(){

		const forms = (
			<section className="joinForm searchForm">
				<article className="search_phone">
					<span className="radio_wrap">
						<span className="iradio">
							<input type="radio" id="s1" name="findby" value="0"
								checked={this.state.findBy===0} onChange={(e)=>{ this.setState({findBy:parseInt(e.target.value,10)}) }} />
							<label htmlFor="s1"><em>휴대전화로 찾기</em></label>
						</span>
					</span>
					<span className="exp">가입 당시 입력한 휴대전화 번호를 통해 아이디를 찾을 수 있습니다.</span>
				{
					this.state.findBy!==1?
					<ul>
						{
							this.state.tabMode===1?
							<FormUserId /> : null
						}
						<FormUserName />
						<FormMobile  tabMode={this.state.tabMode}
                          findBy={this.state.findBy}/>
						{
							this.props.data.authState>0?
							this._certification() : null
						}
					</ul>
					: null
				}
				</article>
				<article className="search_email">
					<span className="radio_wrap">
						<span className="iradio">
							<input type="radio" id="s2" name="findby" value="1"
								checked={this.state.findBy===1} onChange={(e)=>{ this.setState({findBy:parseInt(e.target.value,10)}) }}/>
							<label htmlFor="s2"><em>이메일로 찾기</em></label>
						</span>
					</span>
					<span className="exp">가입 당시 입력한 이메일 주소를 통해 아이디를 찾을 수 있습니다.</span>
				{
					this.state.findBy===1?
					<ul>
						{
							this.state.tabMode===1?
							<FormUserId /> : null
						}
						<FormUserName />
						<FormEmail tabMode={this.state.tabMode}
						            findBy={this.state.findBy}/>
						{
							this.props.data.authState>0?
							this._certification(true) : null
						}
					</ul>
					: null
				}
				</article>
				<div className="joinInfo t2">
					<ul>
						<li>
							<i></i> <span>본인 인증시 제공되는 정보는 인증 이외의 용도로 이용 또는 저장되지 않습니다.</span>
						</li>
					</ul>
				</div>
			</section>
		);

		const successId = (
			<section className="joinForm searchId">
				<article className="find_result">
					고객님의 아이디는<br /><strong lang="en">{this.props.data.exData.id}</strong> 입니다.
				</article>
				<div className="joinInfo t2">
					<ul>
						<li>
							<i></i> <span>비밀번호가 기억나지 않는 경우에는 <a href="#" onClick={(e)=>{
								e.preventDefault();
								this.setState({
									tabMode:1
								});
							}}>비밀번호 찾기</a>를 이용해 주세요.</span>
						</li>
					</ul>
				</div>
			</section>
		);

		const successPw = (
			<section className="joinForm reset">
				<article>
					<h4>비밀번호 재설정</h4>
					<p className="tit_exp">
						회원님의 계정 비밀번호를 재설정해 주세요.
					</p>
					<ul>
						<FormPw />
						<FormPw2 />
					</ul>
				</article>
				<div className="joinInfo t2">
					<ul>
						<li>
							<i></i> <span>{this.props.data.validMsg.userPw['2']}</span>
						</li>
						<li>
							<i></i> <span>연속된 숫자 문자(4개 이상)는 제한됩니다.</span>
						</li>
					</ul>
				</div>
			</section>
		);

		const noResult = (
			<section className="joinForm searchId">
				<article className="find_result">
					입력하신 정보로 등록된 회원이 없습니다.<br />정보를 <strong>다시 확인</strong>하고 시도해 주세요.
				</article>
				<div className="joinInfo t2">
					<ul>
						<li>
							<i></i> <span>직접 찾기가 불가능한 경우에는 <a href="//help.minishop.pping.kr/">고객센터</a>로 문의 바랍니다.</span>
						</li>
					</ul>
				</div>
			</section>
		);

		const btnNext = (
			<article className="btn_wrap">
				<button type="button" className="btn_join1"
					//value={this.state.tabMode!==1?'0':'1'}
					onClick={this._nextStep}>다음</button>
			</article>
		);

		const btnLogin = (
			<article className="btn_wrap">
				<button type="button" className="btn_join1" ><Link to={"/"}>로그인</Link></button>

			</article>
		);

		const tabContent = () => {


			if(this.state.tabMode!==1){
				switch(this.state.statusId){
					case 0:      // 기본
						return(
							<div>
								{forms}
								{btnNext}
							</div>
						)
					case 1:    // 아이디찾기 성공했을경우
						return(
							<div>
								{successId}
								{btnLogin}
							</div>
						)
					case 2:      // 실패했을경우
						return(
							<div>
								{noResult}
								{btnLogin}
							</div>
						)
					default:
						return(
							<div></div>
						)
				}
			} else {
				switch(this.state.statusPw){
					case 0:
						return(
							<div>
								{forms}
								{btnNext}
							</div>
						)
					case 1:
						return(
							<div>
								{successPw}
								{btnNext}
							</div>
						)
					case 2:
						return(
							<div>
								{noResult}
								{btnLogin}
							</div>
						)
					case 3:
						return(
							<div>
								<section className="joinForm searchId">
									<article className="find_result">
										비밀번호가 재설정 되었습니다.<br/>로그인 후 서비스를 이용할 수 있습니다.
									</article>
									<div className="joinInfo t2">
										<ul>
											<li>
												<i></i> <span>직접 찾기가 불가능한 경우에는 <a href="http://help.minishop.pping.kr/">고객센터</a>로 문의 바랍니다.</span>
											</li>
										</ul>
									</div>
								</section>
								{btnLogin}
							</div>
						)
					default:
						return(
							<div></div>
						)
				}
			}
		}

		return(
      <div className="container">
        <div className="content_wrap">
          <div className="content_join">

            <h2>아이디/비밀번호 찾기</h2>
            <nav className="tab">
              <ul>
                <li className={this.state.tabMode!==1?"on":null}>
                  <button type="button" onClick={()=>{
										this.setState({tabMode:0});
									}}>아이디 찾기</button>
                </li>
                <li className={this.state.tabMode===1?"on":null}>
                  <button onClick={(e)=>{
										this.setState({tabMode:1});
									}}>비밀번호 찾기</button>
                </li>
              </ul>
            </nav>

						{tabContent()}
          </div>
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
	}
}

Identify = connect(mapStateToProps, mapDispatchToProps)(Identify);

export default Identify;
