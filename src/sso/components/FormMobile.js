import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput } from '../actions'
import { format, request, jsonToQueryString } from '../../utils/Utils'
import OptionData from '../../utils/OptionData'

class FormMobile extends Component{
  state = {
    min:2,
    sec:59,

  }

  athuDataWrong = (e) => {
  const {data} = this.props;
    data.authState=0;

    	this.setState({dataWrong:1});

 }
  eventHandleBlur = (e) => {
    const {data,setProps} = this.props;
    const _value = e.target.value;
    const _name = e.target.name;
    const obj_validStatus = {};
    const obj_formData = {};


    if(_value=== ''){
      obj_validStatus['mobile'] = 1;

    } else if(!format.isMobile(data.formData.mobile_0 + _value)){
      obj_validStatus['mobile'] = 2;
      //console.log("2")
    } else {
      obj_validStatus['mobile'] = 0;
    }

    obj_formData[_name] = _value

    if(obj_validStatus.mobile!==0){
      data.authState=0;
      setProps({
        formData: Object.assign({},data.formData, obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
      return;
    }

    if(data.pageId!=='Identify'){
                    // 핸드폰  중복체크
      const rqData = {
        kind:2,
        pdata:data.formData.mobile_0+_value
      }
      request({
        url:data.apiUrl.emailhpcheck+'/'+jsonToQueryString(rqData),
      }).then(rsData=>{
        if(rsData.message.toLowerCase()==='duplication'){
          obj_validStatus['mobile'] = 3;
        }else if(rsData.message.toLowerCase()==='success'){
          obj_validStatus['mobile'] = 4;
        }

        setProps({
          formData: Object.assign({},data.formData, obj_formData),
          validStatus:Object.assign({}, data.validStatus, obj_validStatus),
        })
      })
    }else{
      setProps({
        formData: Object.assign({},data.formData, obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
    }
  }

  eventHandleChange = (e) => {
    const {data} = this.props;
    const _value = e.target.value;
    const _name = e.target.name;
    const obj_validStatus = {};
    const obj_formData = {};

    obj_formData[_name] = _value;

    if(data.formData.mobile_1===''){
      this.props.setProps({
        formData:Object.assign({}, data.formData, obj_formData)
      })
      return;
    }


    if(data.pageId!=='Identify'){


      // 휴대전화 중복체크
      const rqData = {
        kind:2,
        pdata:_value+data.formData.mobile_1
      }
      request({
        url:data.apiUrl.emailhpcheck+'/'+jsonToQueryString(rqData),
      }).then(rsData=>{
      //  console.log(rsData.message.toLowerCase())
        if(rsData.message.toLowerCase()==='duplication'){
          obj_validStatus['mobile'] = 3;
        }else if(rsData.message.toLowerCase()==='success'){
          obj_validStatus['mobile'] = 4;
        }

        this.props.setProps({
          formData: Object.assign({},data.formData, obj_formData),
          validStatus:Object.assign({}, data.validStatus, obj_validStatus),
        })
      })
    }else{
      this.props.setProps({
        formData: Object.assign({},data.formData, obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
    }
  }

//휴대전화  아이디찾기 인증 비밀번호찾기

  eventAuthStart = (e) => {
    const {data, setProps} = this.props;
    // 휴대전화 번호 validate
    const _method = parseInt(e.target.value,10);
    const mobile_0 = data.formData.mobile_0;
    const mobile_1 = data.formData.mobile_1;
    let mobile_validStatus = 0;

    let _isWrongFormat = false;
    if(mobile_0==='' || mobile_1===''){
      _isWrongFormat = true;
      mobile_validStatus = 1;
    }else{
      let _numMobile = mobile_0+'-'+mobile_1.substring(0,4)+'-'+mobile_1.substring(4,8);
      if(mobile_1.length<8){
        _numMobile = mobile_0+'-'+mobile_1.substring(0,3)+'-'+mobile_1.substring(3,7);
      }
      if(!format.isMobile(_numMobile)) _isWrongFormat = true;
    }
    if( _isWrongFormat || mobile_1.length<8 ){
      mobile_validStatus = 2;
      const obj = {
        authState:-1,
        authMethod:_method,
        validStatus:Object.assign({},data.validStatus,{mobile:mobile_validStatus})
      };
      setProps(obj);
      return false;
    }

    // 인증 UI 시작
    setProps({
      authState:1,
      cntMin:this.state.min,
      cntSec:this.state.sec,
    });
    window.cntMin = this.state.min;
    window.cntSec = this.state.sec;
    let m = window.cntMin;
    window.TIMER = window.setInterval(function(){
      let _obj = {}
      let s = window.cntSec-1
      if(s<0){
        s = this.state.sec;
        m -= 1;

        if(m<0){
          clearInterval(window.TIMER);
          _obj['authState']=0;
          s = this.state.sec;
          m = this.state.min;
        }
      }

      _obj['cntSec'] = s;
      _obj['cntMin'] = m;
      setProps(_obj);
      window.cntSec = s;
      window.cntMin = m;
    }.bind(this),1000);



 // 이름 휴대전화 로 아이디 찾기 ajax
     const obj_exData = {
         auNum:0,
         statId:0,
         tab_Mode:0,
         statPw:0,
         find_By:0,
         exchord:"",
       }

    let rqData = {   // 아이디 찾기
          flug:1,   //아이디찾기
          kind:1,
          pdata:mobile_0+mobile_1,
          nm:data.formData.userName,
          uid:""
    }
    if(this.props.tabMode===1){ //    비번찾기


        // console.log("비번 핸드폰으로 찾기")
          rqData = {
                 flug:2,  //2 비번찾기
                 kind:1,  //1.핸드폰
                 pdata:mobile_0+mobile_1,
                 nm:data.formData.userName,
                 uid:data.formData.userId,
               }



       }

  //API 호출
    request({
      url:data.apiUrl.idpwdsearch+'/'+jsonToQueryString(rqData),
    }).then(rsData=>{

      // 성공시
      if(rsData.message.toLowerCase()==='success'){
        //console.log("success")
        obj_exData.exchord=rsData.rtncode;
        this.props.setProps({

        exData:Object.assign({},obj_exData) // 공동 스토어에 적용하기
        });

        // this.setState({
        // certifyCodeHash:rsData.rtncode,    // 코드발급
        // });
        // obj_exData.statId = 1;   // 아이디찾기 인증 성공
        // this.props.setProps({
        // exData:Object.assign({},obj_exData),
        // });
        const {data} = this.props;
          //data.authState=0;
          this.setState({dataWrong:1});

          setProps({
            validStatus:Object.assign({}, data.validStatus, {userId:0}),
          })



      }
      else if(rsData.message.toLowerCase()==="info_fail"){
        obj_exData.statId=2 // 인증성공 계정없음
        this.props.setProps({
        exData:Object.assign({},obj_exData),
        });
      //  console.log("fail")


       data.authState=2

       let data_Wrong = this.props.data.exData.statId;
       this.setState({dataWrong:data_Wrong});

      }


    })



  }


  render(){
    const {data, changeInput} = this.props;

    return(
      <li>
        <dl className="t1">
  				<dt>휴대전화</dt>
  				<dd>
  					<div className="phone_wrap">
  						<div className="phone">
  							<span className="phone1">
  								<OptionData
  									mode="mobile"
  									className="sstyle"
  									defaultValue={data.formData.mobile_0}
  									name="mobile_0"
  									disabled={!data.under14 && data.authState===3 && data.authMethod===0}
  									onChange={this.eventHandleChange}
  								/>
  							</span>
  							<span className="hyphen"></span>
  							<span className="phone2">
  								<label htmlFor="mobile_1">
  									<input type="tel" id="mobile_1" className="istyle" maxLength="8" lang="en"
  										name="mobile_1"
  										value={data.formData.mobile_1}
  										disabled={!data.under14 && data.authState===3 && data.authMethod===0}
  										onChange={changeInput}
  										onBlur={this.eventHandleBlur}
                      onFocus={this.athuDataWrong}
  									/>
  								</label>
  							</span>
  						</div>
              {
                data.pageId === 'Identify'?
                <button type="button" className="btn_join3"
                 value="0"
                 onClick={this.eventAuthStart}
                 disabled={data.authState===1||data.authState===3}
                >인증</button>
                : null
              }
  					</div>
  				</dd>
  			</dl>

        {
          (data.validStatus.mobile>0 && data.validStatus.mobile!==4) || (data.pageId === 'Identify' && data.authState===-1)?
          <p className="validate_msg t2">{data.validMsg['mobile'][data.validStatus.mobile]}</p> : null
        }


        {/*
          data.validStatus.authNum>0?
          <p className="validate_msg t2">{data.validMsg['authNum'][data.validStatus.authNum]}</p> : null
        */}

        {
           (this.state.dataWrong===2)?
          <p className="validate_msg t2">	입력하신 정보로 등록된 회원이 없습니다.  <strong>다시 확인</strong>후 시도해 주시기 바랍니다.</p>:null

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

FormMobile = connect(mapStateToProps, mapDispatchToProps)(FormMobile);

export default FormMobile;
