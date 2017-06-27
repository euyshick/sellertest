import React from 'react'
import { Link } from 'react-router'

import '../css/footer.css'

export default class Footer extends React.Component{
  state = {
    viewLayer_ARS:false,
  }

  render(){
    return(
      <footer id="footer">
      	<div className="footer-body">
          <a href="#wrap" className="btn-top-scroll">TOP</a>

      		<ul className="footer-body_lnb">
      			<li><Link to={"http://www.pping.co"} target="_blank">회사소개</Link></li>
      			<li><Link to={"http://www.pping.co/recruit/apply"} target="_blank">인재채용</Link></li>
      			<li><Link to={"http://help.minishop.pping.kr/main/faq_write/?cat=14"} target="_blank">입점제휴문의</Link></li>
      			<li><Link to={"//pping.kr/policy"} target="_blank">이용약관</Link></li>
      			<li><Link to={"//pping.kr/privacypolicy"} target="_blank">개인정보취급방침</Link></li>
      			<li><Link to={"//pping.kr/youthpolicy"} target="_blank">청소년 보호 정책</Link></li>
      			<li><Link to={"//pping.kr/notice"} target="_blank">법적고지</Link></li>
      		</ul>

      		<div className="footer-body_conts">
      			<span className="footer-body_conts_logo"><em className="ir">행복쇼핑</em></span>
      			<div className="footer-body_conts_info">
      				<ul>
      					<li>행복쇼핑 주식회사 <span className="bar">대표이사 : 강공승</span> <span className="bar">개인정보관리책임자 : 오국환(<Link to={"mailto:sadcafe@pping.kr"} className="email" lang="en">sadcafe@pping.kr</Link>)</span></li>
      					<li>사업자 등록번호 : <span lang="en">105-87-89183 </span><span className="bar">통신판매업신고번호 : 제 2015-서울용산-00997 호</span> <Link to={"http://www.ftc.go.kr/info/bizinfo/communicationView.jsp?apv_perm_no=2015302015030200996&area1=&area2=&currpage=1&searchKey=01&searchVal=%C7%E0%BA%B9%BC%EE%C7%CE%20%C1%D6%BD%C4%C8%B8%BB%E7&stdate=&enddate="} target="_blank" className="btn-corp-confirm">사업자정보확인</Link></li>
      				</ul>
      				<address>주소 : 04373 서울시 용산구 청파로 46, 7층(한강로3가, 한통빌딩) <span className="bar">팩스 : <span lang="en">0505-300-4602</span></span></address>
      				<p className="copyright">Copyright &copy; HappyShopping Inc. All Right Reserved.</p>

              <div className="footer-body_conts_info_sns">
      					<ul>
      						<li><a href="http://blog.naver.com/happyshopping" title="행복쇼핑 블로그" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_blog.png" alt="행복쇼핑 블로그"/></a></li>
      						<li><a href="http://post.naver.com/happyshopping" title="행복쇼핑 네이버" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_naver.png" alt="행복쇼핑 네이버"/></a></li>
      						<li><a href="https://www.facebook.com/%ED%96%89%EB%B3%B5%EC%87%BC%ED%95%91-%EC%9D%B4%EB%B2%A4%ED%8A%B8-412433962424632/?fref=ts" title="행복쇼핑 페이스북" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_facebook.png" alt="행복쇼핑 페이스북"/></a></li>
      						<li><a href="https://www.instagram.com/pping.kr/" title="행복쇼핑 인스타그램" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_instagram.png" alt="행복쇼핑 인스타그램"/></a></li>
      						<li><a href="https://www.slideshare.net/happyshopping" title="행복쇼핑 슬라이드쉐어" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_slideshare.png" alt="행복쇼핑 슬라이드쉐어"/></a></li>
      					</ul>

      					<div className="footer-body_conts_info_sns_happytree">
      						<h3 className="tit-h3">해피트리 사업부</h3>
      						<ul>
      							<li><a href="http://blog.naver.com/happyshopping" title="해피트리 블로그 새창열기" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_blog.png" alt="해피트리 블로그"/></a></li>
      							<li><a href="https://www.facebook.com/%ED%95%B4%ED%94%BC%ED%8A%B8%EB%A6%AC-1640141842958558/" title="해피트리 페이스북 새창열기" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_facebook.png" alt="해피트리 페이스북"/></a></li>
      							<li><a href="https://www.slideshare.net/happytreeio" title="해피트리 슬라이드쉐어 새창열기" target="_blank"><img src="//img.happyshopping.kr/img_static/img_pres/_v3/icon_slideshare.png" alt="해피트리 슬라이드쉐어"/></a></li>
      						</ul>
      					</div>
      				</div>
      			</div>

            <div className="footer-body_conts_service">
            	<div className="question-helpservice">
            		<h3 className="tit-h3"><span>1:1 문의를 이용하시면</span><br/>신속한 상담이 가능합니다!</h3>
            		<a href="//help.minishop.pping.kr/main/faq_write" target="_blank" className="btn-q">1:1 문의하기</a>
            		<div className="question-helpservice_callnumber">
            			<strong className="callnumber">1600-4602</strong>
            			<div className="ars">
            				<a href="http://help.minishop.pping.kr/main/faq_write" target="_blank" className="btn-ars">전화전 클릭</a>
            				<button type="button" className="btn-ars-guide" onMouseDown={()=>{this.setState({viewLayer_ARS:true})}}>
            					<em>ARS</em>안내<img src="//img.happyshopping.kr/img_static/img_pres/_v3/ico_question.png" alt="안내 보기"/>
            				</button>

            				<div className={this.state.viewLayer_ARS?"layer-pop-ars":"layer-pop-ars blind"}>
            					<div className="pop-ars_body">
            						<div className="pop-ars_body_guide">
            							행복쇼핑 <strong>ARS(1600-4602)</strong> 안내
            							<p>유선 상담이 몰리는 경우 상담직원 연결이 늦을 수 있습니다.<br/><strong>행복쇼핑 고객센터 게시판을 통해 문의하시면<br/>좀 더 빠른 상담이 가능합니다.</strong></p>

            							<div className="button-group ctr">
            								<a href="http://help.minishop.pping.kr/" target="_blank">고객센터 게시판 바로가기 <i className="icon-chevron-right"></i></a>
            							</div>
            						</div>
            						<div className="pop-ars_body_number">
            							<table className="board">
            								<caption><span>행복쇼핑 ARS 안내</span></caption>
            								<colgroup>
            									<col style={{width:'80px'}} />
            									<col />
            								</colgroup>
            								<thead>
            								<tr>
            									<th scope="col">ARS번호</th>
            									<th scope="col">내용</th>
            								</tr>
            								</thead>
            								<tbody>
            								<tr>
            									<td><span className="number">1</span></td>
            									<td>
            										<div className="box-td">상품 주문, 입금 확인 및 배송</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">2</span></td>
            									<td>
            										<div className="box-td">현금 영수증 및 세금계산서</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">3</span></td>
            									<td>
            										<div className="box-td">협력사/미니샵 입점·운영 및 광고 문의</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">4</span></td>
            									<td>
            										<div className="box-td">홍보·마케팅·제휴, 표준PC, 이벤트·기획전, 콘텐츠(기사) 및 미디엄 문의</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">5</span></td>
            									<td>
            										<div className="box-td">e브로셔·모바일 상품정보·상세페이지 등 디자인 전문 서비스, 해피트리</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">6</span></td>
            									<td>
            										<div className="box-td">상품 등록, 상품 정보/이미지 오류 신고 등 상품 등록 정보 문의</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">7</span></td>
            									<td>
            										<div className="box-td">기업부설연구소 및 기술 문의</div>
            									</td>
            								</tr>
            								<tr>
            									<td><span className="number">0</span></td>
            									<td>
            										<div className="box-td">고객센터</div>
            									</td>
            								</tr>
            								</tbody>
            							</table>
            						</div>
            					</div>

            					<button type="button" className="btn-layer-pop_clse" onClick={()=>{this.setState({viewLayer_ARS:false})}}><span className="ir">닫기</span></button>
            				</div>
            			</div>
            		</div>
            	</div>
            </div>

      		</div>

      		<div className="footer-body_aside">
      			<dl className="sgi">
      				<dt>소비자피해보상보험 <span><em className="ir">SGI 서울보증</em></span></dt>
      				<dd>
      					고객님은 안전거래를 위해 현금 결제시 저희 쇼핑몰이<br/>가입한 <strong>소비자피해보상보험</strong>서비스를 이용하실 수 있습니다.<br/>보상대상 : <span>미배송/반품,환불 거부/쇼핑몰 부도</span><br/>
      					<Link to={"http://minishop.pping.kr/partner"} target="_blank" className="btn">서비스 가입사실 확인하기 <i className="icon-angle-right"></i></Link>
      				</dd>
      			</dl>

      			<dl className="escrow">
      				<dt>나이스페이 에스크로</dt>
      				<dd>고객님이 현금 결제한 금액에 대해 소비자피해보상보험 또는 에스크로를 통하여 안전거래를<br/>보장하고 있습니다. 행복쇼핑은 통신판매중개자로서 통신판매의 당사자가 아니며,<br/><strong>상품의 주문, 배송 및 환불의 의무와 책임은 각 판매업체에 있습니다.</strong></dd>
      			</dl>
      		</div>
      	</div>
      </footer>
    );
  }
}
