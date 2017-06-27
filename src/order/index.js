import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute} from 'react-router'

import App from './App'
import NotFound from '../components/NotFound'
import Order from './routers/Order'
import OrderComplete from './routers/OrderComplete'
import OrderError from './routers/OrderError'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Order}/>
			<Route path="order" component={Order}/>
			<Route path="order/complete" component={OrderComplete}/>
			<Route path="order/error" component={OrderError}/>
			<Route path="*" component={NotFound} />
		</Route>
	</Router>,
  document.getElementById('root')
);
