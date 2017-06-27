import React, {Component} from 'react'
import { connect } from 'react-redux'

import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps } from '../actions'
import BannerLogin from '../components/BannerLogin'
import LoginDefault from '../components/LoginDefault'
import LoginAdmin from '../components/LoginAdmin'

class Login extends Component{
	componentWillMount(){
		// admin 여부 판단
		const callback = (rsData) => {
			if(rsData.code === 200){
				this.props.setProps({
					isAdminLogin:true,
				});

		//console.log('로그인 성공')

				return;
			} else {
				//console.log('로그인 실패 홈으로 이동')
				window.location.href="//www.pping.kr"
			}
		}
		if(window.UserName && window.UserId && window.UserMobile
			&& window.UserName!=='' && window.UserId!=='' && window.UserMobile!==''){		// 이미 로그인 된 상태
			this.props.setProps({
				userId:window.UserId,
				userName:window.UserName,
				userMobile:window.UserMobile,
			})
			const rqData = {
				user_idx:window.IDX_MEMBER,
				user_type:window.UserType,
			}
			request({
				url:this.props.data.apiUrl.shopList+jsonToQueryString(rqData),
			}).then(callback)
		}
	}

	render(){
		return(
			<div className="container">
				<div className="content_wrap">

					{
						!this.props.data.isAdminLogin?   <LoginDefault />: <LoginAdmin />
					}
        <BannerLogin/>
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

Login = connect(mapStateToProps,mapDispatchToProps)(Login);

export default Login;
