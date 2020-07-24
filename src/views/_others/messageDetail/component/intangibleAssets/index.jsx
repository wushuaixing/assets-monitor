import React, { Component } from 'react';
import '../../style.scss';
import Sewage from './sewage';
import Mining from './mining';
import Trademark from './trademark';
import Building from './building';

class IntangibleAssets extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const {
			id, title, total, childrenCount,
		} = this.props;
		const config = childrenCount && childrenCount.filter(item => item.count > 0);
		return (
			<React.Fragment>
				<div className="messageDetail-table-title" id={id}>
					{title}
					<span className="messageDetail-table-total">{total}</span>
				</div>
				<div className="messageDetail-table-headerLine" />
				<div className="messageDetail-table-container">
					{
						config && config.map(item => (
							item.count > 0
							&& (
								<div>
									<div className="messageDetail-table-subTitle" style={{ width: parseInt(item.name.length * 10 + 35, 10) }}>
										{item.name}
										<span>{item.count}</span>
									</div>
									{ item.datatype === 10801 && <Sewage />}
									 { item.datatype === 10802 && <Mining />}
									 { item.datatype === 10803 && <Trademark />}
									 { item.datatype === 10804 && <Building />}
								</div>
							)
						))
					}
				</div>
			</React.Fragment>
		);
	}
}

export default IntangibleAssets;
