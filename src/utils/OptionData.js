import React, { Component } from 'react'
import moment from 'moment'

const textDirect = '직접입력';
const phoneHead1 = ['010', '011', '016', '017', '018', '019'];
const phoneHead2 = ['02', '031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064', '070', '080', '0130', '0303', '0502', '0503', '0504', '0505', '0506', '0507'];
const emailDomain = [textDirect, 'naver.com', 'daum.net', 'hanmail.net', 'nate.com', 'gmail.com', 'paran.com', 'chol.com', 'dreamwiz.com', 'empal.com', 'freechal.com', 'hanafos.com', 'hanmir.com', 'hitel.net', 'hotmail.com', 'korea.com', 'lycos.co.kr', 'netian.com', 'yahoo.co.kr', 'yahoo.com'];

export default class OptionData extends Component {
  static defaultProps = {
    datas: phoneHead1,
    mode: 'mobile',
    onChange: function(){},
  }

  state = {
    datas: this.props.datas,
  }

  options = () => {
    const { mode } = this.props

    switch (mode) {
      default:
      case 'tels':
        this.state = { datas: phoneHead1.concat(phoneHead2) };
        break;
      case 'mobile':
        this.state = { datas: phoneHead1 };
        break;
      case 'tel':
        this.state = { datas: phoneHead2 };
        break;
      case 'email':
        this.state = { datas: emailDomain };
        break;
      case 'year':
        this.state = { datas: 1907 };
        break;
      case 'month':
        this.state = { datas: 12 };
        break;
      case 'day':
        this.state = { datas: 31 };
        break;
    }

    if(typeof this.state.datas === 'object'){
      if(this.state.datas.length > 0){
        return this.state.datas.map((a,index) => {
          if(a===textDirect){
            return(<option value='' key={index}>{textDirect}</option>);
          }
          return(<option value={a} key={index}>{a}</option>);
        })
      }
    } else if(typeof this.state.datas === 'number'){
      let arr = [];
      let i = 0;
      let max = this.state.datas;

      if(mode==='year'){
        arr.push('년');
        i = moment().year();

        for(;i>max;i--){
          arr.push(i);
        }
      }else{
        if(mode==='month'){
          arr.push('월');
        }else if(mode==='day'){
          arr.push('일');
        }

        for(;i<max;i++){
          arr.push(i+1);
        }
      }
      return arr.map((a,index)=>{
        return(<option value={typeof a==='number'?a:''} key={index}>{a}</option>);
      })
    }
  };

  render(){
    return(
      <select
        name={this.props.name}
        id={this.props.id}
        className={this.props.className}
        disabled={this.props.disabled}
        defaultValue={this.props.defaultValue?this.props.defaultValue:this.props.value}
        lang="en"
        onChange={(e)=>{
          this.props.onChange(e);
        }}
      >
        {this.options()}
      </select>
    );
  }
}
