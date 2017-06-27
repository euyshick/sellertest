import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps, changeInput } from '../actions'
import { format, request, jsonToQueryString } from '../../utils/Utils'
import OptionData from '../../utils/OptionData'

class FormEmail extends Component{



  _check = (obj_formData,obj_validStatus) => {
    const {data,setProps} = this.props;

// console.log("check")

    // 이메일 중복체크
    const rqData = {
      kind:1,
      pdata:data.formData.email_id+'@'+data.formData.email_domain
    }
    request({
      url:data.apiUrl.emailhpcheck+'/'+jsonToQueryString(rqData),
    }).then(rsData=>{
      if(rsData.message.toLowerCase()==='duplication'){
        obj_validStatus['email'] = 3;
      }else if(rsData.message.toLowerCase()==='success'){
        obj_validStatus['email'] = 4;
      }

      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
    })
  }
  eventHandleBlur = (e) => {
    const {data,setProps} = this.props;
    const _value = e.target.value;
    const _name = e.target.name;
    const obj_validStatus = {};
    const obj_formData = {};

    if(_value===''){
      obj_validStatus['email'] = 1;
    } else if(!format.isEmail(data.formData.email_id+'@'+data.formData.email_domain)){
      obj_validStatus['email'] = 2;
    } else {
      obj_validStatus['email'] = 0;
    }

    obj_formData[_name] = _value

    if(obj_validStatus.email!==0){
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus:Object.assign({}, data.validStatus, obj_validStatus),
      })
      return;
    }

    if(data.pageId!=='Identify'){
      this._check(obj_formData,obj_validStatus);
    }
  }

  eventHandleChange = (e) => {
  //  console.log("test")
     this._check();


    const {data,setProps} = this.props;
    const obj_validStatus = {};
    const obj_formData = {'email_domain':e.target.value};

    if(e.target.value!==''){
      this.refs.email.className="email v2";
      if(data.formData.email_id!==''){
        obj_validStatus['email'] = 0;
      }
    } else if(!format.isEmail(data.formData.email_id+'@'+data.formData.email_domain)){
      obj_validStatus['email'] = 2;
    }else{
      this.refs.email.className="email";
      obj_validStatus['email'] = 0;
    }

    if(obj_validStatus.email!==0){
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus: Object.assign({},data.validStatus,obj_validStatus)
      });
      return;
    }

    if(data.pageId!=='Identify'){
      this._check(obj_formData,obj_validStatus);
    }else{
      setProps({
        formData: Object.assign({},data.formData,obj_formData),
        validStatus: Object.assign({},data.validStatus,obj_validStatus)
      });
    }
  }

  eventHandleAuth = (e) => {
    const {data, setProps} = this.props;
    const _email_string = data.formData.email_id+'@'+data.formData.email_domain;

    // 이메일 형식 체크
    if(_email_string==='@'){
      setProps({
        validStatus: Object.assign({},data.validStatus,{'email':'1'})
      });
      return;
    }else if( !format.isEmail(_email_string) ){
      setProps({
        validStatus: Object.assign({},data.validStatus,{'email':'2'})
      });
      return;
    }else{
      setProps({
        validStatus: Object.assign({},data.validStatus,{'email':'0'})
      });
    }

    // 인증 UI 시작
    setProps({
      authState:1,
    });


    // 이름 휴대전화 로 아이디 찾기 ajax
        const obj_exData = {
            auNum:0,
            statId:0,
            tab_Mode:0,
            statPw:0,
            find_By:0,
            exchord:"",
          }
    let rqData = {  // 이메일로 아이디 찾기
               flug:0,       //1 아이디찾기
               kind:0,      //2.이메일로
               pdata:"",
               nm:"",
               uid:""
             }

       if(this.props.tabMode===0){ // tabmode;0 이메일로  아이디 찾기

               rqData = {  // 이메일로 아이디 찾기
                flug:1,       //1 아이디찾기
                kind:2,      //2.이메일로
                pdata:data.formData.email_id+'@'+data.formData.email_domain,
                nm:data.formData.userName,
                uid:""
              }
        }else{               // 이메일로 비번찾기

            rqData = {
                    flug:2,  //2 비번찾기
                    kind:2,  //2.이메일로
                    pdata:data.formData.email_id+'@'+data.formData.email_domain,
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
          // console.log("success")
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
         }
         else if(rsData.message.toLowerCase()==="info_fail"){
           obj_exData.statId=2 // 인증성공 계정없음
           this.props.setProps({
           exData:Object.assign({},obj_exData),
           });
          // console.log("fail")
           data.authState=2


         }


       })

  }

  render(){
    const {data, changeInput} = this.props;

    return(
      <li>
        <div className="email" ref="email">
  				<label htmlFor="userEmail1" className="email1">
  					<input type="text" className="istyle lowercase" id="userEmail1" placeholder="이메일" lang="en"
  						name="email_id"
  						value={data.formData.email_id}
  						disabled={data.authState===3 && data.authMethod===1}
  						onChange={changeInput}
  						onBlur={this.eventHandleBlur}
  					/>
  				</label>
  				<span className="email_at">@</span>
  				<label htmlFor="userEmai2" className="email2_input">
  					<input type="text" className="istyle lowercase" id="userEmail2" placeholder="이메일 주소" lang="en"
  						name="email_domain"
  						value={data.formData.email_domain}
  						disabled={data.authState===3 && data.authMethod===1}
  						onChange={changeInput}
  						onBlur={this.eventHandleBlur}
  					/>
  				</label>
  				<span className="email2_select">
  					<OptionData
  						mode="email"
  						className="sstyle"
              disabled={data.authState===3 && data.authMethod===1}
  						onChange={this.eventHandleChange}
              onBlur={this._check}
  					/>
  				</span>
          {
            data.pageId === 'Identify'?
            <button type="button" className="btn_join3"
             value="1"
             onClick={this.eventHandleAuth}
             disabled={data.authState===1||data.authState===3}
            >인증</button>
            : null
          }
  			</div>
        {
          data.validStatus.email>0 || (data.pageId === 'Identify' && data.authState===-1)?
          <p className="validate_msg">{data.validMsg['email'][data.validStatus.email]}</p> : null
        }
        {/*
          data.validStatus.authNum>0?
          <p className="validate_msg">{data.validMsg['authNum'][data.validStatus.authNum]}</p> : null
        */}
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

FormEmail = connect(mapStateToProps, mapDispatchToProps)(FormEmail);

export default FormEmail;
