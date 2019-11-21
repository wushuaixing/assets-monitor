import React from 'react';
import { Tabs } from '@/common';
import API from '@/utils/api/risk-monitor/operation-risk';
import { unReadCount } from '@/utils/api/monitor-info';

export default class TabsIntact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			_source: props.source,
		};
	}

	// componentDidMount() {
	// 	const { source, sourceType } = this.props;
	// 	this.toRefreshCount(source, sourceType);
	// }

	toRefreshCount=(config, type) => {
		const { onRefresh } = this.props;
		const _source =	config;
		this.toGetUnReadCount(_source);
		config.forEach((i, index) => {
			if (i.id !== type) {
				API(i.id, 'listCount')({}).then((res) => {
					if (res.code === 200) {
						_source[index].number = res.data;
						this.setState({ _source });
						if (onRefresh)onRefresh(_source);
					}
				});
			}
		});
	};

	toGetUnReadCount=(config) => {
		const { onRefresh } = this.props;
		unReadCount().then((res) => {
			const { data, code } = res;
			if (code === 200) {
				const result = config.map((item) => {
					const _item = item;
					if (_item.id === 'YC030301')_item.dot = data.companyAbnormalCount;
					if (_item.id === 'YC030302')_item.dot = data.changeFlag;
					if (_item.id === 'YC030303')_item.dot = data.companyIllegalCount;
					if (_item.id === 'YC030304')_item.dot = data.taxCount;
					if (_item.id === 'YC030305')_item.dot = data.punishmentFlag;
					if (_item.id === 'YC030306')_item.dot = data.epbCount;
					return _item;
				});
				this.setState({ _source: result });
				if (onRefresh)onRefresh(result);
			}
		});
	};

	render() {
		const { onChange, field } = this.props;
		const { _source } = this.state;
		const params = {
			source: _source,
			onChange,
			field,
		};
		return (
			<Tabs.Simple {...params} />
		);
	}
}