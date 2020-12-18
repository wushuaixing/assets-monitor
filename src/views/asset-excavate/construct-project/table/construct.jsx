import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'reactPropTypes';
import { Attentions, SortVessel } from '@/common/table';
import { readStatusMerchants } from '@/utils/api/monitor-info/finance';
import { Table, SelectedNum } from '@/common';
import api from '@/utils/api/monitor-info/finance';

const columns = (props) => {
	const {
		normal, onRefresh, onSortChange, sortField, sortOrder, noSort,
	} = props;
	const sort = {
		sortField,
		sortOrder,
	};

	// 含操作等...
	const defaultColumns = [
		{
			title: <span style={{ marginLeft: 10 }}>建设单位</span>,
			width: 290,
			dataIndex: 'obligorName',
			render: text => <span>{text}</span>,
			// render: (text, row) => (
			// 	<div>
			// 		{row.accurateType === 1 ? <img src={accurate} alt="" className="yc-assets-info-img" /> : null}
			// 		{ !row.isRead
			// 			? (
			// 				<span
			// 					className={!row.isRead && row.isRead !== undefined ? 'yc-table-read' : 'yc-table-unread'}
			// 					style={!row.isRead && row.isRead !== undefined ? { position: 'absolute' } : {}}
			// 				/>
			// 			) : null}
			// 		<li style={{ marginLeft: 10 }}>
			// 			<Ellipsis
			// 				content={text}
			// 				url={row.obligorId ? `#/business/debtor/detail?id=${row.obligorId}` : ''}
			// 				tooltip
			// 				width={250}
			// 			/>
			// 		</li>
			// 	</div>
			// ),
		},
		{
			title: '工程类型',
			dataIndex: 'category',
			render: text => <span>{text}</span>,
		},
		{
			title: (noSort ? '项目信息'
				: <SortVessel field="PUBLISH_TIME" onClick={onSortChange} mark="(立项批复日期)" {...sort}>招商信息</SortVessel>),
			width: 496,
			dataIndex: 'publishTime',
			render: text => <span>{text}</span>,
		},
		{
			title: (noSort ? '更新日期'
				: <SortVessel field="GMT_MODIFIED" onClick={onSortChange} {...sort}>更新日期</SortVessel>),
			dataIndex: 'gmtModified',
			render: text => <span>{text}</span>,
		},
		{
			title: '操作',
			width: 60,
			unNormal: true,
			className: 'tAlignCenter_important',
			render: (text, row, index) => (
				<Attentions
					text={text}
					row={row}
					onClick={onRefresh}
					api={row.isAttention ? api.unFollowMerchants : api.followMerchants}
					index={index}
				/>
			),
		}];
	return normal ? defaultColumns.filter(item => !item.unNormal) : defaultColumns;
};

class TableView extends React.Component {
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
			readStatusMerchants({ idList: [id] }).then((res) => {
				if (res.code === 200) {
					onRefresh({ id, isRead: !isRead, index }, 'isRead');
				}
			});
		}
	};

	// 选择框
	onSelectChange = (selectedRowKeys, record) => {
		// const _selectedRowKeys = record.map(item => item.id);
		console.log(record);
		const { onSelect } = this.props;
		this.setState({ selectedRowKeys });
		if (typeof onSelect === 'function')onSelect(selectedRowKeys);
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
					rowKey={record => record.id}
					columns={columns(this.props)}
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

TableView.propTypes = {
	current: PropTypes.number,
	total: PropTypes.number,
	pageSize: PropTypes.number,
	dataSource: PropTypes.obj,
	isShowPagination: PropTypes.bool,
	manage: PropTypes.bool,
	onSelect: PropTypes.fun,
	onPageChange: PropTypes.func,
	onRefresh: PropTypes.func,
};

TableView.defaultProps = {
	current: 1,
	total: 0,
	pageSize: 10,
	isShowPagination: true,
	manage: false,
	dataSource: [],
	onRefresh: () => {},
	onPageChange: () => {},
	onSelect: () => {},
};

export default TableView;
