import React from 'react';
import {
	Form, Button, Modal,
} from 'antd';
import ImgWeixin from '../../../../assets/img/login/weixin.png';
import './style.scss';

const createForm = Form.create;


class PhoneModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}


	render() {
		const { noPhoneModalVisible, onCancel } = this.props;
		return (
			<Form layout="inline">
				<Modal
					maskClosable={false}
					className="yc-noPhone-Modal"
					title="联系源诚"
					textAlign="center"
					width={460}
					visible={noPhoneModalVisible}
					onOk={this.handleOk}
					onCancel={onCancel}
					footer={false}
				>
					<div className="yc-modal-part">
						<div className="yc-modal-part-a">
							<li>
								<img alt="二维码" src={ImgWeixin} />
							</li>
							<li>源诚客服微信</li>
							<li>客服电话：XXX-XXXX-XXXX</li>
						</div>
						<div className="yc-modal-part-b">
							{'扫描二维码或拨打客服电话，将需要重置密码的账号、姓名、所属机构提供给小源，小源会第一时间为您进行处理'}
						</div>
						<div className="yc-modal-part-c">
							<Button type="primary" className="yc-modal-btn" onClick={onCancel}>我知道了</Button>
						</div>
					</div>
				</Modal>
			</Form>
		);
	}
}

export default createForm()(PhoneModal);