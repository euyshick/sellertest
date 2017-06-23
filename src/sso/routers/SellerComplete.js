import React, {Component} from 'react'
import { Link} from 'react-router'
import { connect } from 'react-redux'

class SellerComplete extends Component{

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
    					행복쇼핑 판매회원 신청이 완료되었습니다.<br/><br/>
              판매회원은 신청 후 가입 완료까지 심사 대기시간이 있습니다
    				</div>

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

SellerComplete = connect(mapStateToProps)(SellerComplete);

export default SellerComplete;
