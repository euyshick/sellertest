import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps } from '../actions'

class TermsSeller extends Component{
	constructor(props){
		super(props)
		this.eventHandleCheckbox = this.eventHandleCheckbox.bind(this)
		this.eventHandleClick = this.eventHandleClick.bind(this)
		this.resetCheck= this.resetCheck.bind(this)
	}

    resetCheck =()=>{ // 회원가입 알럿 설정
	 		const {data} = this.props;

			if(data.sellerTermAgree0){
				this.props.setProps({
					terms:'',
					validStatus:Object.assign({},data.validStatus, {terms:0}), // 노티 알럿 설정
				});

			}else{
				if(data.sellerTermAgree1 && data.sellerTermAgree2 && data.sellerTermAgree3){
					this.props.setProps({
						terms:'',
						validStatus:Object.assign({},data.validStatus, {terms:0}), // 노티 알럿 설정
					});
				 }
			 }
     }
	eventHandleCheckbox = (e) => {
		const newObj = {}
		newObj[e.target.name] = e.target.checked
		this.props.setProps(newObj)


	}

	eventHandleClick = (e) => {
		this.props.setProps({
			viewTermLayer : true,
			viewTermId : e.target.value,
		})
	}

	render(){
		const {data} = this.props;

    return(

	<div>
      <div className="member_terms">
          <span className="icheck">
              <input type="checkbox" id="id-allcheck" name="sellerTermAgree0"
               checked={data.sellerTermAgree0}
							 onChange={this.eventHandleCheckbox}
							  onBlur={this.resetCheck}
               />
              <label htmlFor="id-allcheck"><em>전체동의</em></label>
            </span>
            <ul>
              <li>
                <span className="icheck">
                  <input type="checkbox" id="id-term1" name="sellerTermAgree1"
                    checked={data.sellerTermAgree1}
                    onChange={this.eventHandleCheckbox}
                    onBlur={this.resetCheck}
                   />
                  <label htmlFor="id-term1"><em>판매이용약관 (필수)</em></label>
                </span>

                <button type="button" className="btn_terms_view" value="d1" onClick={this.eventHandleClick}>내용보기</button>
              </li>
              <li>
                <span className="icheck">
                  <input type="checkbox" id="id-term2" name="sellerTermAgree2"
                  checked={data.sellerTermAgree2}
                  onChange={this.eventHandleCheckbox}
                  onBlur={this.resetCheck}
                   />
                  <label htmlFor="id-term2"><em>전자금융거래 이용약관 (필수)</em></label>
                </span>

                <button type="button" className="btn_terms_view" value="d2" onClick={this.eventHandleClick}>내용보기</button>
              </li>
              <li>
                <span className="icheck">
                  <input type="checkbox" id="id-term3" name="sellerTermAgree3"
                  checked={data.sellerTermAgree3}
                  onChange={this.eventHandleCheckbox}
                  onBlur={this.resetCheck}
                   />
                  <label htmlFor="id-term3"><em>개인정보 수집 및 이용 (필수)</em></label>
                </span>

                <button type="button" className="btn_terms_view"  value="d3" onClick={this.eventHandleClick}>내용보기</button>
              </li>
              <li>
                <span className="icheck">
                  <input type="checkbox" id="id-term4" name="sellerTermAgree4"
                  checked={data.sellerTermAgree4}
                  onChange={this.eventHandleCheckbox}
                  onBlur={this.resetCheck}
                   />
                  <label htmlFor="id-term4"><em>행복쇼핑 ECO플랫폼 이용약관 (선택)</em></label>
                </span>

                <button type="button" className="btn_terms_view" value="a1" onClick={this.eventHandleClick}>내용보기</button>
              </li>
              <li>
                <span className="icheck">
                  <input type="checkbox" id="id-term5" name="sellerTermAgree5"
                  checked={data.sellerTermAgree5}
                  onChange={this.eventHandleCheckbox}
                  onBlur={this.resetCheck}
                   />
                  <label htmlFor="id-term5"><em>행복쇼핑 ECO플랫폼 개인정보 수집 및 이용 (선택)</em></label>
                </span>

                <button type="button" className="btn_terms_view" value="a2" onClick={this.eventHandleClick}>내용보기</button>
              </li>
            </ul>
      </div>
			{
				data.validStatus.terms!==0?
				<span className="alert-msg fail">{data.validMsg['terms'][data.validStatus.terms]}</span> : null
			}
	</div>
    )
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
TermsSeller = connect(mapStateToProps, mapDispatchToProps)(TermsSeller);

export default TermsSeller;
