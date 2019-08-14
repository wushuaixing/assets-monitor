/** 登录页 * */

import React from 'react';
// ==================
// 所需的所有组件
// ==================
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
// import imgReset from '../../assets/img/icon_photocode.png';
import backgroundHeaderImg from '../../assets/img/login/sign_logoyc.png';
// import rsaEncrypt from '@/utils/encryp';
// import { Button } from '@/components';
import './style.scss';

const createForm = Form.create;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}


	render() {
		return (
			<div className="yc-login-header">
				<div className="yc-login-logo">
					<div className="yc-login-wrapper">
						<img src={backgroundHeaderImg} alt="" />
						<span className="yc-login-world">
							<Icon className="yc-login-icon" type="info-circle-o" />
								正式用户都会开通唯一的二级域名，请确认访问正确的二级域名网址进行登录
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default createForm()(Login);
