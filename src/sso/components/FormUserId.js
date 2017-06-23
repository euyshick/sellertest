import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput } from '../actions'
import { request } from '../../utils/Utils'

class FormUserId extends Component{


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
    const idReg = /^[a-z]+[a-z0-9_]{4,11}$/g;
    const _value = e.target.value
    const _name = e.target.name
    const obj_validStatus = {}
    const obj_formData = {}

    let _status = data.validStatus.userId



    if(data.pageId!=='Identify'){
          if(data.formData.userId===''){
            _status = 1;

          }else if(!idReg.test(data.formData.userId)){
            _status = 2;

          }else{

            _status = 0;
            this.props.setProps({

              validStatus:Object.assign({},this.props.data.validStatus, {userId:0}),
             });

          }

  }else{
//console.log("111")
    if(data.formData.userId===''){
      _status = 1;

    }else{

      _status = 0;
    }

  }

    if(_status !== 0){
      obj_validStatus[_name] = _status;
      obj_formData[_name] = _value;
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })

      //console.log(_name);

      return;
    }
      //console.log('Identify');
    if(data.pageId!=='Identify'){
      request({
        url:data.apiUrl.idcheck+'/'+_value,
      }).then(rsData=>{
        if(rsData.message.toLowerCase()==='duplication'){
          obj_validStatus[_name] = 3;
        }else{
          obj_validStatus[_name] = 0;
        }

        setProps({
          formData: Object.assign({},data.formData,obj_formData),
          validStatus:Object.assign({}, data.validStatus, obj_validStatus),
        })
      })
    } else {
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
    }
  }
  render(){
    const {data, changeInput} = this.props;
    return(
      <li>
        <label htmlFor="userId" className="box_wrap">
          <input type="text" className="istyle" id="userId" placeholder="아이디"
            maxLength="20" lang="en"
            name="userId"
            value={data.formData.userId}
            onChange={changeInput}
            onBlur={this.eventHandleBlur}
              onFocus={this.athuDataWrong}
          />
        </label>
        {
          data.validStatus.userId>0?
          <p className="validate_msg">{data.validMsg['userId'][data.validStatus.userId]}</p> : null
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

FormUserId = connect(mapStateToProps, mapDispatchToProps)(FormUserId);

export default FormUserId;
