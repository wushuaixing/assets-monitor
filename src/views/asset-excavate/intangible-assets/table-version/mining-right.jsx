import React from 'react';
import { Pagination } from 'antd';
import assetsD from 'api/professional-work/debtor/assets';
import assetsB from 'api/professional-work/business/assets';
import {
	Ellipsis, Spin, Table,
} from '@/common';
import { getQueryByName, timeStandard, toEmpty } from '@/utils';


const certificateTypeStatus = {
	1: '采矿权',
	2: '探矿权',
	3: '未知',
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
						{ row.certificateType ? <span className="yc-case-reason text-ellipsis">{certificateTypeStatus[row.certificateType]}</span> : ''}
					</li>

					<li>
						<span className="list">
							<span>
								{row.mineralSpecies || '-'}
							</span>
							<span style={{ marginLeft: 20 }}>{row.projectName || '-'}</span>
						</span>
					</li>
					<li>
						<span className="list list-title align-justify">发布日期</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">{timeStandard(row.gmtPublishTime)}</span>
						<span className="list-split" style={{ height: 16 }} />
						<span className="list list-title align-justify">有效期</span>
						<span className="list list-title-colon">:</span>
						{
							row.gmtValidityPeriodStart && row.gmtValidityPeriodEnd ? (
								<span className="list list-content">{`${row.gmtValidityPeriodStart}至${row.gmtValidityPeriodEnd}` }</span>
							) : '--'
						}
						<span className="list-split" style={{ height: 16 }} />
						<span className="list list-title align-justify">面积</span>
						<span className="list list-title-colon">:</span>
						<span className="list list-content">{row.area}</span>
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
		const { portrait } = this.props;
		const params = {};
		let api = assetsD['10402'];
		if (portrait === 'debtor_enterprise' || portrait === 'debtor_personal') {
			api = assetsD['10402'];
			params.obligorId = getQueryByName(window.location.href, 'id');
		} else if (portrait === 'business') {
			api = assetsB['10402'];
			params.obligorId = getQueryByName(window.location.href, 'id');
		}
		this.setState({ loading: true });
		api.list({
			page: page || 1,
			num: 5,
			...params,
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
