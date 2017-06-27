import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps } from '../actions'

class TermsDefault extends Component{
	constructor(props){
		super(props)
		this.eventHandleCheckbox = this.eventHandleCheckbox.bind(this)
		this.eventHandleClick = this.eventHandleClick.bind(this)
		this.resetCheck= this.resetCheck.bind(this)
	}

    resetCheck =()=>{ // 회원가입 알럿 설정
	 		const {data} = this.props;
			if(data.termAgree1 && data.termAgree2){
				this.props.setProps({
					terms:'',
					validStatus:Object.assign({},data.validStatus, {terms:0}),
				});
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
      <ul className="t3">
        <li>
          <div className="termsBox">
            <dl>
              <dt>
                <span className="icheck">
                  <input type="checkbox" id="a0" name="termAgree0"
										checked={data.termAgree0}
										onChange={this.eventHandleCheckbox}
									/>
                  <label htmlFor="a0"><em>전체동의</em></label>
                </span>
              </dt>
              <dd>
                <ul>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="usedAgree" name="termAgree1"
												checked={data.termAgree1}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="usedAgree"><em>이용약관 동의 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="d1" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="privateAgree" name="termAgree2"
												checked={data.termAgree2}
												onChange={this.eventHandleCheckbox}
												onBlur={this.resetCheck}
											/>
                      <label htmlFor="privateAgree"><em>개인정보 수집 및 이용 동의 (필수)</em></label>
                    </span>
                    <span className="btn_wrap">
                      <button type="button" className="btn_terms" value="d2" onClick={this.eventHandleClick}>내용보기</button>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="emailAgree" name="termAgree3"
												checked={data.termAgree3}
												onChange={this.eventHandleCheckbox}
											/>
                      <label htmlFor="emailAgree"><em>이메일 마케팅 수신 동의</em></label>
                    </span>
                  </li>
                  <li>
                    <span className="icheck">
                      <input type="checkbox" id="private3Agree" name="termAgree4"
												checked={data.termAgree4}
												onChange={this.eventHandleCheckbox}
											/>
                      <label htmlFor="private3Agree"><em>개인정보 유효기간 3년 지정 (미동의 시 1년)</em></label>
                    </span>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
					{
						data.validStatus.terms!==0?
						<p className="validate_msg">{data.validMsg['terms'][data.validStatus.terms]}</p> : null
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

TermsDefault = connect(mapStateToProps, mapDispatchToProps)(TermsDefault);

export default TermsDefault;
