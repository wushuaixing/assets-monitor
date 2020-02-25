import React from 'react';
import { Bankruptcy } from '@/views/risk-monitor/operation-risk/table-version';
import { toGetNumber } from '@/utils/promise';

export default class BankruptcyIntact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: toGetNumber(props.data, 30201),
		};
	}

	render() {
		const { id } = this.props;
		const { count } = this.state;
		return (
			<div className="yc-inquiry-public-table" id={id}>
				<div className="public-table-tab">
					<div className="yc-tabs-simple-prefix">{`破产重组 ${count || 0}`}</div>
				</div>
				<div className="inquiry-public-table">
					<Bankruptcy />
				</div>
			</div>
		);
	}
}
