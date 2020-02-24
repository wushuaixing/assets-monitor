import React from 'react';
import { Pagination } from 'antd';
import {
	Ellipsis, Icon, Spin, Table,
} from '@/common';
import { Dump } from '@/utils/api/monitor-info/intangible';
import { getQueryByName, timeStandard, toEmpty } from '@/utils';


const status = {
	注销: {
		reasonName: '注销原因',
		dateName: '注销时间',
	},
	撤销: {
		reasonName: '撤销原因',
		dateName: '撤销时间',
	},
	遗失: {
		reasonName: '遗失原因',
		dateName: '遗失时间',
	},
};
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
			title: '信息',
			dataIndex: 'licenseNumber',
			render: (value, row) => (
				<div className="assets-info-content">
					<li className="yc-public-title-normal-bold" style={{ lineHeight: '20px' }}>
						{ toEmpty(row.licenseNumber) ? <Ellipsis content={row.licenseNumber} width={400} tooltip font={16} /> : '--' }
					</li>
					<li>{row.industry}</li>
					<li>
						<span className="list list-title align-justify">发证日期</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">{timeStandard(row.gmtIssueTime)}</span>
						<span className="list-split" style={{ height: 16 }} />
						<span className="list list-title align-justify">有效期</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">{`${row.gmtValidityPeriodStart ? row.gmtValidityPeriodStart : '--'}至${row.gmtValidityPeriodEnd ? row.gmtValidityPeriodEnd : '--'}` }</span>
					</li>
				</div>
			),
		},
		{
			title: '关联信息',
			width: 240,
			render: (value, row) => (
				<div className="assets-info-content">
					<li style={{ lineHeight: '20px' }}>
						<Icon type="icon-dot" style={{ fontSize: 12, color: row.status === '正常' ? '#3DBD7D' : '#7D8699', marginRight: 2 }} />
						<span className="list list-content ">{row.status}</span>
					</li>
					{
						row.status !== '正常' ? (
							<React.Fragment>
								<li>
									<span className="list list-title align-justify">{`${status[row.status].reasonName}`}</span>
									<span className="list list-title-colon">:</span>
									<span className="list list-content">{row.reason || '-'}</span>
								</li>
								<li>
									<span className="list list-title align-justify">{`${status[row.status].dateName}`}</span>
									<span className="list list-title-colon">:</span>
									<span className="list list-content">{row.gmtIssueTime || '-'}</span>
								</li>
							</React.Fragment>
						) : null
					}
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
		Dump.list({
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
