import React from 'react';
import {
	Form, Modal, Input, message,
} from 'antd';
import './modal.scss';

const createForm = Form.create;
const FormItem = Form.Item;
const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 15 },
};

class AddAccountModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.addAccountVisible,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { addAccountVisible } = this.props;
		if (nextProps.addAccountVisible !== addAccountVisible) {
			this.setState({
				visible: nextProps.addAccountVisible,
			});
		}
	}

	// 关闭添加机构弹窗
	handleCancel = () => {
		const { handleCloseAddAccount } = this.props;
		handleCloseAddAccount();
	};

	// 弹窗确认按钮，确认添加下级机构
	handleConfirmBtn = () => {
		const { form, handleCloseAddAccount } = this.props;
		const values = form.getFieldsValue();
		console.log('values === ', values);
		// handleCloseAddAccount();
		form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}
			message.success('添加成功');
			// this.handleReset();
			console.log('Submit!!!');
			console.log(values);
		});
	};

	// 手动清除全部
	handleReset = () => {
		const { form } = this.props;
		const { resetFields } = form;
		resetFields();
	};

	render() {
		const { visible } = this.state;
		const { form } = this.props;
		const { getFieldProps } = form;
		return (
			<Modal
				title="添加账号"
				width={396}
				visible={visible}
				onCancel={this.handleCancel}
				onOk={this.handleConfirmBtn}
			>
				<Form horizontal className="account-form">
					<FormItem
						{...formItemLayout}
						label="姓名"
						required
					>
						<Input
							placeholder="请填写姓名"
							{...getFieldProps('name', {
								rules: [{
									required: true,
									whitespace: true,
									message: '请再次填写姓名',
								}],
							})}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="账号"
						required
					>
						<Input
							placeholder="请填写账号（手机号）"
							{...getFieldProps('account',
								{
									rules: [
										{
											required: true,
											message: '请输入手机号',
										},
										{
											pattern: new RegExp(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, 'g'),
											message: '手机号格式不正确',
										},
									],
								})}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="密码"
					>
						<Input
							disabled
							placeholder="20200902"
							{...getFieldProps('password')}
						/>
					</FormItem>
				</Form>
			</Modal>
		);
	}
}
export default createForm()(AddAccountModal);
