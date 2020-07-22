import React, { Component } from 'react';
import { markRead } from '@/utils/api/message';
import TableMortgage from '@/views/asset-excavate/chattel-mortgage/table';

class ChattelMortgage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
		};
	}

	componentDidMount() {
		this.setState({
			dataSource: [],
		});
	}

	onPageChange = () => {

	};

	// 表格变化，刷新表格
	onRefresh = (data, type) => {
		const { dataSource } = this.state;
		const { index } = data;
		const _dataSource = dataSource;
		_dataSource[index][type] = data[type];
		this.setState({
			dataSource: _dataSource,
		});
	};

	toRowClick = (record, index) => {
		const { id, isRead } = record;
		if (!isRead) {
			markRead({ id }).then((res) => {
				if (res.code === 200) {
					this.onRefresh({ id, isRead: !isRead, index }, 'isRead');
				}
			});
		}
	};

	render() {
		const {
			id, title, total,
		} = this.props;
		const { dataSource } = this.state;
		const tableProps = {
			noSort: true,
			dataSource,
			onPageChange: this.onPageChange,
			onRefresh: this.onRefresh,
			maxLength: 5,
		};
		return (
			<React.Fragment>
				<div className="messageDetail-table-title" id={id}>
					{title}
					<span className="messageDetail-table-total">{total}</span>
				</div>
				<div className="messageDetail-table-headerLine" />
				<div className="messageDetail-table-container">
					<TableMortgage {...tableProps} />
				</div>
			</React.Fragment>
		);
	}
}
export default ChattelMortgage;
