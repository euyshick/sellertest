import React, {Component} from 'react'
import { Link } from 'react-router'

//import BannerLogin from '../components/BannerLogin'

export default class Join extends Component{



	constructor(props){
		super(props);
		this.snsAlert = this.snsAlert.bind(this);

	}
	snsAlert = () =>{
	window.alert(" 준비중 입니다.")
	}

	render(){
		return(
			<div className="container">
				<div className="content_wrap">
					{/*<BannerLogin />*/}

					<div className="content_join login">
						<section className="login_wrap">
							<h1><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_2.png" alt="행복쇼핑" /></h1>

							<div className="text_guide">
								<strong>행복쇼핑 간편 회원가입</strong><br/>
								행복쇼핑의 회원으로 가입합니다.
							</div>
							<article className="btn_wrap">
								<Link to={"join/user"} className="btn_point">간편 회원가입</Link>
							</article>

							<div className="text_guide">
								<strong>행복쇼핑 단체 회원가입</strong><br/>
								단체회원은 행복쇼핑 개인 아이디가 있어야 가입 가능합니다.
							</div>
							<article className="btn_wrap">
								<Link to={"join/group1"} className="btn_point">단체 회원가입</Link>
							</article>

							<div className="text_guide"><strong>SNS 계정 회원가입</strong><br/>SNS 아이디를 이용해서 행복쇼핑 회원으로 가입합니다.</div>
							<article className="btn_wrap sns" onClick={this.snsAlert}>
								<button type="button" className="btn_naver"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_naver.png" alt="NAVER" /> 회원가입</button>
								<button type="button" className="btn_facebook"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_facebook.png" alt="facebook" /> 회원가입</button>
								<button type="button" className="btn_kakao"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_kakao.png" alt="kakao" /> 회원가입</button>
								<button type="button" className="btn_instagram"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/logo_instagram.png" alt="instagram" /> 회원가입</button>
							</article>

							<ul className="links_wrap">
								<li><Link to={"/"}>로그인</Link></li>
								<li><Link to={"identify"}>아이디 찾기</Link></li>
								<li><Link to={"identify?f=1"}>비밀번호 찾기</Link></li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		);
	}
}
