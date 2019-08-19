/** 登录页 * */

import React from 'react';
// ==================
// 所需的所有组件
// ==================

import {
	Form, Input, Button, message, Spin,
} from 'antd';
import {
	forgetPasswordStep1, // 忘记密码-step1
} from '@/utils/api/user';
import './style.scss';

const verificationCodeImg = 'http://172.18.255.251:18080/yc/open/verificationCode';
const FormItem = Form.Item;
const createForm = Form.create;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			codeImg: verificationCodeImg,
		};
	}

	handleSubmit = () => {
		const {
			form, changeType, inputPhoneNum,
		} = this.props; // 会提示props is not defined
		const { getFieldsValue } = form;
		const fields = getFieldsValue();
		form.validateFields((errors) => {
			if (errors) {
				return;
			}
			if (!fields.code) {
				message.errors('请输入验证码');
				return;
			}
			const params = {
				phone: fields.phone,
				code: fields.code,
			};
			forgetPasswordStep1(params).then((res) => {
				if (res === 200) {
					changeType(3);
					message.success('验证成功');
				} else {
					message.warning(res.message);
					this.verificationCode(); // 错误刷新验证码
				}
			});
			console.log(fields);
			inputPhoneNum(fields.username);
		});
	};

	verificationCode = () => {
		this.setState({
			codeImg: `${verificationCodeImg}?${Math.random()}`,
		});
	}

	render() {
		const {
			loading, userName, codeImg,
		} = this.state;
		const {
			form: { getFieldProps },
		} = this.props; // 会提示props is not defined
		console.log(codeImg);

		return (

			<div className="yc-verifyAccount-main">
				<Form>
					<Spin spinning={loading}>
						<li className="yc-card-title">验证账号</li>
						<div className="yc-form-wapper">
							<span className="yc-form-lable">账号</span>
							<FormItem>
								<Input
									className="yc-login-input"
									placeholder="请输入11位数字"
									maxlength="11"
									{...getFieldProps('phone', {
										initialValue: userName && userName.length > 0 ? userName : '',
										rules: [
											{
												required: true,
												message: '请输入账号',
											},
										],
									})}
								/>
							</FormItem>
						</div>
						<div className="yc-form-wapper">
							<span className="yc-form-lable">图形验证码</span>
							<FormItem>
								<Input
									className="yc-login-input"
									placeholder="请输入验证码"
									maxlength={4}
									style={{ parringRight: 160 }}
									{...getFieldProps('code', {
										rules: [
											{
												required: true,
												message: '请输入验证码',
											},
										],
									})}
								/>
								<img onClick={this.verificationCode} className="yc-verificationCode" src={codeImg} alt="" />
							</FormItem>
						</div>
						<Button type="primary" className="yc-login-btn" onClick={this.handleSubmit}>下一步</Button>
					</Spin>
				</Form>
			</div>
		);
	}
}

export default createForm()(Login);
