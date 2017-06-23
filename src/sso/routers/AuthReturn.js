import React, {Component} from 'react'
import { connect } from 'react-redux'

import { setProps } from '../actions'
import { request, getParameter, jsonToQueryString } from '../../utils/Utils'

class AuthReturn extends Component{
  state = {
    result: '',
    resultCd: '',
    priinfo: '',
  }
  componentWillMount(){
    if(getParameter('result').toLowerCase()==='success'){

      this.setState({
        result: getParameter('result'),
        resultCd: getParameter('resultCd'),
        priinfo: getParameter('priinfo')
      });

    }
  }

  componentDidMount(prevProps, prevState){
    const rqData = {
      priinfo: getParameter('priinfo'),
      result: getParameter('result'),
      resultCd: getParameter('resultCd')
    }
    if(this.state.result!=='' && this.state.resultCd!=='' && this.state.priinfo!==''){
      request({
        url:this.props.data.apiUrl.requestHPAuthResult+jsonToQueryString(rqData),
      }).then(rsData=>{

        // "result": "00",
        // "ci": "oDy0toKWh/x4VFb0wBZiGVVUs9W6U603MQBpMd7SwubGKnikz2ShR2ImMeHw9ZSD+omzC5YcTxNVgvYuWVuqIw==",
        // "di": "MC0GCCqGSIb3DQIJAyEAhg4i/HqILOCaEq/Zoe7uYmj8JpK9JwkzMO+Qq3ib8eQ=",
        // "hp_p": "01046557432",
        // "birth_p": "19740302",
        // "f_sex_p": "1",
        // "f_nation_p": "0",
        // "num_p": "20170526145522200155",
        // "nm_p": "함치영"

        let rsltdata = rsData.rsltdata;
        if(rsltdata.result==='00'){
          window.opener.document.formAdultAuth.ci.value = rsltdata.ci;
          window.opener.document.formAdultAuth.di.value = rsltdata.di;
          window.opener.document.formAdultAuth.hp_p.value = rsltdata.hp_p;
          window.opener.document.formAdultAuth.birth_p.value = rsltdata.birth_p;
          window.opener.document.formAdultAuth.f_sex_p.value = rsltdata.f_sex_p;
          window.opener.document.formAdultAuth.f_nation_p.value = rsltdata.f_nation_p;
          window.opener.document.formAdultAuth.num_p.value = rsltdata.num_p;
          window.opener.document.formAdultAuth.nm_p.value = rsltdata.nm_p;
          window.opener.document.formAdultAuth.authState.value = '3';

          window.close();
        } else {
          window.opener.document.formAdultAuth.authState.value = '2';

          alert('인증을 완료하지 못했습니다\n다시 시도해주세요')
          window.close();
        }
      });
    }
  }

  render(){
    return(
      <div style={{
        textAlign:'center',
        padding:'100px 0'
      }}>
        잠시만 기다려주세요
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

AuthReturn = connect(mapStateToProps, mapDispatchToProps)(AuthReturn);

export default AuthReturn;
