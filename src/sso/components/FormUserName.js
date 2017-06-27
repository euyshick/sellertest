import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput, blurInput } from '../actions'

class FormUserName extends Component{


  athuDataWrong = (e) => {
  const {data} = this.props;
    data.authState=0;
    	this.setState({dataWrong:1});

}

  render(){
    const {data, changeInput, blurInput} = this.props;
    return(
      <li>
        <label htmlFor="userName" className="box_wrap">
          <input type="text" className="istyle" id="userName" placeholder="이름"
            maxLength="30"
            name="userName"
            value={data.formData.userName}
            onChange={changeInput}
            onBlur={blurInput}
            onFocus={this.athuDataWrong}
          />
        </label>
        {
          data.validStatus.userName>0?
          <p className="validate_msg">{data.validMsg['userName'][data.validStatus.userName]}</p> : null
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

FormUserName = connect(mapStateToProps, mapDispatchToProps)(FormUserName);

export default FormUserName;
