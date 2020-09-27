import React from 'react';
import { Pagination } from 'antd';
import { Attentions, SortVessel } from '@/common/table';
import Api from 'api/monitor-info/seizedUnbock';
import { Table, SelectedNum, Ellipsis } from '@/common';
import InforItem from './infoItem';

// 获取表格配置
const columns = (props) => {
	const { normal, onRefresh, noSort } = props;
	const { onSortChange, sortField, sortOrder } = props;
	const sort = { sortField, sortOrder };

	const defaultColumns = [
		{
			title: '债务人',
			dataIndex: 'parties',
			width: 200,
			render: (text, row = {}) => text.map(i => (
				<div style={{ position: 'relative' }}>
					<Ellipsis
						content={`${i.name};`}
						tooltip
						width={160}
						url={`/#/business/debtor/detail?id=${row.obligorId}`}
					/>
				</div>
			)),
		}, {
			title: (noSort ? <span style={{ paddingLeft: 11 }}>关联案件</span>
				: (
					<SortVessel field="GMT_PUBLISH_TIME" onClick={onSortChange} style={{ paddingLeft: 11 }} {...sort}>
						关联案件
						<span>（发布/查封日期）</span>
					</SortVessel>
				)),
			dataIndex: 'caseNumber',
			width: 250,
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
			width: 350,
			render: (text, row) => <InforItem content={text} row={row} />,
		}, {
			title: (noSort ? global.Table_CreateTime_Text
				: <SortVessel field="GMT_MODIFIED" onClick={onSortChange} {...sort}>{global.Table_CreateTime_Text}</SortVessel>),
			dataIndex: 'updateTime',
			width: 90,
		}, {
			title: '操作',
			width: 55,
			unNormal: true,
			className: 'tAlignCenter_important',
			render: (text, row, index) => (
				<Attentions
					text={text}
					row={row}
					onClick={onRefresh}
					api={row.isAttention ? Api.unFollow : Api.follow}
					index={index}
				/>
			),
		}];

	return normal ? defaultColumns.filter(item => !item.unNormal) : defaultColumns;
};

export default class TableView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
		};
	}

	componentWillReceiveProps(nextProps) {
		const { manage } = this.props;
		if ((manage === false && nextProps.manage) || !(nextProps.selectRow || []).length) {
			this.setState({ selectedRowKeys: [] });
		}
	}

	// 行点击操作
	toRowClick = (record, index) => {
		const { id, isRead } = record;
		const { onRefresh, manage } = this.props;
		if (!isRead && !manage) {
			Api.read({ idList: [id] }).then((res) => {
				if (res.code === 200) {
					onRefresh({ id, isRead: !isRead, index }, 'isRead');
				}
			});
		}
	};

	// 选择框
	onSelectChange=(selectedRowKeys, record) => {
		const _selectedRowKeys = record.map(item => item.id);
		console.log(_selectedRowKeys);
		const { onSelect } = this.props;
		this.setState({ selectedRowKeys });
		if (onSelect)onSelect(selectedRowKeys);
	};

	render() {
		const {
			total, current, dataSource, manage, onPageChange, pageSize, isShowPagination = true,
		} = this.props;
		const { selectedRowKeys } = this.state;
		const rowSelection = manage ? {
			rowSelection: {
				selectedRowKeys,
				onChange: this.onSelectChange,
			},
		} : null;
		return (
			<React.Fragment>
				{selectedRowKeys && selectedRowKeys.length > 0 ? <SelectedNum num={selectedRowKeys.length} /> : null}
				<Table
					{...rowSelection}
					columns={columns(this.props)}
					rowKey={record => record.id}
					dataSource={dataSource}
					pagination={false}
					rowClassName={record => (record.isRead ? '' : 'yc-row-bold cursor-pointer')}
					onRowClick={this.toRowClick}
				/>
				{dataSource && dataSource.length > 0 && isShowPagination && (
				<div className="yc-table-pagination">
					<Pagination
						showQuickJumper
						pageSize={pageSize || 10}
						current={current || 1}
						total={total || 0}
						onChange={onPageChange}
						showTotal={totalCount => `共 ${totalCount} 条信息`}
					/>
				</div>
				)}
			</React.Fragment>
		);
	}
}
