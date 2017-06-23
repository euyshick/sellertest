import React, { Component } from 'react'

import ReactHtmlParser from 'react-html-parser'

import Utils from '../../utils/Utils'

export default class Terms extends Component{
  static defaultProps = {
    terms:[],
    isAgreed0:false,
    isAgreed1:false,
    isAgreed2:false,
  }
  static propTypes ={
    terms: React.PropTypes.array.isRequired,
    isAgreed0: React.PropTypes.bool.isRequired,
    isAgreed1: React.PropTypes.bool.isRequired,
    isAgreed2: React.PropTypes.bool.isRequired,
  }

  state = {
    isAgreed0:this.props.isAgreed0,
    isAgreed1:this.props.isAgreed1,
    isAgreed2:this.props.isAgreed2,
    displayTerms:false,
    displayTab1:0,
    displayTab2:0,
  }

  htmlContainer1=null
  htmlContainer2=null
  htmlContainer3=null
  htmlContainer4=null
  htmlContainer5=null

  componentWillMount(){
    const d = this.props.terms;
    let i = 0;
    let len = d.length;
    for(;i<len;i++){
      switch (d[i].cat_id_msg) {
        default:
        case 1020107000 :
          this.htmlContainer1 = d[i].terms_cont;//.replace(/&nbsp;/gi," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
          break;
        case 1020103000 :
          this.htmlContainer2 = d[i].terms_cont;//.replace(/&nbsp;/gi," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
          break;
        case 1020104000 :
          this.htmlContainer3 = d[i].terms_cont;//.replace(/&nbsp;/gi," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
          break;
        case 1020105000 :
          this.htmlContainer4 = d[i].terms_cont;//.replace(/&nbsp;/gi," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
          break;
        case 1020106000 :
          this.htmlContainer5 = d[i].terms_cont;//.replace(/&nbsp;/gi," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
          break;
      }
    }
  }

  render(){
    return(
      <div>
        <article className="order-body_row">
        	<h3 className="tit-h3">개인정보 제3자 제공 및 주의사항 동의</h3>
        	<div className="tab-box privacy-conts">
        		<ul>
              <li className={this.state.displayTab1===0?"active":null}
                onClick={(e)=>{ this.setState({displayTab1:0}) }}>
        				<h4 className="tit-h4">개인정보 제3자 제공</h4>
                <div className="conts">{ReactHtmlParser( Utils.decodeHTMLEntities(this.htmlContainer1) )}</div>
        			</li>
        			<li className={this.state.displayTab1===1?"active":null}
                onClick={(e)=>{ this.setState({displayTab1:1}) }}>
        				<h4 className="tit-h4">주의사항</h4>
                <div className="conts">{ReactHtmlParser( Utils.decodeHTMLEntities(this.htmlContainer2) )}</div>
        			</li>
        		</ul>
        	</div>

        	<ul className="privacy-check">
        		<li>
        			<span className={this.props.check_validation_terms['agree1']===1||this.props.check_validation_terms['agree1']===3?"icheck ialert":"icheck"}>
        				<input type="checkbox" id="id-p"
                  checked={this.state.isAgreed0}
                  onChange={(e)=>{
                    this.setState({isAgreed0: e.target.checked});
                    this.props._updateState({isAgreed0: e.target.checked});
                  }}
                />
        				<label htmlFor="id-p"><em><strong>개인정보 제3자 제공에 동의</strong></em></label>
        			</span>
        		</li>
        		<li>
        			<span className={this.props.check_validation_terms['agree1']===2||this.props.check_validation_terms['agree1']===3?"icheck ialert":"icheck"}>
        				<input type="checkbox" id="id-p2"
                  checked={this.state.isAgreed1}
                  onChange={(e)=>{
                    this.setState({ isAgreed1: e.target.checked});
                    this.props._updateState({isAgreed1: e.target.checked});
                  }}
                />
        				<label htmlFor="id-p2"><em><strong>주의사항에 동의</strong></em></label>
        			</span>
        		</li>
        	</ul>
          {
            this.props.check_validation_terms['agree1']===1?
            <div className="alert-msg fail">결재대행서비스에 동의하셔야 결제가 진행됩니다.</div> : null
          }
          {
            this.props.check_validation_terms['agree1']===2?
            <div className="alert-msg fail">주의사항에 동의하셔야 결제가 진행됩니다.</div> : null
          }
          {
            this.props.check_validation_terms['agree1']===3?
            <div className="alert-msg fail">개인정보 제3자 제공 및 주의사항에 동의하셔야 결제가 진행됩니다.</div> : null
          }
        </article>

        <article className="order-body_row">
        	<div className="order-body_row_head">
        		<h3 className="tit-h3">결제대행서비스 이용약관</h3>
        		{
              this.state.displayTerms?
              <button type="button" className="btn-conts-view" onClick={(e)=>{ this.setState({displayTerms:false}) }}><span>내용닫기<i className="icon-angle-up"></i></span></button>
              :
              <button type="button" className="btn-conts-view clse" onClick={(e)=>{ this.setState({displayTerms:true}) }}><span>내용보기<i className="icon-angle-down"></i></span></button>
            }
        	</div>


          	<div className="tab-box payment-agency">
              {
                this.state.displayTerms?
          		<ul>
                <li className={this.state.displayTab2===0?"active":null}
                  onClick={(e)=>{ this.setState({displayTab2:0}) }}>
          				<h4 className="tit-h4">기본약관</h4>
                  <div className="conts">{ReactHtmlParser( Utils.decodeHTMLEntities(this.htmlContainer3) )}</div>
          			</li>
                <li className={this.state.displayTab2===1?"active":null}
                  onClick={(e)=>{ this.setState({displayTab2:1}) }}>
          				<h4 className="tit-h4">개인정보 수집 및 이용</h4>
                  <div className="conts">{ReactHtmlParser( Utils.decodeHTMLEntities(this.htmlContainer4) )}</div>
          			</li>
          			<li className={this.state.displayTab2===2?"active":null}
                  onClick={(e)=>{ this.setState({displayTab2:2}) }}>
          				<h4 className="tit-h4">개인정보 제공 및 위탁</h4>
                  <div className="conts">{ReactHtmlParser( Utils.decodeHTMLEntities(this.htmlContainer5) )}</div>
          			</li>
          		</ul>
              : null
            }
          	</div>


        	<div className="payment-check">
            <span className={this.props.check_validation_terms['agree2']?"icheck ialert":"icheck"}>
        			<input type="checkbox" id="id-pc"
                checked={this.state.isAgreed2}
                onChange={(e)=>{
                  this.setState({isAgreed2: e.target.checked});
                  this.props._updateState({isAgreed2: e.target.checked});
                }}
              />
        			<label htmlFor="id-pc"><em><strong>본인은 위의 내용을 모두 읽어보았으며 이에 전체 동의합니다.</strong></em></label>
        		</span>
            {
              this.props.check_validation_terms['agree2']?
              <div className="alert-msg fail">결제대행서비스 이용약관에 동의하셔야 결제가 진행됩니다.</div> : null
            }
        	</div>
        </article>
      </div>
    );
  }
}
