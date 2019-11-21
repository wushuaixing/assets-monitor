import React from 'react';
import { Pagination } from 'antd';
import { Ellipsis, Spin, Table } from '@/common';
import manage from '@/utils/api/portrait-inquiry/enterprise/manage';
import { getQueryByName, timeStandard, toEmpty } from '@/utils';

const api = manage.punishment;

export default class TableIntact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: '',
			current: 1,
			total: 0,
			loading: false,
		};
	}

	componentWillMount() {
		this.toGetData();
	}

	toGetColumns=() => [
		{
			title: '主要信息',
			dataIndex: 'content',
			render: (value, row) => {
				const { punishNumber, content, type } = row;
				return (
					<div className="assets-info-content">
						<li className="yc-public-normal-bold" style={{ marginBottom: 2 }}>
							{ toEmpty(type) ? <Ellipsis content={type} tooltip width={600} font={15} /> : '--' }
						</li>
						<li>
							<span className="list list-title align-justify">决定文书号</span>
							<span className="list list-title-colon">:</span>
							<span className="list list-content">
								{ toEmpty(punishNumber) ? <Ellipsis content={punishNumber} width={600} tooltip /> : '--' }
							</span>
						</li>
						<li>
							<span className="list list-title align-justify">处罚内容</span>
							<span className="list list-title-colon">:</span>
							<span className="list list-content">
								{ toEmpty(content) ? <Ellipsis content={content} width={600} tooltip /> : '--' }
							</span>
						</li>
					</div>
				);
			},
		}, {
			title: '辅助信息',
			width: 300,
			render: (value, row) => (
				<div className="assets-info-content">
					<li style={{ height: 24 }} />
					<li>
						<span className="list list-title align-justify">决定机关</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">
							{ toEmpty(row.departmentName) ? <Ellipsis content={row.departmentName} width={200} /> : '--' }
						</span>
					</li>
					<li>
						<span className="list list-title align-justify">决定日期</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">{timeStandard(row.decisionDate)}</span>
					</li>
				</div>
			),
		},
	];

	// 当前页数变化
	onPageChange=(val) => {
		this.toGetData(val);
	};

	// 查询数据methods
	toGetData=(page) => {
		const companyId = getQueryByName(window.location.href, 'id');
		this.setState({ loading: true });
		api.list({
			page: page || 1,
			num: 5,
			companyId,
		}).then((res) => {
			if (res.code === 200) {
				this.setState({
					dataSource: res.data.list,
					current: res.data.page,
					total: res.data.total,
					loading: false,
				});
			} else {
				this.setState({
					dataSource: '',
					current: 1,
					total: 0,
					loading: false,
				});
			}
		}).catch(() => {
			this.setState({ loading: false });
		});
	};

	render() {
		const { dataSource, current, total } = this.state;
		const { loading } = this.state;

		return (
			<div className="yc-assets-auction">
				<Spin visible={loading}>
					<Table
						rowClassName={() => 'yc-assets-auction-table-row'}
						columns={this.toGetColumns()}
						dataSource={dataSource}
						showHeader={false}
						pagination={false}
					/>
					{dataSource && dataSource.length > 0 && (
						<div className="yc-table-pagination">
							<Pagination
								showQuickJumper
								current={current || 1}
								total={total || 0}
								pageSize={5}
								onChange={this.onPageChange}
								showTotal={totalCount => `共 ${totalCount} 条信息`}
							/>
						</div>
					)}
				</Spin>
			</div>
		);
	}
}