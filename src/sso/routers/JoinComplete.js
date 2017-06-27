import React, {Component} from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

class JoinComplete extends Component{
  componentWillMount(){
    // 비정상 접근시 redirect
    // if(!this.props.data.userId || this.props.data.userId===''){
    //   browserHistory.replace('/')
    // }
  }

	render(){
		return(
      <div className="container">
    		<div className="content_wrap">
    			<div className="content_complete">
    				<h2><strong>행복쇼핑 회원</strong>이 되어주셔서 감사합니다!</h2>
    				<p className="desc">
    					다양한 혜택과 정확한 정보로 언제나 고객님께 즐거움을 드리는 <br/>행복쇼핑으로 거듭나겠습니다.
    				</p>
    				<div className="box_info">
    					회원가입이 완료되었습니다.<br/>
    					<strong lang="en">{this.props.data.formData.userId}</strong>
    				</div>
    				{/*<div className="box_info">
    					네이버 계정이 인증되었습니다.<br/>
    					<strong>네이버 계정 <span lang="en">jampong@naver.com</span></strong>
    				</div>
    				<div className="box_info">
    					폐이스북 계정이 인증되었습니다.<br/>
    					<strong>폐이스북 계정 <span lang="en">jampong@naver.com</span></strong>
    				</div>
    				<div className="box_info">
    					카카오 계정이 인증되었습니다.<br/>
    					<strong>카카오 계정 <span lang="en">jampong@naver.com</span></strong>
    				</div>
    				<div className="box_info">
    					인스타그램 계정이 인증되었습니다.<br/>
    					<strong>인스타그램 계정 <span lang="en">jampong@naver.com</span></strong>
    				</div>*/}

    				{/*<div className="box_banner" style={{
              height:'240px',
              backgroundColor:'#eee',
            }}>
    					// 배너 공간
    				</div>*/}
    				<div className="btn_wrap">
    					<a href="//pping.kr" className="btn_default">쇼핑하기</a>
    					<Link to={'/'} className="btn_point">로그인하기</Link>
    				</div>
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

JoinComplete = connect(mapStateToProps)(JoinComplete);

export default JoinComplete;
