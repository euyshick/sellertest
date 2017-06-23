import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { setProps } from '../actions'
import { format } from '../../utils/Utils'

class JoinGroup1 extends Component{
  static defaultProps = {
    validMsg : {
      bizNum0 : {
        1:'법인등록번호를 입력해 주세요.',
        2:'법인등록번호가 유효하지 않습니다',
      },
      bizNum1 : {
        1:'사업자등록번호를 입력해 주세요.',
        2:'사업자등록번호가 유효하지 않습니다.',
      },
      bizNum2 : {
        1:'고유번호를 입력해 주세요.',
      }
    }
  }
	state = {
  	visibleLayer:false,
		validStatus : {
			bizNum0 : 0,	// 법인등록번호 - 0:기본, 1:미입력, 2:유효하지않음
			bizNum1 : 0,	// 사업자등록번호 - 0:기본, 1:미입력, 2:유효하지않음
			bizNum2 : 0,	// 고유번호 - 0:기본, 1:미입력
		}
	}

	constructor() {
    super();
    this.handelSubmit = this.handelSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount(){
		this.props.setProps({
      pageId : 'JoinGroup1',
		});
  }

  _displayMsg = (_type) => {
    const value = this.state.validStatus[_type];
    if(value===0) return;
    return(<p className="validate_msg t3">{this.props.validMsg[_type][value]}</p>);
  }

	_selectBizType = (e) => {
    //console.log(e.target.value)
		if(e.target.value===undefined) return false;
		this.props.setProps({
      bizType:e.target.value,
      bizNum0:'',
      bizNum1:'',
      bizNum2:'',
    });

    this.setState({
      validStatus: {
        bizNum0:0,
        bizNum1:0,
        bizNum2:0,
      }
    });
	}

	handleInputChange = (e) => {
    const regNum = /[^0-9-]/gi;
	  let obj = {};
		obj[e.target.name] = e.target.value.replace(regNum,'');

		this.props.setProps(obj);
	}

  _formValid = () =>{
    const {data} = this.props;
    const newObj = {};
    let cnt = 0;
    // console.log(data.bizType)
    switch (data.bizType) {
      default:
      case '0':
        if(data.bizNum1===''){
          newObj['bizNum1'] = 1;
          cnt+=1;
        }else if(!format.isBizNum(data.bizNum1)){
          newObj['bizNum1'] = 2;
          cnt+=1;
        }else{
          newObj['bizNum1'] = 0;
        }
        break;
      case '1':        // 영리 법인
        // console.log(data.bizNum0)     // 법인 번호
         if(data.bizNum0===''){
           newObj['bizNum0'] = 1;
           cnt+=1;
         }else if(!format.isRegNum(data.bizNum0)){
           newObj['bizNum0'] = 2;
           cnt+=1;
         }else{
           newObj['bizNum0'] = 0;
         }

         if(data.bizNum1===''){        // 사업자번호 
           newObj['bizNum1'] = 1;
           cnt+=1;
         }else if(!format.isBizNum(data.bizNum1)){
           newObj['bizNum1'] = 2;
           cnt+=1;
         }else{
           newObj['bizNum1'] = 0;
         }
         break;

      case '2':      // 비영리 법인


        if(data.bizNum0===''){
          newObj['bizNum0'] = 1;
          cnt+=1;
        }else if(!format.isRegNum(data.bizNum0)){
          newObj['bizNum0'] = 2;
          cnt+=1;
        }else{
          newObj['bizNum0'] = 0;
        }

        break;
      case '3':         // 공식단체
        if(data.bizNum2===''){
          newObj['bizNum2'] = 1;
          cnt+=1;
        }else{
          newObj['bizNum2'] = 0;
        }
        break;
    }
    this.setState({
      validStatus: Object.assign({},this.state.validStatus, newObj)
    });

    if(cnt>0) return;

    return true;
  }

	handelSubmit = () => {
    if( !this._formValid() ) return false;

    browserHistory.push('/join/group2');
	}

	render(){
		const {data} = this.props;
		return(
      <div className="container">
        <div className="content_wrap">
          <div className="content_join">
            <h2>행복쇼핑 단체회원 가입</h2>
            <div className="titExp">
              단체회원은 행복쇼핑 개인 아이디가 있어야 가입 가능합니다.
            </div>

            <section>
              <h3>단체 구분 <button type="button" className="btn_info" onClick={()=>{this.setState({visibleLayer:true})}}>단체회원이란?</button></h3>
              <div className="box_company_select">
                <ul>
                  <li>
                    <button type="button" value="0"
    									className={data.bizType==="0"?'group01 on':'group01'}
                      onClick={this._selectBizType}
                    >
                      <strong>개인 사업자</strong><br />
                      개인이 운영하는<br />사업체
                    </button>
                  </li>
                  <li>
                    <button type="button" value="1"
    									className={data.bizType==="1"?'group02 on':'group02'}
                      onClick={this._selectBizType}
                    >
                      <strong>영리 법인</strong><br />
                      영리를 목적으로 하는<br />상법상의 법인
                    </button>
                  </li>
                  <li>
                    <button type="button" value="2"
    									className={data.bizType==="2"?'group03 on':'group03'}
                      onClick={this._selectBizType}
                    >
                      <strong>비영리 법인</strong><br />
                      영리를 목적으로 하지 않는<br />민법상의 법인
                    </button>
                  </li>
                  <li>
                    <button type="button" value="3"
    									className={data.bizType==="3"?'group04 on':'group04'}
                      onClick={this._selectBizType}
                    >
                      <strong>공식단체</strong><br />
                      고유번호를 가진 단체
                    </button>
                  </li>
                </ul>
              </div>
            </section>

            <section className="joinForm">
              <ul className="t2 cNum_wrap">
    	          {
    							data.bizType==="1" || data.bizType==="2"?
    	            <li>
    	              <dl className="t2">
    	                <dt>법인등록번호</dt>
    	                <dd>
    	                  <span className="text_wrap">
    	                    <input type="tel" className="istyle" lang="en" maxLength="14" name="bizNum0"
                            value={data.bizNum0}
                            onChange={this.handleInputChange} />
    	                  </span>
    	                </dd>
    	              </dl>
    								{this._displayMsg('bizNum0')}
    	            </li>
    	            : null
    	          }
    	          {
    							data.bizType==="0" || data.bizType==="1"?
    	            <li>
    	              <dl className="t2">
    	                <dt>사업자등록번호</dt>
    	                <dd>
    	                  <span className="text_wrap">
    	                    <input type="tel" className="istyle" lang="en" maxLength="12" name="bizNum1"
                           value={data.bizNum1}
                           onChange={this.handleInputChange} />
    	                  </span>
    	                </dd>
    	              </dl>
    								{this._displayMsg('bizNum1')}
    	            </li>
    	            : null
    	          }
    	          {
    							data.bizType==="3"?
    	            <li className="cNum03">
    	              <dl className="t2">
    	                <dt>고유번호</dt>
    	                <dd>
    	                  <span className="text_wrap cNum_w1">
    	                    <input type="tel" className="istyle" lang="en" maxLength="12" name="bizNum2"
                           value={data.bizNum2}
                           onChange={this.handleInputChange} />
    	                  </span>
    	                </dd>
    	              </dl>
    								{this._displayMsg('bizNum2')}
    	            </li>
    	            : null
    	          }
              </ul>
            </section>
            <article className="btn_wrap group_submit">
              <button type="button" className="btn_join2" onClick={this.handelSubmit}>확인</button>
            </article>

            {
              this.state.visibleLayer?
              <div className="layer-pop">
                <div className="layer_mini">
                  <div className="layer-pop_header">
                    <h4 className="tit-h4">단체회원이란?</h4>
                  </div>
                  <div className="pcon">
                    행복쇼핑 단체회원이란<br/>
                    개인이 아닌 법인 또는 사업자가 행복쇼핑 회원으로 가입하여 단체 명의의 아이디를 공동으로 사용할 수 있는 서비스입니다.
                  </div>
                  <button type="button" className="btn-layer-pop_clse" onClick={()=>{this.setState({visibleLayer:false})}}><img src="//img.happyshopping.kr/img_static/img_pres/_v3/btn_layer_pop_clse.png" alt="닫기"/></button>
                </div>
              </div>
              : null
            }
          </div>
        </div>
      </div>
		);
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

JoinGroup1 = connect(mapStateToProps, mapDispatchToProps)(JoinGroup1);

export default JoinGroup1;
