import React, {Component} from 'react'

export default class BannerLogin extends Component{
	state = {
		bannerOver: false,
	}

	render(){
		return(
			<div className="content_bnr">
						<div className="content_bnr_adv content_bnr_adv1">
							<div className="name"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/btn_happytree_login.png" alt="해피트리 런칭 이벤트"/></div>

							<div className="bnr-small">
								<img src="//img.happyshopping.kr/img_static/img_pres/_v3/img_login_happytree_event.png" alt="해피트리 런팅 이벤트 제작비 20%, 서비스 10+1, 페이백 10%"/>
							</div>

							<div className="bnr-big happytree-event">
								<a href="https://www.happytree.io/" target="_blank">
									<img src="//img.happyshopping.kr/img_static/img_pres/_v3/login_happytree_event.jpg" alt="해피트리 이벤트"/>
									<img src="//img.happyshopping.kr/img_static/img_pres/_v3/btn_happytree_event.png" alt="이벤트 바로가기" className="btn-e"/>
								</a>
							</div>
						</div>

						<div className="content_bnr_adv content_bnr_adv2 show">
							<div className="name"></div>

							<div className="bnr-small">
								<img src="//img.happyshopping.kr/img_static/img_pres/_v3/img_login_msi_event.jpg" alt="너굴맨이 추천하니 안심하라구!"/>
							</div>

							<div className="bnr-big">
								<a href="https://shopping.pping.kr/1010600000/1163759" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/login_msi_event.jpg" alt="MSI 이벤트"/></a>
							</div>
						</div>
					</div>
		);
	}
}
