import React from 'react';
import ReactDOM from 'react-dom';
import 'anujs/lib/createClass';	// needed by antd 1.x
import { Provider } from 'react-redux';
import App from './views/app';
import store from './stores/app';
import './assets/css/public.scss';
import './utils/config';


if (process.env.NODE_ENV === 'production') {
	global.console = {
		info: () => { },
		log: () => { },
		warn: () => { },
		debug: () => { },
		error: () => { },
	};
}
ReactDOM.render(
	<Provider store={store} className="Provider">
		<App />
	</Provider>,
	document.getElementById('app'),
);