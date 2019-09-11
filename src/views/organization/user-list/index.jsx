import React from 'react';
import { Select, Table, Pagination } from 'antd';
import '../style.scss';
import { formatDateTime } from '../../../utils/changeTime';
import Search from '../search';
import {
	userManageList, // liebiao
	RoleList, // 角色列表
} from '@/utils/api/organization';
import { Spin } from '@/common';

const { Option } = Select;
export default class BasicTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: {},
			columns: [
				{
					title: '账号',
					dataIndex: 'mobile',
					key: 'mobile',
					render: text => (
						<p>{text || '--'}</p>
					),
				},
				{
					title: '姓名',
					dataIndex: 'name',
					key: 'name',
					render: text => (
						<p>{text || '--'}</p>
					),
				},
				{
					title: '角色',
					dataIndex: 'groupId',
					key: 'groupId',
					render: text => (
						<p>{this.matchingRoles(text) || '--'}</p>
					),
				},
				{
					title: '上次登录',
					dataIndex: 'lastDate',
					key: 'lastDate',
					render: text => (
						<p>{formatDateTime(text) || '--'}</p>
					),
				},
				{
					title: '状态',
					dataIndex: 'isEnabled',
					key: 'isEnabled',
					render: text => (
						<React.Fragment>
							{
								text === 1 ? (
									<React.Fragment>
										<p className="circle-item">启用</p>
									</React.Fragment>

								) : (
									<React.Fragment>
										<p className="no-attention">禁用</p>
									</React.Fragment>
								)
							}
						</React.Fragment>

					),
				},
				{
					title: '操作',
					className: 'column-center',
					dataIndex: '',
					key: 'x',
					render: row => (
						<div className="table-btn">
							<a className="click-p" onClick={() => this.handleOpeanLog(row)}>操作记录</a>
						</div>
					),
				},
			],
			loading: false,
			roleData: [],
			data: [],
			total: 0,
			current: 1,
			pageSize: 10,
			role: '',
			keyword: '',
		};
	}

	componentDidMount() {
		this.getTableData();
		this.getRole();
	}

	// 获取角色类型
	getRole = () => {
		RoleList().then((res) => {
			if (res.code === 200) {
				this.setState({
					roleData: res.data,
				});
			}
		}).catch(() => {});
	}

	// 列表数据
	getTableData=(data) => {
		const params = {
			...data,
			num: 10,
		};
		this.setState({
			loading: true,
		});
		userManageList(params).then((res) => {
			if (res.code === 200) {
				this.setState({
					data: res.data.list,
					total: res.data.total,
					loading: false,
					current: data && data.page ? data.page : 1, // 翻页传选中页数，其他重置为1
				});
			}
		}).catch(() => {
			this.setState({ loading: false });
		});
	}

	// 匹配角色
	// eslint-disable-next-line consistent-return
	matchingRoles = (roleId) => {
		const { roleData } = this.state;
		if (roleData && roleData.length > 0) {
			const list = roleData.filter(item => item.id === roleId);
			return list[0].title;
		}
	}

	// page翻页
	handleChangePage=(val) => {
		const { pageSize, searchValue } = this.state;
		this.setState({
			current: val,
		});
		const params = {
			num: pageSize,
			page: val,
			...searchValue,
		};
		this.getTableData(params);
	}

	// 下拉选中
	handleChange = (id) => {
		console.log(id);
		const { keyword } = this.state;

		const params = {
			groupId: id,
			keyword,
		};
		this.setState({
			role: id,
			searchValue: params,
		});
		this.getTableData(params);
	}

	onKeyup = (e) => {
		const { role } = this.state;
		const { value } = e.target;
		const params = {
			role,
			keyword: value.trim(),
		};
		this.setState({
			keyword: value,
			searchValue: params,
		});
		if (e.keyCode === 13) {
			this.getTableData(params);
		}
	}

	clearInput = () => {
		this.setState({
			keyword: '',
		});
	}

	getSearchValue = (value) => {
		this.setState({
			searchValue: value,
		});
	}

	handleOpeanLog=(row) => {
		// 跳转详情
		console.log(row.id);
		const w = window.open('about:blank');
		w.location.href = `#/organization/operate/log?userId=${row.id}&&name=${row.name}`;
	}

	render() {
		const {
			columns, total, data, loading, current, pageSize, roleData, keyword, role,
		} = this.state;

		return (
			<div className="push-manage">
				<Search
					placeholder="姓名/手机号"
					onSearch={(val) => { this.search(val); }}
					onKeyUp={this.onKeyup}
					getTableData={this.getTableData}
					keyword={keyword}
					role={role}
					clearInput={this.clearInput}
					getSearchValue={this.getSearchValue}
				/>
				<div className="search-item">
					<p>角色：</p>
					<Select placeholder="请选择角色" size="large" allowClear onChange={this.handleChange}>
						{
							roleData && roleData.length > 0 && roleData.map(item => (
								<Option value={item.id}>{item.title}</Option>
							))
						}
					</Select>
				</div>
				<div className="table">
					<Spin visible={loading}>
						<Table
							columns={columns}
							dataSource={data}
							className="table"
							pagination={false}
						/>
						<div className="page-size">
							<Pagination
								current={current}
								pageSize={pageSize}
								total={total}
								showTotal={val => `共 ${val} 条记录`}
								showQuickJumper
								onChange={(val) => {
									this.handleChangePage(val);
								}}
							/>
						</div>
					</Spin>
				</div>
			</div>
		);
	}
}
