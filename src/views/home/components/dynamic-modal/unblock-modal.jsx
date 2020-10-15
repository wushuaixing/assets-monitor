import React from 'react';
import { Modal, Button } from 'antd';
import { Ellipsis, Spin, Table } from '@/common';
import { Attentions } from '@/common/table';
import InforItem from '@/views/asset-excavate/seized-unblock/table/infoItem';
import Api from 'api/monitor-info/seizedUnbock';
import RegisterModal from '../../../risk-monitor/bankruptcy/registerModal';

export default class UnblockModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [], // 列表数据
			loading: false,
			registerModalVisible: false,
			rowObj: {},
			columns: [
				{
					title: <span style={{ paddingLeft: 10 }}>查/解封对象</span>,
					dataIndex: 'parties',
					width: 260,
					render: text => text.map(i => (
						<div style={{ position: 'relative', paddingLeft: 10 }}>
							<Ellipsis
								content={`${i.name};`}
								tooltip
								width={240}
								url={`${i.obligorId !== 0 ? `/#/business/debtor/detail?id=${i.obligorId}` : ''}`}
							/>
						</div>
					)),
				}, {
					dataIndex: 'caseNumber',
					width: 263,
					render: (text, row) => (
						<div className="assets-info-content">
							<li>
								<span className="list list-title align-justify" style={{ width: 50 }}>案号</span>
								<span className="list list-title-colon">:</span>
								<span className="list list-content"><Ellipsis content={text || '-'} tooltip width={200} /></span>
							</li>
							<li>
								<span className="list list-title align-justify" style={{ width: 50 }}>执行法院</span>
								<span className="list list-title-colon">:</span>
								<span className="list list-content"><Ellipsis content={row.court || '-'} tooltip width={200} /></span>
							</li>
							{
								row.type === 1 ? 	(
									<li>
										<span className="list list-title align-justify" style={{ width: 50 }}>判决日期</span>
										<span className="list list-title-colon">:</span>
										<span className="list list-content"><Ellipsis content={row.publishTime || '-'} tooltip width={200} /></span>
									</li>
								) : null
							}
							{
								row.type === 2 ? (
									<React.Fragment>
										<li>
											<span className="list list-title align-justify" style={{ width: 50 }}>查封日期</span>
											<span className="list list-title-colon">:</span>
											<span className="list list-content"><Ellipsis content={row.sealUpTime || '-'} tooltip width={200} /></span>
										</li>
										<li>
											<span className="list list-title align-justify" style={{ width: 50 }}>解封日期</span>
											<span className="list list-title-colon">:</span>
											<span className="list list-content"><Ellipsis content={row.unsealingTime || '-'} tooltip width={200} /></span>
										</li>
									</React.Fragment>
								) : null
							}
						</div>
					),
				}, {
					title: '资产信息',
					dataIndex: 'information',
					width: 328,
					render: (text, row) => <InforItem content={text} row={row} />,
				}, {
					title: '更新日期',
					dataIndex: 'updateTime',
					width: 110,
				}, {
					title: '操作',
					width: 55,
					unNormal: true,
					className: 'tAlignCenter_important',
					render: (text, row, index) => (
						<Attentions
							text={text}
							row={row}
							api={row.isAttention ? Api.unFollow : Api.follow}
							index={index}
						/>
					),
				}],
		};
	}

	componentDidMount() {
		const { dataSource } = this.props;
		this.setState(() => ({
			dataSource,
		}));
	}

	// 表格发生变化
	onRefresh=(data, type) => {
		const { dataSource } = this.state;
		const { index } = data;
		const _dataSource = [...dataSource];
		_dataSource[index][type] = data[type];
		this.setState({
			dataSource: _dataSource,
		});
	};

	// 打开立案弹框
	openRegisterModal = (rowObj) => {
		// console.log(rowObj);
		this.setState({
			registerModalVisible: true,
			rowObj,
		});
	};

	// 关闭弹窗
	onCancel = () => {
		this.setState({
			registerModalVisible: false,
		});
	};

	handleCancel=() => {
		const { onCancel } = this.props;
		onCancel();
	};

	render() {
		const {
			columns, dataSource, loading, registerModalVisible, rowObj,
		} = this.state;
		const { unBlockModalVisible } = this.props;
		return (
			<Modal
				title="匹配详情-查/解封资产"
				width={1100}
				style={{ height: 320 }}
				visible={unBlockModalVisible}
				footer={null}
				onCancel={this.handleCancel}
				wrapClassName="vertical-center-modal"
			>
				<Spin visible={loading}>
					<Table
						scroll={dataSource.length > 8 ? { y: 440 } : {}}
						columns={columns}
						dataSource={dataSource}
						pagination={false}
						className="table"
					/>
					<div style={{ width: '100%', textAlign: 'center' }}>
						<Button onClick={this.handleCancel} type="primary" className="dynamic-modal-btn">关闭</Button>
					</div>
				</Spin>
				{registerModalVisible && (
					<RegisterModal
						onCancel={this.onCancel}
						onOk={this.onOk}
						rowObj={rowObj}
						registerModalVisible={registerModalVisible}
					/>
				)}
			</Modal>
		);
	}
}