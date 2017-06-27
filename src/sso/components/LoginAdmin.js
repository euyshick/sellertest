import React, {Component} from 'react'
import { connect } from 'react-redux'

import ImageGallery from 'react-image-gallery'

import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps } from '../actions'

import '../../css/ssoAdminBanner.css'

const slideBanners = [
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_01.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_02.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_03.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_04.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_05.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_06.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_07.png'},
	{original:'//img.happyshopping.kr/img_static/img_pres/sso/bnr_admin_login_08.png'},
]
class LoginAdmin extends Component{

	state = {
		isVisibleBanner:false,	// 배너 펼쳐보기
		search_shop:'',					// 상점 검색 단어
		toggleLayer:{},
		adminShopData:{},
		certifyCode:'',
		remain_cnt:5,
		certifyCodeHash:'',
		fail_limite:false,
		newdata:"",
	}

	constructor(props){
		super(props)
		this.eventHandleInput = this.eventHandleInput.bind(this)
		this.eventCallList = this.eventCallList.bind(this)
		this.eventRequestSms = this.eventRequestSms.bind(this)
		this._adminMove =this._adminMove.bind(this)
				this._adminNew =this._adminNew.bind(this)

	}

	componentWillMount(){
		if(this.props.data.adminShopData){

			this.setState({
				adminShopData : this.props.data.adminShopData,
				curr_page : parseInt(this.props.data.adminShopData.curr_page,10),
			})
		} else {
			// sso 페이지에 직접 접근시 미니샵 목록 호출
			this.eventCallList(1);
		}

		this.setState({
			companyInfor : "http://pping.co/simpleLogin/"+window.IDX_MEMBER+"/"+window.SHA_CODEIDX,
			happyTree : "http://happytree.io/simpleLogin/"+window.IDX_MEMBER+"/"+window.SHA_CODEIDX
		})

	}

	componentWillUpdate(nextProps,nextState){
		if(this.state.toggleLayer !== nextState.toggleLayer){
			this.setState({
				certifyCode:'',
				remain_cnt:5,
			})
		}
	}

	_shopList = () => {
		if(!this.state.adminShopData.list) return;

		const data = this.state.adminShopData.list
		if(data.length>0){
			return data.map((d,index)=>{

				return(
					<li key={d.pr_idx}>

						<span className="num" ref={'mall_num_'+d.pr_idx}>{d.mall_num}</span>
						<span className="name" ref={'mall_name_'+d.pr_idx}>{d.mall_name}</span>
		        <span  ref={'mall_seq_'+d.pr_idx} data-seq={d.mall_seq}></span>

						{
							!this.state.toggleLayer[d.pr_idx]?
							<button type="button" className="btn icon-user" onClick={this.eventRequestSms} value={d.pr_idx} data-hp={d.hp} data-index={index}>로그인</button>
							:
							<button type="button" className="btn" onClick={this.eventCloseLayer}>닫기<i className="icon-angle-up"></i></button>
						}
						{
							this.state.toggleLayer[d.pr_idx]?
							<div className="box_certi">
								<div className="text_certi">
									<strong>{d.hp.split('-')[0]+'-****-'+d.hp.split('-')[2]}</strong>(으)로 인증번호가 전송되었습니다.<br/>
									{!this.state.fail_limite? <span>{this.state.remain_cnt}회 남음 (최대 {this.state.remain_cnt}회)</span> : null}
								</div>
								{
									!this.state.fail_limite?
									<div className="form_certi">
										<input type="text" name="certifyCode" onChange={this.eventHandleInput} maxLength="6" lang="en" />
										<button type="button" onClick={this.eventAuthSubmit}>인증하기</button>
									</div>
									:
									<div className="form_certi validate_msg">
										[0] 회 남음 (최대 5회) 행복쇼핑에 문의해주세요.
									</div>
								}
							</div>
							: null
						}
					</li>
				)
			})
		}else{
			return(<li style={{padding:'40px 0',textAlign:'center'}}>미니샵이 없습니다</li>)
		}
	}

	_paging = () => {
		if(this.state.adminShopData.list===undefined || this.state.adminShopData.list.length===0) return false;

		const d = this.state.adminShopData
		const page_unit = 3

		const i = parseInt((this.state.curr_page-1)/page_unit,10)*3
		if(isNaN(i)) return false;

		const nums = () => {
			const a = [i+1,i+2,i+3];
			return a.map((a,index)=>{
				if(a>this.state.adminShopData.total_page) return false;
				return(
					<button type="button" className={this.state.curr_page===a?"btn_num on":"btn_num"} value={a} key={index} onClick={this.eventCallList}>{a}</button>
				)
			})
		}

		return(
			<div className="area_paging">
				{
					d.total_page>3?
					<button type="button" className="btn_tx" value="0" onClick={this.eventCallList}><i className="icon-angle-double-left"></i>처음</button> : null
				}
				<button type="button" className="btn_tx" value="-1" onClick={this.eventCallList}><i className="icon-angle-left"></i>이전</button>
				<span className="btn_nums">
					{nums()}
				</span>
				<button type="button" className="btn_tx" value="+1" onClick={this.eventCallList}>다음<i className="icon-angle-right"></i></button>
				{
					d.total_page>3?
					<button type="button" className="btn_tx" value={d.total_page} onClick={this.eventCallList}>끝<i className="icon-angle-double-right"></i></button> : null
				}
			</div>
		)
	}

	/*
		events
	*/
	_adminMove = (url) => { // 구관리자



		post_to_url("https://adm.pping.kr/admin_check",{'adm_usid' :window.UserId,'bug' : "bugwwow",
	                                                  'mall_num' :0,'mall_seq' :1,
	 																								 'pr_idx' : 1,'depo_rurl':""})
	 		function post_to_url(path, params, method){
	 		    method = method || "post"; // 전송 방식 기본값을 POST로


	 		    var form = document.createElement("form");
	 		    form.setAttribute("method", method);
	 		    form.setAttribute("action", path);

	 		    //히든으로 값을 주입시킨다.
	 		    for(var key in params) {
	 		        var hiddenField = document.createElement("input");
	 		        hiddenField.setAttribute("type", "hidden");
	 		        hiddenField.setAttribute("name", key);
	 		        hiddenField.setAttribute("value", params[key]);

	 		        form.appendChild(hiddenField);
	 		    }

	 		    document.body.appendChild(form);
	 		    form.submit();
	 		}

	}

_adminNew = () => { // 행복쇼핑 직원일 경우



	post_to_url("https://adm.pping.kr/admin_check",{'adm_usid' :window.UserId,'bug' : "bugwwow",
																									'mall_num' :0,'mall_seq' :1,
																								 'pr_idx' : 1,'depo_rurl':"https://admin.pping.kr"})
		function post_to_url(path, params, method){
				method = method || "post"; // 전송 방식 기본값을 POST로


				var form = document.createElement("form");
				form.setAttribute("method", method);
				form.setAttribute("action", path);

				//히든으로 값을 주입시킨다.
				for(var key in params) {
						var hiddenField = document.createElement("input");
						hiddenField.setAttribute("type", "hidden");
						hiddenField.setAttribute("name", key);
						hiddenField.setAttribute("value", params[key]);

						form.appendChild(hiddenField);
				}

				document.body.appendChild(form);
				form.submit();
		}

}



	eventHandleInput = (e) => {
		const _name = e.target.name
		const _value = e.target.value
		const _obj = {}
		_obj[_name] = _value
		this.setState(_obj)
	}

	eventCallList = (e) => {
		if(typeof e === 'object') e.preventDefault();
		const { data, setProps } = this.props;
		let _p = typeof e === 'number'? e : 1;

		if(typeof e === 'object'){
			switch(e.target.value){
				case '0':
					_p = 1;
					break;
				case '-1':
					_p = this.state.curr_page - 1 > 0? this.state.curr_page - 1 : 1;
					break;
				case '+1':
					_p = this.state.curr_page + 1 > this.state.adminShopData.total_page ? this.state.adminShopData.total_page : this.state.curr_page + 1;
					break;
				case String(this.state.adminShopData.total_page):
					_p = parseInt(this.state.adminShopData.total_page,10);
					break;
				default:
					_p = parseInt(e.target.value,10);
					break;
			}
		}
		if(isNaN(_p)) _p = 1;

		const rqData = {
			p:_p,
			search_shop:this.state.search_shop,
			user_idx:window.IDX_MEMBER,
			user_type:window.UserType,
		}
		const callback = (rsData) => {
			if( rsData.code!==200){
				setProps({isAdminLogin:false});
				return;
			}

			//샵 리스트에서 f_auth 가져오기
			let super_authNum = rsData.f_auth
			this.props.setProps({

			 exData:Object.assign({},this.props.data.exData, {super_auth:super_authNum}),
		 });

			this.setState({
				toggleLayer:{},
				adminShopData:rsData.data,
				curr_page:parseInt(rsData.data.curr_page,10),
			})
			setProps({
				adminShopData:rsData.data
			})
		}

		request({
			url:data.apiUrl.shopList+jsonToQueryString(rqData)
		}).then(callback)
	}

	eventCloseLayer = (e) => {
		this.refs.shopLists.style.marginTop = ''		// related with design
		this.setState({
			toggleLayer:{}
		})
	}

	eventLogout = (e) => {
		e.preventDefault();
		this.props.setProps({
			isAdminLogin:false,
			userId:'',
		})


		window.UserId = null;
		window.UserName = null;
		window.UserMobile = null;
		window.IDX_MEMBER = '';
		window.UserType = '';


	}

	eventRequestSms = (e) => { // 관리자 미니샵 로그인 클릭
		const v = e.target.value
		this.setState({
			newdata:v
		})

		const o = {}
		o[v] = true
		this.setState({
			toggleLayer:o
		})

		//console.log("adm_usid:"+window.UserId);
		//console.log("adm_num:"+this.refs['mall_num_'+v].innerText);
		//console.log("pr_idx:"+v);
	//	console.log("adm_seq:"+this.refs['mall_seq_'+v].getAttribute('data-seq'));
		//console.log(this.refs['pr_idx'+v]);


		const rqData = {
			mall_num:parseInt(this.refs['mall_num_'+v].innerText,10),
			mall_name:this.refs['mall_name_'+v].innerText,
			hp:e.target.getAttribute('data-hp'),
			user_idx:window.IDX_MEMBER,
		}

		const callback = (rsData) => {

			if( rsData.code === 200){
				this.setState({
					remain_cnt:rsData.data.remain_cnt,
					certifyCodeHash:rsData.data.certifyCodeHash,
				})
			}else{
				if( rsData.code === 400){
					this.setState({
						fail_limite:true,
					})
				}
			}
		}

		// related with design
		if( parseInt(e.target.getAttribute('data-index'),10) > 4){
			this.refs.shopLists.style.marginTop = (parseInt(e.target.getAttribute('data-index'),10) - 4) * -37 +'px'
		} else {
			this.refs.shopLists.style.marginTop = ''
		}

		request({
			url:this.props.data.apiUrl.reqSms+jsonToQueryString(rqData)
		}).then(callback)





	}
// 관리자 미니샵 로그인  클릭 끝


	eventAuthSubmit = () => {
		request({
			url:this.props.data.apiUrl.authSms,
			method:'post',
			body:{
				certifyCode:this.state.certifyCode,
				certifyCodeHash:this.state.certifyCodeHash,
			}
		}).then(rsData=>{

			if(rsData.code===200){
			//console.log('어드민 사이트로 이동')
    //  console.log(this.state.newdata);
			//window.href.location="https://adm.pping.kr/home"

      let v =this.state.newdata

			 post_to_url("https://adm.pping.kr/admin_check",{'adm_usid' :window.UserId,'bug' : "bugwwow",
			                                                 'mall_num' : this.refs['mall_num_'+v].innerText,
			 																							 'mall_seq' :this.refs['mall_seq_'+v].getAttribute('data-seq'),
			 																							 'pr_idx' : v,})
			 	function post_to_url(path, params, method){
			 	    method = method || "post"; // 전송 방식 기본값을 POST로


			 	    var form = document.createElement("form");
			 	    form.setAttribute("method", method);
			 	    form.setAttribute("action", path);

			 	    //히든으로 값을 주입시킨다.
			 	    for(var key in params) {
			 	        var hiddenField = document.createElement("input");
			 	        hiddenField.setAttribute("type", "hidden");
			 	        hiddenField.setAttribute("name", key);
			 	        hiddenField.setAttribute("value", params[key]);

			 	        form.appendChild(hiddenField);
			 	    }

			 	    document.body.appendChild(form);
			 	    form.submit();
			 	}

      }

		})
	}

	render(){
		return(
      <div className="content_join admin">
      	<div className="section_top">
      		<button type="button" className="banner"
						onClick={(e)=>{
							this.setState({
								isVisibleBanner:true
							})
						}}
					>행복쇼핑 에코 시스템<span>펼쳐보기 <i className="icon-arrow-down"></i></span></button>

					{
						this.state.isVisibleBanner?
						<div className="area_full" style={this.state.bannerImageLoaded?{visibility:'visible'}: {visibility:'hidden'}}>
							<div className="area_wrap">
								<button type="button" className="btn_close icon-close"
									style={{zIndex:10}}
									onClick={(e)=>{
										this.setState({
											isVisibleBanner:false
										})
									}}
								><span className="blind">닫기</span></button>
								<ImageGallery
									items={slideBanners}
									showThumbnails={false}
									showFullscreenButton={false}
									useBrowserFullscreen={false}
									showPlayButton={false}
									showBullets={false}
									showIndex={true}
									onImageLoad={()=>{
										this.setState({
											bannerImageLoaded:true
										})
									}}
								/>
							</div>
						</div>
						: null
					}
      	</div>
      	<div className="section_info">
      		<strong className="area_name">{this.props.data.userName}</strong>


					{
						this.props.data.exData.super_auth ===1?
      		<span className="area_links">
            <span className="link"><a href="https://pping.kr/"><b>홈</b></a></span>
      			<span className="link"><a href="https://sso.pping.kr/logout">로그아웃</a></span>
						<span className="link"><a href="http://mypage.minishop.pping.kr/">마이페이지</a></span>
						<span className="link"><button type="button" onClick={this._adminMove}>구관</button></span>
						<span className="link"><button type="button" onClick={this._adminNew}>신관</button></span>
						<span className="link"><a href={this.state.companyInfor}>회사</a></span>
						<span className="link"><a href={this.state.happyTree}>해피</a></span>

				  	</span>
						: <span className="area_links">
						  <span className="link"><a href="https://pping.kr/"><b>홈</b></a></span>
					    <span className="link"><a href="https://sso.pping.kr/logout">로그아웃</a></span>
								 <span className="link"><a href="http://mypage.minishop.pping.kr/">마이페이지</a></span>

									</span>
						}

      	</div>
      	<div className="section_cont">
      		<div className="area_search">
      			<strong>관리자 로그인</strong>
      			<form className="search" onSubmit={this.eventCallList}>
      				<input type="text" placeholder="미니샵 검색하기"
								name="search_shop"
								value={this.state.search_shop}
								onChange={this.eventHandleInput}
							/><button type="submit" className="icon-search"></button>
      			</form>
      		</div>
      		<div className="area_list">
      			<ul ref="shopLists">
							{this._shopList()}
      			</ul>
      		</div>
      		{this._paging()}
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
	}
}

LoginAdmin = connect(mapStateToProps, mapDispatchToProps)(LoginAdmin);

export default LoginAdmin;
