import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput } from '../actions'
import { request, jsonToQueryString} from '../../utils/Utils'

class FormNickname extends Component{


  athuDataWrong = (e) => {
  const {data} = this.props;
    data.authState=0;
    	this.setState({dataWrong:1});

 }
 componentWillUpdate(nextProps,nextState){
  //
  // console.log(nextProps.data.validStatus.userId)
  //         if(nextProps.data.formData.userId){
  //
  // console.log("good")


   }

  eventHandleBlur = (e) => {
    const {data, setProps} = this.props;
    const idReg = /^[가-힣a-z0-9_]{3,19}$|[a-z]+[a-z0-9_]{2,19}$/g;
    const _value = e.target.value
    const _name = e.target.name
    const obj_validStatus = {}
    const obj_formData = {}

    let _status = data.validStatus.userNickname


    if(data.formData.userNickname===''){
      _status = 1;    //userNickname:0, 1:미입력

    }else if(!idReg.test(data.formData.userNickname)){
      _status = 2;  // userNickname:0, 2:형식오류
    }else{
      _status = 0;  // userNickname:0,  0:기본

      this.props.setProps({
        validStatus:Object.assign({},this.props.data.validStatus, {userNickname:0}),
       });

    }



    if(_status !== 0){      //  userNickname:0, //닉네임 - 0:기본, 1:미입력, 2:형식오류, 3:중복닉네임
      //console.log(_status)
    //console.log( _value)
      obj_validStatus[_name] = _status;
      obj_formData[_name] = _value;
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })

      //console.log(_name);

      return;
    }
      //console.log(_value)
        let rqData = {
            nm_nick:_value,
          }
      request({
        url:data.apiUrl.nicknmcheck+jsonToQueryString(rqData),
      }).then(rsData=>{
        if(rsData.message.toLowerCase()==='duplication'){
          obj_validStatus[_name] = 3;   //  userNickname:3, 3:중복닉네임

        }else{
          obj_validStatus[_name] = 0;   //  userNickname:0,  0:기본 성공
        }
        setProps({
          formData: Object.assign({},data.formData,obj_formData),
          validStatus:Object.assign({}, data.validStatus, obj_validStatus),
        })
      })

  } // event blur end

  render(){
    const {data, changeInput} = this.props;
    return(
      <li>
        <label htmlFor="userNickname" className="box_wrap">
          <input type="text" className="istyle" id="userNickname" placeholder="별명"
            maxLength="20" lang="en"
            name="userNickname"
            value={data.formData.userNickname}
            onChange={changeInput}
            onBlur={this.eventHandleBlur}
            onFocus={this.athuDataWrong}
          />
        </label>
        {
          data.validStatus.userNickname>0?
          <p className="validate_msg">{data.validMsg['userNickname'][data.validStatus.userNickname]}</p> : null
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
	}
}

FormNickname = connect(mapStateToProps, mapDispatchToProps)(FormNickname);

export default FormNickname;
