import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import GroupData from './reducers'

import App from './App'
import Login from './routers/Login'
import Join from './routers/Join'
import JoinUser from './routers/JoinUser'
import JoinGroup1 from './routers/JoinGroup1'
import JoinGroup2 from './routers/JoinGroup2'
import JoinComplete from './routers/JoinComplete'
import Identify from './routers/Identify'
import NotFound from '../components/NotFound'
import AuthReturn from './routers/AuthReturn'

import SellLogin from './routers/SellLogin'
import SellApply from './routers/SellApply'
import SellerComplete from './routers/SellerComplete'


const store = createStore(GroupData);

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Login} simpleMode={true} title="로그인" />
				<Route path="/" component={Login} simpleMode={true} title="로그인" />
				<Route path="join" component={Join} simpleMode={true} title="회원가입" />
				<Route path="join/user" component={JoinUser} title="간편회원가입" />
				<Route path="join/group1" component={JoinGroup1} title="단체회원가입" />
				<Route path="join/group2" component={JoinGroup2} title="단체회원가입" />
				<Route path="join/complete" component={JoinComplete} />
				<Route path="identify" component={Identify} title="아이디/비밀번호찾기" />
				<Route path="join/authreturn" component={AuthReturn} simpleMode={true} />
				<Route path="sell" component={SellLogin} title="판매회원 신청 로그인" />
        <Route path="sell/apply" component={SellApply} title="판매회원 신청" />
					<Route path="sell/complete" component={SellerComplete} title="판매회원 신청완료"/>
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
	</Provider>,
  document.getElementById('root')
);
