import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput, blurInput } from '../actions'

class FormPw extends Component{
  _displayPwIcon = () => {
    switch (this.props.data.passwordLevel) {
      default:
      case 0:
        return(<span className="icon_pw s1"><i className="icon-member_id"></i></span>);
      case 1:
        return(<span className="icon_pw s2">사용불가<i className="icon-member_id"></i></span>);
      case 2:
        return(<span className="icon_pw s2">위험<i className="icon-member_id"></i></span>);
      case 3:
        return(<span className="icon_pw s3">보통<i className="icon-member_id"></i></span>);
      case 4:
        return(<span className="icon_pw s4">안전<i className="icon-member_id"></i></span>);
    }
  }

  render(){
    const {data, changeInput, blurInput} = this.props;
    return(
      <li>
        <label htmlFor="userPw" className="box_wrap pw_wrap">
          <input type="password" className="istyle" id="userPw" placeholder="비밀번호" maxLength="16"
            name="userPw"
            value={data.formData.userPw}
            onChange={changeInput}
            onBlur={blurInput}
          />
          {this._displayPwIcon()}
        </label>
        {
          data.validStatus.userPw>0?
          <p className="validate_msg">{data.validMsg['userPw'][data.validStatus.userPw]}</p> : null
        }
      </li>
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
    changeInput : (v) => dispatch(changeInput(v)),
    blurInput : (v) => dispatch(blurInput(v)),
	}
}

FormPw = connect(mapStateToProps, mapDispatchToProps)(FormPw);

export default FormPw;
