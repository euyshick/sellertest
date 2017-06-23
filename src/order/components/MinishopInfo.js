import React, { Component } from 'react'
import { Link } from 'react-router'

import ReactHtmlParser from 'react-html-parser'

import Utils from '../../utils/Utils'

import LayerMinishop from './LayerMinishop'

export default class MinishopInfo extends Component{
  static defaultProps = {
    imgPath: '//img.happyshopping.kr',
  }
  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    idx_member: React.PropTypes.number.isRequired,
    idx_b_manager: React.PropTypes.number.isRequired,
    managerInfo: React.PropTypes.object.isRequired,
    reviews: React.PropTypes.array.isRequired,
    zzim_state: React.PropTypes.string.isRequired,
  }
  state = {
    displayMode: 0,   // 0: 회사 정보, 1: 리뷰
    zzim_state: this.props.zzim_state,
    minishopReturnDialogTab:0,    //반품 교환 안내 탭
  }
  constructor(props, context) {
    super(props);
  }
  _eventZzim = () => {
    let zzimState = 1;
    if(this.state.zzim_state === 'Y'){
      zzimState = 2;
    }

    Utils.request({
      url:this.props.apiUrl+'/zzim/'+this.props.idx_b_manager+'/'+this.props.idx_member,
      method:'post',
      body:{
        idx_b_manager: this.props.idx_b_manager,
        idx_member : this.props.idx_member,
        zzim_state : zzimState,
      }
    }).then(rsData=>{
      this.setState({
        zzim_state : zzimState===1? 'Y':'N',
      });
    })
  }

  _loadMinishopMap = () => {
    Utils.request({
      url:this.props.apiUrl+'/geocode',
      method:'post',
      body:{
        addr:this.props.managerInfo.addr
      }
    }).then(rsData=>{
      const lng = rsData.data.addressInfo.channel.item[0].lng;
      const lat = rsData.data.addressInfo.channel.item[0].lat;

      const mapContainer = document.getElementById('minishopMap');
      const mapOption = {
        center: new window.daum.maps.LatLng(lat,lng),
        level: 3
      };
      const map = new window.daum.maps.Map(mapContainer, mapOption);
      const marker = new window.daum.maps.Marker({
        position:map.getCenter()
      });
      marker.setMap(map);

      const tooltipContext = '<div class="layer-tooltip-map">'
        +'<strong>'+this.props.managerInfo.addr_1+'</strong><br>'
        +'<span>'+this.props.managerInfo.addr_2+'</span>'
        +'</div>';
      new window.daum.maps.CustomOverlay({
        map:map,
        position: marker.getPosition(),
        content: tooltipContext,
      });
    })
  }

  _openDeclarePopup = () => {
    const url = "//minishop.pping.kr/partner/popup/accuse?pr_idx="+this.props.managerInfo.idx_b_manager;
    window.open(url, 'minishopMap','resizable=no,status=no,width=657,height=765', false)
  }

  _openEscrowPopup = (id_p,firm_num) => {
    const url = "https://pg.nicepay.co.kr/issue/IssueEscrow.jsp?Mid="+id_p+"&CoNo="+firm_num;
    window.open(url, 'escrowCheck','resizable=no,status=no,width=450,height=400', false);
    return false;
  }

  _escrowCheckPopup = (e) => {
    e.preventDefault();
    const url = e.target.href;
    window.open(url, 'escrowCheck','resizable=no,status=no,width=450,height=400', false);
  }

  render(){
    const data = this.props.managerInfo;
    const dataReviews = this.props.reviews;

    let sellerClassName = 'seller-info';
    if( data.f_auth_seller === 1){
      sellerClassName = 'seller-info newseller';
    } else if(data.f_auth_seller === 2){
      sellerClassName = 'seller-info powerseller';
    }

    const _reviewLists = () => {
      if(dataReviews.length>0){
        return dataReviews.map((d,index)=>{
          if(index>3) return false;
          const subjectString = d.subject.length>20? d.subject.substring(0,18)+'...' : d.subject;
          return(
            <li key={index}>
              <Link to={'http://talk.pping.kr/creviews/r/'+d.id_thread} target="_blank">{subjectString}
                <span className="date">{d.date_reg}</span>
              </Link>
            </li>
          )
        });
      } else {
        return(<li>등록된 리뷰가 없습니다</li>);
      }
    }

    return(
      <article className="order-body_row">
      	<h3 className="tit-h3">판매자 정보</h3>
      	<div className={sellerClassName}>
      		<div className="seller-info_name">
            {
              data.f_auth_seller===1?
              <span className="mark-new">뉴셀러</span> : null
            }
            {
              data.f_auth_seller===2?
              <span className="mark-power">파워셀러</span> : null
            }
      			<strong className="name">{data.mall_name}</strong>
      			<ul>
      				<li><Link to={'http://minishop.pping.kr/'+data.mall_web_user} target="_blank" className="btn-minishop"><i className="icon-shop"></i>미니샵</Link></li>
      				<li><button type="button" className="btn-fork"
                  onClick={this._eventZzim}
                ><i className={this.state.zzim_state==='Y'?'icon-favorite':'icon-favorite_border'}></i>찜하기</button></li>
              {
                this.state.displayMode !== 1?
                <li><button type="button" className="btn-report"
                  onClick={(e)=>{ this.setState({displayMode:1}) }}><i className="icon-typing"></i>후기</button></li>
                :
        				<li><button type="button" className="btn-info"
                  onClick={(e)=>{ this.setState({displayMode:0}) }}><i className="icon-text3"></i>정보</button></li>
              }
      			</ul>
      		</div>
      		<span className="seller-info_logo">
      			<Link to={'http://minishop.pping.kr/'+data.mall_web_user} target="_blank"><img src={this.props.imgPath+"/img_static/img_logo/"+data.idx_b_manager+"_80_35.png"} width="80" height="35" alt={data.mall_name}/></Link>
      		</span>

          { this.state.displayMode !== 1?
        		<div className="seller-info_detail">
        			<span className="nor">{data.f_type_name}</span>
        			{data.is_usafe===1? <span className="warranty">전자보증</span> : null}
        			{data.is_escrow===1? <span className="escrow">에스크로</span> : null}
        			<span className="tel">{data.tel_1}</span>
        			<button type="button" className="btn-tel-detail" onMouseDown={()=>this.refs.minishopContactDialog.show()}>연락처 상세보기<i className="icon-triangle-right"></i></button>

        			<address>
        				{data.addr}
        				&nbsp;
                <button type="button" className="btn-map-detail" onMouseDown={()=>this.refs.minishopMapDialog.show()}>약도보기</button>
        			</address>

        			<p className="seller-info_detail_corp">사업자등록번호:{data.firm_num} | 대표자:{data.head_name} | 통신판매신고번호:{data.firm_num_online}</p>

        			<div className="seller-info_detail_info">
        				<span className="name">{data.name_b?data.name_b:data.mall_name}</span>
        				<button type="button" className="btn-corp-intro" onMouseDown={()=>this.refs.minishopInfoDialog.show()}>회사소개</button>
        				<button type="button" className="btn-corp-time" onMouseDown={()=>this.refs.minishopWorkingDialog.show()}>영업시간</button>
        				<button type="button" className="btn-corp-return" onMouseDown={()=>this.refs.minishopReturnDialog.show()}>반품/교환</button>
        				<button type="button" className="btn-corp-accuse" onMouseDown={()=>this.refs.minishopDeclareDialog.show()}>신고</button>
        			</div>
        		</div>
            :
        		<div className="seller-info_report">
        			<h4 className="tit-h4"> 미니샵 이용 후기</h4>
        			<ul>
                {
                  dataReviews.length>0?
          				<li>
          					<Link to={'http://talk.pping.kr/creviews/r/'+dataReviews[0].id_thread} target="_blank">
          						<span className="photo">
                        {
                          dataReviews[0].imagePath?
                          <img src={this.props.imgPath+dataReviews[0].imagePath} alt=""/>
                          :
                          <img src={this.props.imgPath+"/img_static/img_pres/_v3/noimage_review.png"} alt="이미지없음"/>
                        }
                      </span>
          						<div className="conts">
          							<span className="t">{dataReviews[0].subject}</span>
          							<p>{ReactHtmlParser(Utils.decodeHTMLEntities(dataReviews[0].message))}</p>
          							<div className="conts_bot">
          								<span className="writer">{dataReviews[0].nickname}</span> <em className="bar">|</em> <span className="date">{dataReviews[0].date_reg}</span> <span className="btn-more"> 자세히보기</span>
          							</div>
          						</div>
          					</Link>
          				</li>
                  :
                  <li>-</li>
                }
        				{_reviewLists()}
        			</ul>

        			<Link to={"http://talk.pping.kr/creviews/index/"+this.props.idx_b_manager} target="_blank" className="btn-report-more"><em>+</em> 더보기</Link>
        		</div>
          }

      		<div className="seller-info_descwarranty">
          {
            data.f_safe === 2?
      			<dl>
      				<dt>전자보증 서비스</dt>
      				<dd><strong>소비자에게 보험증서를 발급</strong>하여,<br/>인터넷 쇼핑몰에서 발생할 수 있는<br/>소비자 피해를 공인된 금융 기관인<br/><strong>서울보증보험(주)이 100% 보상</strong>하는<br/>서비스입니다.</dd>
      				<dd>
      					<span className="protect protect1"><em className="ir">SGI 서울보증</em></span>
      					<a href={"https://mall.sgic.co.kr/csh/iutf/sh/shop/CSHINFO004VM0.mvc?q_cp=1&q_sk=2&q_sv="+data.firm_num+"#_searchArea"} target="_blank">서비스가입사실확인</a>
      				</dd>
      			</dl>
            : null
          }
          {
            data.f_safe === 1?
      			<dl>
      				<dt>에스크로 서비스</dt>
      				<dd><strong>제3자(공식 에스크로 사업자)가<br/>전자상거래대금의 입출금을 공정하게<br/>관리</strong>하여, <strong>매매보호 및 안전거래를<br/>구현</strong>하는 서비스입니다.</dd>
      				<dd>
      					<span className="protect protect2"><em className="ir">NICE</em></span>
      					<a href={'https://pg.nicepay.co.kr/issue/IssueEscrow.jsp?Mid='+data.id_p+'&CoNo='+data.firm_num} onClick={this._escrowCheckPopup}>서비스가입사실확인</a>
      				</dd>
      			</dl>
            : null
          }
          {
            data.f_safe === 3?
      			<dl>
      				<dt>전자보증 + 에스크로 서비스</dt>
      				<dd>두가지 매매보호 방식이 모두 적용되는<br/>방법으로,쇼핑에 불편이 없도록 구현된<br/><strong>가장 최적화된 서비스</strong>입니다.</dd>
      				<dd>
      					<span className="protect protect1"><em className="ir">SGI 서울보증</em></span>
      					<a href={"https://mall.sgic.co.kr/csh/iutf/sh/shop/CSHINFO004VM0.mvc?q_cp=1&q_sk=2&q_sv="+data.firm_num+"#_searchArea"} target="_blank">서비스가입사실확인</a>
      				</dd>
      				<dd>
      					<span className="protect protect2"><em className="ir">NICE</em></span>
      					<a href={'https://pg.nicepay.co.kr/issue/IssueEscrow.jsp?Mid='+data.id_p+'&CoNo='+data.firm_num} onClick={this._escrowCheckPopup}>서비스가입사실확인</a>
      				</dd>
      			</dl>
            : null
          }
      		</div>
      	</div>

      	<p className="seller-info-noti">개별 판매자가 등록한 마켓플레이스(오픈마켓) 상품에 대한 광고, 상품주문, 배송 및 환불의 의무와 책임은 각 판매자가 부담하고 이에 대하여<br/><strong>행복쇼핑은 통신판매중개자로서 통신판매의 당사자가 아니므로 일체 책임을 지지 않습니다.</strong></p>

        <LayerMinishop
          ref="minishopInfoDialog"
          title="회사소개"
          className="pop-intro"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
        >
          <div className="intro">
            {ReactHtmlParser( Utils.decodeHTMLEntities(data.introduction) )}
          </div>
        </LayerMinishop>

        <LayerMinishop
          ref="minishopWorkingDialog"
          title="미니샵 영업시간"
          className="pop-opening"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
        >
          <div className="box-board">
            <table className="board thead-lft">
              <caption><span>영업안내</span></caption>
              <colgroup>
                <col style={{width:"110px"}} />
                <col />
              </colgroup>
              <tbody>
              <tr>
                <th scope="row"><span>영업시간</span></th>
                <td>
                  <div className="box-td">
                    {data.bhours_wday?data.bhours_wday:'-'}
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row"><span>휴무일</span></th>
                <td>
                  <div className="box-td">
                    {data.closing_schedules?data.closing_schedules:'-'}
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </LayerMinishop>

        <LayerMinishop
          ref="minishopReturnDialog"
          title="미니샵 반품/교환 안내"
          className="pop-return"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
        >
          <div>
            <p className="dsc">※ 반품/교환에 관한 일반적인 사항은 판매자 게시사항 보다 관계법령이 우선합니다.</p>

            <div className="box-board">
                <table className="board thead-lft">
                    <caption><span>반품 교환 가이드</span></caption>
                    <colgroup>
                        <col style={{width:'110px'}}/>
                        <col />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row"><span>판매 업체명</span></th>
                        <td>
                            <div className="box-td">
                                {data.mall_name}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><span>지정택배사</span></th>
                        <td>
                            <div className="box-td">
                                {data.name_deliv}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><span>반품배송비</span></th>
                        <td>
                            <div className="box-td">
                                {Utils.comma(data.cost_deliv)}원{/* 편도 2,500원 (최초 배송비 무료인 경우 5,000원 부과) */}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><span>보내실 곳</span></th>
                        <td>
                            <div className="box-td">
                                {data.addr}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="pop-return_noti">
              <button
                type="button"
                className={this.state.minishopReturnDialogTab===0?"btn-pop-return_noti1 active":"btn-pop-return_noti1"}
                onMouseDown={()=>this.setState({minishopReturnDialogTab:0})}>반품/교환 사유에 따른 요청 가능 기간</button>
              <button
                type="button"
                className={this.state.minishopReturnDialogTab===1?"btn-pop-return_noti2 active":"btn-pop-return_noti2"}
                onMouseDown={()=>this.setState({minishopReturnDialogTab:1})}>반품/교환 불가능 사유</button>

              {
                this.state.minishopReturnDialogTab===0?
                <div className="return_noti box-return_noti1">
                  <h6 className="ir">반품/교환 사유에 따른 요청 가능 기간</h6>
                  <p>※ 반품시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송지, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.</p>
                  <ol>
                    <li>구매자 단순 변심은 상품 수령 후 7일 이내 (구매자 반품배송비를 부담)</li>
                    <li>표시/광고와 상이, 상품하자의 경우 상품 수령 후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터 30일 이내 둘 중 하나 경과시 반품/교환 불가 (판매자 반품배송비를 부담)</li>
                  </ol>
                </div>
                :
                <div className="return_noti box-return_noti2">
                  <h6 className="ir">반품/교환 불가능 사유</h6>
                  <p>※ 아래와 같은 경우엔 반품/교환이 불가능합니다.</p>
                  <ol>
                    <li>반품/교환 요청 가능 기간이 지난 경우</li>
                    <li>구매자의 책임있는 사유로 상품 등이 멸실 또는 훼손된 경우(단, 상품의 내용을 확인하기 위해 포장 등을 훼손한 경우는 제외)</li>
                    <li>포장을 개봉하였으나 포장이 훼손되어 상품가치가 현저히 상실된 경우. (예: 식품,화장품,향수류,음반 등)</li>
                    <li>구매자의 사용 또는 일부 소비에 의해 상품가치가 현저히 상실된 경우(라벨이 떨어진 의류 또는 태그가 떨어진 명품관 상품인 경우)</li>
                    <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
                    <li>고객주문 확인 후 상품제작에 들어가는 주문제작상품</li>
                  </ol>
                </div>
              }
            </div>
          </div>
        </LayerMinishop>

        <LayerMinishop
          ref="minishopDeclareDialog"
          title="미니샵 신고센터"
          className="pop-declare"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
        >
          <div>
            <p className="dsc" style={{lineHeight:'initial'}}>행복쇼핑은 소비자의 보호와 사이트 안전거래를 위해 신고센터를 운영하고 있습니다.<br/>안전거래를 저해하는 경우 신고해 주시기 바랍니다.</p>

            <div className="button-group ctr" style={{margin:0}}>
              <button type="button" className="btn-pop-declare" onMouseDown={this._openDeclarePopup}>신고하기</button>
            </div>
          </div>
        </LayerMinishop>

        <LayerMinishop
          ref="minishopContactDialog"
          title="미니샵 연락처 상세보기"
          className="pop-contact"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
        >
          <div className="box-board">
            <table className="board thead-lft">
                <caption><span>연락처</span></caption>
                <colgroup>
                    <col style={{width:'18%'}}/>
                    <col style={{width:'32%'}}/>
                    <col style={{width:'18%'}}/>
                    <col />
                </colgroup>
                <tbody>
                <tr>
                    <th scope="row"><span>TEL</span></th>
                    <td>
                        <div className="box-td">
                          {data.tel_1}
                        </div>
                    </td>
                    <th scope="row"><span>FAX</span></th>
                    <td>
                        <div className="box-td">
                            {data.fax}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><span>상호</span></th>
                    <td>
                        <div className="box-td">
                            {data.name_b}
                        </div>
                    </td>
                    <th scope="row"><span>담당자</span></th>
                    <td>
                        <div className="box-td">
                            {data.head_name}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><span>URL</span></th>
                    <td colSpan="3">
                        <div className="box-td">
                            <a href={"http://minishop.pping.kr/"+data.mall_web_user} target="_blank">{'http://minishop.pping.kr/'+data.mall_web_user}</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><span>이메일</span></th>
                    <td colSpan="3">
                        <div className="box-td">
                            <a href={"mailto:"+data.mng_email}>{data.mng_email}</a>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
        </LayerMinishop>

        <LayerMinishop
          ref="minishopMapDialog"
          title="미니샵 약도보기"
          className="pop-map"
          mall_name={data.mall_name}
          f_auth_seller={data.f_auth_seller}
          beforeOpen={this._loadMinishopMap}
        >
          <div>
            <p className="address">주소:{data.addr}</p>
            <div className="map" id="minishopMap"></div>
          </div>
        </LayerMinishop>
      </article>
    );
  }
}
