import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps, changeInput, blurInput  } from '../actions'
import TermsSeller from '../components/TermsSeller'
import LayerSellerTerms from '../components/LayerSellerTerms'
import OptionData from '../../utils/OptionData'


class SellApply extends Component{


	componentWillMount(){


		this.props.setProps({

			validStatus:Object.assign({}, this.props.data.validStatus, {attachFile:0}) // 파일 업로드 완료 체크
		})

		// sell 페이지 안거치고 온 경우 sell로 redirect
    if(this.props.data.seller.successLogin!==1){ // sell 에서 로그인에 실패한경우
      //browserHistory.replace('/sell');
    }


		if(window.UserName && window.UserId && window.UserMobile
			&& window.UserName!=='' && window.UserId!=='' && window.UserMobile!==''){		// 이미 로그인 된 상태
			this.props.setProps({
				userId:window.UserId,
				userName:window.UserName,
				userMobile:window.UserMobile,
			})
		}
	}


  _bizType = (type) => {
    switch (type) {
      case '0':
        return '개인사업자';
      case '1':
        return '영리법인';
      case '2':
        return '비영리법인';
      case '3':
        return '공식단체';
      default:
        return '-';
    }
  }


	eventHandleChange = (e) => {


		const {data} = this.props;
		const _value = e.target.value;
		const _name = e.target.name;
		const obj_validStatus = {};
		const obj_formData = {};

		obj_formData[_name] = _value;

		if(data.formData.msFax_0===''){
			this.props.setProps({
				formData:Object.assign({}, data.formData, obj_formData)
			})
			return;
		}


			this.props.setProps({
				formData: Object.assign({},data.formData, obj_formData),
				validStatus:Object.assign({}, data.validStatus, obj_validStatus),
			})

}


	  _formValid = () => {
	    const {data} = this.props;
	    let checkCnt = 0;
	    let newObj = {};

	    let collectError = {
	        element:[]
	      }

	   if(data.validStatus.attachFile===1){
        newObj['attachFile'] = 1;
		     checkCnt +=1
		 }else{
	      newObj['attachFile'] = 0;
	    }

	 if(data.sellerTermAgree0){
				 newObj['terms'] = 0;

			}else{
			    if(!data.sellerTermAgree1 || !data.sellerTermAgree2 || !data.sellerTermAgree3 ){		//필수 약관만 확인
			      checkCnt +=1;
			      newObj['terms'] = 1;
			    }else{
			      newObj['terms'] = 0;
			    }
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
	//console.log(checkCnt)
	    if(checkCnt>0) return false;
	    return true;


	  }




	  _submit = (e) => {
	    const {data} = this.props;
	  if(!this._formValid()) return;

let rsdata ={

	// 판매회원
	msName : data.formData.msName,
	msUrl: data.formData.msUrl,
	msFax_0:data.formData.msFax_0,
	msFax_1:data.formData.msFax_1,
	msFax_2: data.formData.msFax_2,
	msNetwork_0: data.formData.msNetwork_0,
	msNetwork_1:	data.formData.msNetwork_1,
	msNetwork_2: data.formData.msNetwork_2,

	successLogin:data.seller.successLogin,     // 단체회원 로그인 0: 정보입력 1: 로그인 성공  2: 로그인 실패
	UserGroupId :data.seller.UserGroupId,
	MainUserId:data.seller.MainUserId ,  //담당자 id (개인 아이디)
	MainUserName:data.seller.MainUserName ,     //담당자 id  ( 개인 이름)
	groupCompanyName:data.seller.groupCompanyName ,      //상호(단체명)
	groupePresentName:data.seller.groupePresentName ,       // 대표자
	lawNumber:data.seller.lawNumber ,       // 법인등록번호
	companyNumber:data.seller.companyNumber,       // 사업자등록번호
	uniqueNumber:data.seller.uniqueNumber ,              //    고유번호
	mainCompanyTelNumber:data.seller.mainCompanyTelNumber,     // 대표 전화 번호
	bizType:data.seller.bizType,     // 대표 전화 번호

}


console.log(rsdata);

browserHistory.replace('/sell/complete');


	  }   // submit end


	render(){
		    const {data, changeInput} = this.props;
		return(

  <div id="container">
			<button type="button"
							style={{
								position:'fixed',
								right:'10px',
								top:'40px',
								padding:'5px',
								background:'black',
								color:'pink',
								letterSpacing:0,
							}}
							onClick={(e)=>{
								console.log(this.props.data)
							}}
						>
							view props
						</button>

		<section className="section-sellermember">
			<article className="section-sellermember_reg">
				<h2 className="tit-h2">행복쇼핑 판매회원 신청</h2>
				<p className="dsc">
					<strong><span>단체회원 정보 확인 후 판매회원을 신청</span>해 주세요.<br />신청 후 가입 완료까지 심사 대기시간이 있습니다.</strong>
				</p>

				<div className="section-sellermember_reg_info">
					<form>
						<fieldset>
							<legend><span>판매회원 신청 내용</span></legend>
							<div className="member_basic">
								<h3 className="tit-h3">단체회원 기본정보</h3>
								<div className="box-board_thin">
									<table className="board">
										<caption><span>기본정보</span></caption>
										<colgroup>
											<col  />
											<col />
										</colgroup>
										<tbody>
										<tr>
											<th scope="row"><span>단체 아이디</span></th>
											<td>
												<div className="box-td">{data.seller.UserGroupId}</div>
											</td>
										</tr>
										<tr>
											<th scope="row"><span>담당자ID (이름)</span></th>
											<td>
												<div className="box-td">
													{data.seller.MainUserId}({data.seller.MainUserName})
												</div>
											</td>
										</tr>
										<tr>
											<th scope="row"><span>상호</span></th>
											<td>
												<div className="box-td">
													{data.seller.groupCompanyName}
												</div>
											</td>
										</tr>
										<tr>
											<th scope="row"><span>대표자명</span></th>
											<td>
												<div className="box-td">
												{data.seller.groupePresentName}
												</div>
											</td>
										</tr>

										{
											data.bizType!=="3"?
											<tr>
												<th scope="row"><span>사업자등록번호</span></th>
												<td>
													<div className="box-td">
														{data.seller.companyNumber}
													</div>
												</td>
											</tr>: null
                    }


										<tr>
											<th scope="row"><span>대표 전화번호</span></th>
											<td>
												<div className="box-td">
										{data.seller.mainCompanyTelNumber}
												</div>
											</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>


							<div className="member_doc">
								<h3 className="tit-h3">가입증빙 서류 <span>(필수)</span></h3>
								<p className="member_doc_dsc">
									판매자 회원 가입 시 보내야 할 증빙서류는(개인사업자)<br /><strong>사업자등록본 사본, 통신판매업 신고증 사본, 대표자 또는 사업자 명의 통장 사본</strong><br />입니다.
								</p>

								<div className="member_doc_upload">
									<span className="btn_file_upload">
										<input type="file"  title="첨부파일 찾아보기" />
									</span>

									<ul className="member_doc_upload_list">
										<li>
											<span>osh0720.jpg</span>
											<button type="button" className="btn_file_del">삭제</button>
										</li>
										<li>
											<span>osh0720.jpg</span>
											<button type="button" className="btn_file_del">삭제</button>
										</li>
										<li>
											<span>osh0720.jpg</span>
											<button type="button" className="btn_file_del">삭제</button>
										</li>
									</ul>

									<p className="member_doc_upload_noti">ㆍjpg, png, gif , pdf만 업로드 가능합니다.</p>
										  {
												data.validStatus.attachFile === 1?
												<span className="alert-msg fail"> 첨부파일을 업로드 해주시기 바랍니다. </span> : null
											}
								</div>
							</div>


             <TermsSeller/>

							<div className="member_optioninfo">
								<h3 className="tit-h3">단체회원 추가정보 입력 <span>(선택)</span></h3>
								<input type="text" placeholder="미니샵 이름을 입력해 주세요." title="미니샵 이름" className="istyle minishopname"
								  id="msName"
									name="msName"
									value={data.formData.msName}
								  onChange={changeInput}
		             />


								<div className="member_optioninfo_url">
									<span>https://minishop.pping.kr/</span>
									<input type="text" placeholder="예) happyshopping" title="url" className="istyle minishopurl"  maxLength="20"
									id="msUrl"
									name="msUrl"
									value={data.formData.msUrl}
								  onChange={changeInput}

									/>
								</div>
								<div className="member_optioninfo_fax">
									<label htmlFor="id-fax">팩스번호</label>
										<OptionData
													mode="tell"
													className="sstyle"
													defaultValue={data.formData.msFax_0}
													name="msFax_0"
													onChange={this.changeInput}
												/>
									<em className="dash"></em>
									<input type="text" title="중간번호" className="istyle num"  maxLength="4"
									id="msFax_1"
									name="msFax_1"
									value={data.formData.msFax_1}
									onChange={changeInput}
									 />
									<em className="dash"></em>
									<input type="text" title="끝번호" className="istyle num"  maxLength="4"
									id="msFax_2"
									name="msFax_2"
									value={data.formData.msFax_2}
									onChange={changeInput}


									 />
								</div>

								<div className="member_optioninfo_number">
									<label htmlFor="id-number">통신판매업 번호</label>
									<span>제</span>

									<input type="text" className="istyle num" style={{width:'64px'}} maxLength="4"
									id="msNetwork_0"
									name="msNetwork_0"
									value={data.formData.msNetwork_0}
									onChange={changeInput}
									/>

									<em className="dash"></em>
									<input type="text" title="중간번호" className="istyle num"style={{width:'72px'}} maxLength="5"
									id="msNetwork_1"
									name="msNetwork_1"
									value={data.formData.msNetwork_1}
									onChange={changeInput}
									/>

									<em className="dash"></em>
									<input type="text" title="끝번호" className="istyle num"style={{width:'72px'}} maxLength="6"
									id="msNetwork_2"
									name="msNetwork_2"
									value={data.formData.msNetwork_2}
									onChange={changeInput}/>

									<span>호</span>
								</div>

								<div className="member_optioninfo_noti">
									<p>
										전자상거래 등에서의 소비자보호에 관한 법률에 따라 통신판매를 하는
										일정 규모 이상의 사업자는 통신판매업 신고의무가 있습니다.
									</p>
									<p>
										통신판매업 신고대상임에도 신고를 하지 아니하거나 거짓으로 신고한 자는 관련
										법령에 따라 9천만원 이하의 벌금에 처해질 수 있으며, 공정거래위원회로부터
										시정조치, 영업정지 등의 행정처분을 받을 수 있습니다.

									</p>
									<p>
										<strong>미니샵 판매회원이 되려면 <span>‘통신판매법신고증’</span>을 반드시 제출하여야 합니다.</strong>
									</p>
								</div>
							</div>


							<input type="button" value={"판매회원 신청하기"}  onClick={this._submit} className="btn_seller_apply_submit" />
						</fieldset>
					</form>
				</div>
			</article>
		</section>

		{
			data.viewTermLayer?
			<LayerSellerTerms
				viewTermId={this.props.data.viewTermId}
				setProps={this.props.setProps.bind(this)}
			/>
			: null
		}

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
    blurInput : (v) => dispatch(blurInput(v)),

	}
}

 SellApply = connect(mapStateToProps,mapDispatchToProps)(SellApply);

export default SellApply;
