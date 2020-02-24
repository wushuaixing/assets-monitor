import React from 'react';
import { Pagination } from 'antd';
import assetsDetail from 'api/detail/assets';
import assetsPortrait from 'api/portrait-inquiry/enterprise/assets';
import { Spin, Table } from '@/common';
import { Mortgage } from './common';
import { getQueryByName } from '@/utils';

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
			dataIndex: 'projectName',
			render: Mortgage.mortgageDetail,
		}, {
			title: '关联信息',
			width: 360,
			render: Mortgage.mortgageRelatedInfo,
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
		if (portrait === 'personal') {
			params.obligorName = getQueryByName(window.location.href, 'name');
			params.obligorNumber = getQueryByName(window.location.href, 'num');
		} else if (portrait === 'detail') {
			params.id = getQueryByName(window.location.href, 'id');
		} else {
			params.companyId = getQueryByName(window.location.href, 'id');
		}
		const api = portrait === 'detail' ? assetsDetail.landMortgage : assetsPortrait.landMortgage;
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
								pageSize={5}
								showQuickJumper
								current={current || 1}
								total={total || 0}
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
