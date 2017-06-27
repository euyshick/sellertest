import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps } from '../actions'

class TermsAdult extends Component{
	constructor(props){
		super(props)
		this.eventHandleCheckbox = this.eventHandleCheckbox.bind(this)
		this.eventHandleClick = this.eventHandleClick.bind(this)
			this.resetCheck= this.resetCheck.bind(this)
	}

	eventHandleCheckbox = (e) => {
		const newObj = {};
		newObj[e.target.name] = e.target.checked
		this.props.setProps(newObj)
	}

	resetCheck =()=>{ // 회원가입 알럿 설정
		const {data} = this.props;
	 //console.log(data.under14)
		if(data.under14){
				if(data.adultTermAgree1 && data.adultTermAgree2 && data.adultTermAgree3 && data.adultTermAgree4){
					this.props.setProps({
						adultTerms:'',
						validStatus:Object.assign({},data.validStatus, {adultTerms:0}),
					});
				 }
     }
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
      <ul className="t2">
        <li>
          <div className="termsBox">
            <dl>
              <dt>
                <span className="icheck">
                  <input type="checkbox" id="b0" name="adultTermAgree0"
										checked={data.adultTermAgree0}
										onChange={this.eventHandleCheckbox}
									/>
                  <label htmlFor="b0"><em>전체동의</em></label>
                </span>
              </dt>
              <dd>
                <ul>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="b1" name="adultTermAgree1"
												checked={data.adultTermAgree1}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="b1"><em>개인정보처리방침 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="a1" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="b2" name="adultTermAgree2"
												checked={data.adultTermAgree2}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="b2"><em>통신과금서비스 이용약관 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="a2" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="b3" name="adultTermAgree3"
												checked={data.adultTermAgree3}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="b3"><em>전자금융거래 기본약관 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="a3" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="b4" name="adultTermAgree4"
												checked={data.adultTermAgree4}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="b4"><em>개인정보 수집 및 이용동의 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="d2" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="b5" name="adultTermAgree5"
												checked={data.adultTermAgree5}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="b5"><em>개인정보 유효기간 3년 지정 (미동의 시 1년)</em></label>
                    </span>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
					{
						data.validStatus.adultTerms!==0?
						<p className="validate_msg">{data.validMsg['adultTerms'][data.validStatus.adultTerms]}</p> : null
					}
        </li>
      </ul>
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

TermsAdult = connect(mapStateToProps, mapDispatchToProps)(TermsAdult);

export default TermsAdult;
