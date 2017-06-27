import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput, blurInput } from '../actions'

class FormPw2 extends Component{
  _displayPwIcon = () => {
    switch (this.props.data.passwordLevel2){
      default:
      case 0:
        return(<span className="icon_pwc s1"><i className="icon-member_pass"></i></span>);
      case 1:
        return(<span className="icon_pwc s2"><i className="icon-member_pass"></i></span>);
    }
  }

  render(){
    const {data, changeInput, blurInput} = this.props;
    return(
      <li>
        <label htmlFor="userPw2" className="box_wrap pw_wrap">
          <input type="password" className="istyle" id="userPw2" placeholder="비밀번호 확인" maxLength="16"
            name="userPw2"
            value={data.formData.userPw2}
            onChange={changeInput}
            onBlur={blurInput}
          />
          {this._displayPwIcon()}
        </label>
        {
          data.validStatus.userPw2>0?
          <p className="validate_msg">{data.validMsg['userPw2'][data.validStatus.userPw2]}</p> : null
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

FormPw2 = connect(mapStateToProps, mapDispatchToProps)(FormPw2);

export default FormPw2;
