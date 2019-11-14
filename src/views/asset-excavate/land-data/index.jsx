import React from 'react';
import { message, Modal } from 'antd';
import { changeURLArg, clearEmpty } from '@/utils';
import {
	Tabs, Button, Spin, Download,
} from '@/common';
import Api from '@/utils/api/monitor-info/public';
import { unReadCount } from '@/utils/api/monitor-info';

// 搜索框
import QueryResult from './query/result';
import QueryTransfer from './query/transfer';
import QueryMortgage from './query/mortgage';

// table展示
import TableResult from './table/result';
import TableTransfer from './table/transfer';
import TableMortgage from './table/mortgage';

const toGetApi = (type, base) => {
	if (type === 1) return `${base}Result`;
	if (type === 2) return `${base}Transfer`;
	if (type === 3) return `${base}Mortgage`;
	return `${base}Result`;
};

const toGetConfig = (rule) => {
	const { children } = rule;
	const base = [
		{
			id: 1,
			name: '出让结果',
			dot: false,
			number: 0,
			showNumber: false,
			status: children.gsgg_bidding,
		},
		{
			id: 2,
			name: '土地转让',
			number: 0,
			dot: false,
			showNumber: false,
			status: children.gsgg_tax,
		},
		{
			id: 3,
			name: '土地抵押',
			number: 0,
			dot: false,
			showNumber: false,
			status: children.gsgg_epb,
		},
	];
	return base.filter(item => item.status);
};
export default class Lawsuits extends React.Component {
	constructor(props) {
		super(props);
		document.title = '土地数据-监控信息';
		this.state = {
			sourceType: 1,
			isRead: 'all',
			dataSource: [],
			current: 1,
			total: 0,
			loading: true,
			manage: false,
			tabConfig: toGetConfig(props.rule),
		};
		this.condition = {};
		this.selectRow = [];
		this.tempParam = true;
	}

	componentWillMount() {
		const { tabConfig } = this.state;
		const sourceType = Tabs.Simple.toGetDefaultActive(tabConfig, 'process');
		this.setState({ sourceType });
		this.onQueryChange({}, sourceType);
		this.onUnReadCount();
		// this.setUnReadCount = setInterval(() => {
		// 	this.onUnReadCount();
		// }, 30 * 1000);
	}

	// 清除排序状态
	toClearSortStatus=() => {
		this.condition.sortColumn = '';
		this.condition.sortOrder = '';
	};

	// 获取统计信息
	toInfoCount=() => {
		if (this.tempParam) return;
		Api.infoCount({ isRead: 0 }).then((res) => {
			if (res.code === 200) {
				const { tabConfig } = this.state;
				let _tabConfig = tabConfig;
				res.data.forEach((item) => {
					if (item.sourceType === 1 || item.sourceType === 2 || item.sourceType === 3) {
						_tabConfig = _tabConfig.map((itemChild) => {
							if (itemChild.id === item.sourceType) {
								return {
									id: itemChild.id,
									name: itemChild.name,
									number: item.count,
									dot: Boolean(item.count),
									showNumber: false,
								};
							}
							return itemChild;
						});
					}
				});
				this.setState({
					tabConfig: _tabConfig,
				});
			}
		});
	};

	// 切换列表类型
	handleReadChange=(val) => {
		this.setState({ isRead: val });
		this.onQueryChange(this.condition, '', val, 1);
	};

	// 全部标记为已读
	handleAllRead=() => {
		const _this = this;
		const { sourceType, tabConfig } = this.state;

		if (tabConfig[sourceType - 1].dot) {
			Modal.confirm({
				title: '确认将所有信息全部标记为已读？',
				content: '点击确定，将为您把全部消息标记为已读。',
				iconType: 'exclamation-circle',
				onOk() {
					Api[toGetApi(sourceType, 'readAllStatus')]({})
						.then((res) => {
							if (res.code === 200) {
								_this.onQueryChange();
								_this.onUnReadCount();
							}
						});
				},
				onCancel() {
				},
			});
		} else {
			message.warning('最新信息已经全部已读，没有未读信息了');
		}
	};

	// 批量关注
	handleAttention=() => {
		if (this.selectRow.length > 0) {
			const idList = this.selectRow;
			const { dataSource, sourceType } = this.state;
			const _this = this;
			Modal.confirm({
				title: '确认关注选中的所有信息吗？',
				content: '点击确定，将为您收藏所有选中的信息',
				iconType: 'exclamation-circle',
				onOk() {
					Api[toGetApi(sourceType, 'attentionFollow')]({ idList }, true).then((res) => {
						if (res.code === 200) {
							message.success('操作成功！');
							// _this.selectRow = []; // 批量关注清空选中项
							const _dataSource = dataSource.map((item) => {
								const _item = item;
								idList.forEach((it) => {
									if (it === item.id) {
										_item.isAttention = 1;
										_item.isRead = true;
									}
								});
								return _item;
							});
							_this.setState({
								dataSource: _dataSource,
								manage: false,
							});
						}
					});
				},
				onCancel() {},
			});
		} else {
			message.warning('未选中业务');
		}
	};

	// 表格发生变化
	onRefresh=(data, type) => {
		const { dataSource } = this.state;
		const { index } = data;
		const _dataSource = dataSource;
		_dataSource[index][type] = data[type];
		this.setState({
			dataSource: _dataSource,
		});
	};

	// sourceType变化
	onSourceType=(val) => {
		const { isRead } = this.state;
		this.setState({
			sourceType: val,
			dataSource: [],
			current: 1,
			total: '',
			isRead: 'all',
		});
		this.toClearSortStatus();
		this.onQueryChange({}, val, isRead, 1);
		window.location.href = changeURLArg(window.location.href, 'process', val);
	};

	// 当前页数变化
	onPageChange=(val) => {
		const { manage } = this.state;
		// this.selectRow = [];
		this.onQueryChange('', '', '', val, manage);
	};

	// 排序触发
	onSortChange=(field, order) => {
		this.condition.sortColumn = field;
		this.condition.sortOrder = order;
		this.onQueryChange(this.condition, '', '', 1);
		this.selectRow = [];
	};

	// 查询条件变化
	onQuery =(con) => {
		this.toClearSortStatus();
		this.onQueryChange(con, '', '', 1);
	};

	// 查询条件变化
	onQueryChange=(con, _sourceType, _isRead, page, _manage) => {
		const { sourceType, isRead, current } = this.state;
		const { loading } = this.state;
		this.condition = Object.assign(con || this.condition, {
			page: page || current,
			num: 10,
		});
		const __isRead = _isRead || isRead;
		if (__isRead === 'all') { delete this.condition.isRead; }
		if (__isRead === 'unread') { this.condition.isRead = 0; }

		if (!loading) this.setState({ loading: true, manage: _manage || false });
		this.toInfoCount();
		Api[toGetApi(_sourceType || sourceType, 'infoList')](clearEmpty(this.condition)).then((res) => {
			if (res.code === 200) {
				this.setState({
					dataSource: res.data.list,
					current: res.data.page,
					total: res.data.total,
				});
			}
			this.setState({
				loading: false,
			});
		}).catch(() => {
			this.setState({
				loading: false,
			});
		});
	};

	clearSelectRowNum = () => this.selectRow = [];

	// 查询是否有未读消息
	onUnReadCount=() => {
		const { tabConfig } = this.state;
		unReadCount().then((res) => {
			const { data, code } = res;
			if (code === 200) {
				const _tabConfig = tabConfig.map((item) => {
					const _item = item;
					if (_item.id === 1)_item.dot = data.landResultFlag;
					return _item;
				});
				this.setState({ tabConfig: _tabConfig });
			}
		});
	};

	render() {
		const {
			sourceType, isRead, dataSource, current, total, tabConfig, manage, loading,
		} = this.state;
		const tableProps = {
			manage,
			dataSource,
			current,
			total,
			onSelect: val => this.selectRow = val,
			selectRow: this.selectRow,
			onRefresh: this.onRefresh,
			onPageChange: this.onPageChange,
			onSortChange: this.onSortChange,
			sortField: this.condition.sortColumn,
			sortOrder: this.condition.sortOrder,
		};

		return (
			<div className="yc-assets-auction">
				{sourceType === 1 ? <QueryResult onQueryChange={this.onQuery} clearSelectRowNum={this.clearSelectRowNum} /> : null}
				{sourceType === 2 ? <QueryTransfer onQueryChange={this.onQuery} clearSelectRowNum={this.clearSelectRowNum} /> : null}
				{sourceType === 3 ? <QueryMortgage onQueryChange={this.onQuery} clearSelectRowNum={this.clearSelectRowNum} /> : null}
				{/* 分隔下划线 */}
				<div className="yc-haveTab-hr" />
				<Tabs.Simple
					onChange={this.onSourceType}
					source={tabConfig}
					field="process"
				/>
				{
					!manage ? (
						<div className="assets-auction-action">
							<Button
								active={isRead === 'all'}
								onClick={() => this.handleReadChange('all')}
								title="全部"
							/>
							<Button
								active={isRead === 'unread'}
								onClick={() => this.handleReadChange('unread')}
								title="只显示未读"
							/>
							<Button onClick={this.handleAllRead}>全部标为已读</Button>
							<Button onClick={() => this.setState({ manage: true })}>批量管理</Button>

							<Download
								all
								text="一键导出"
								condition={() => this.condition}
								api={Api[toGetApi(sourceType, 'exportList')]}
								style={{ float: 'right' }}
							/>
						</div>
					) : (
						<div className="assets-auction-action">
							<Button onClick={this.handleAttention} title="关注" />
							<Download
								text="导出"
								field="idList"
								selectIds
								selectedRowKeys={() => this.selectRow}
								api={Api[toGetApi(sourceType, 'exportList')]}
								condition={() => Object.assign({}, this.condition, { idList: this.selectRow })}
							/>
							{/* <Button onClick={this.handleExport} title="导出" /> */}
							<Button
								onClick={() => {
									this.setState({ manage: false });
									this.selectRow = [];
								}}
								title="取消管理"
							/>
						</div>
					)
				}
				<Spin visible={loading}>
					{sourceType === 1 ? <TableResult {...tableProps} /> : null}
					{sourceType === 2 ? <TableTransfer {...tableProps} /> : null}
					{sourceType === 3 ? <TableMortgage {...tableProps} /> : null}
				</Spin>
			</div>
		);
	}
}
