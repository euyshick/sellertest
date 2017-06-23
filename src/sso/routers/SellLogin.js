import React, {Component} from 'react'
import { connect } from 'react-redux'

//import { request, jsonToQueryString } from '../../utils/Utils'
import { setProps } from '../actions'
import LoginSell from '../components/LoginSell'

class SellLogin extends Component{
	componentWillMount(){

	}

	render(){
		return(
      <LoginSell/>
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

SellLogin = connect(mapStateToProps,mapDispatchToProps)(SellLogin);

export default SellLogin;
