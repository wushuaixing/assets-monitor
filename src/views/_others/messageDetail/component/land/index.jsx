import React, { Component } from 'react';
import PropTypes from 'reactPropTypes';
import '../../style.scss';
import Sell from './sell';
import Transfer from './transfer';
import Pledge from './pledge';

class Land extends Component {
	constructor(props) {
		super(props);
		this.state = {
			obligorId: props.obligorId,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { obligorId } = this.props;
		if (nextProps.obligorId !== obligorId) {
			this.setState({
				obligorId: nextProps.obligorId,
			});
		}
	}

	render() {
		const {
			id, title, total, childrenCount, stationId,
		} = this.props;
		const { obligorId } = this.state;
		const peopleProps = {
			stationId,
			obligorId,
		};
		const config = childrenCount && childrenCount.filter(item => item.count > 0);
		return (
			<React.Fragment>
				{
					config.length > 0 && (
						<React.Fragment>
							<div className="messageDetail-table-title" id={id}>
								{title}
								<span className="messageDetail-table-total">{total}</span>
							</div>
							<div className="messageDetail-table-headerLine" />
							<div className="messageDetail-table-container">
								{
									config.map(item => (
										item.count > 0
										&& (
											<div>
												<div className="messageDetail-table-subTitle" style={{ width: parseInt(item.name.length * 10 + 35, 10) }}>
													{item.name}
													<span>{item.count}</span>
												</div>
												{ item.dataType === 10301 && <Sell dataType={10301} {...peopleProps} />}
												{ item.dataType === 10302 && <Transfer dataType={10302} {...peopleProps} />}
												{ item.dataType === 10303 && <Pledge dataType={10303} {...peopleProps} />}
											</div>
										)
									))
								}
							</div>
						</React.Fragment>
					)
				}
			</React.Fragment>
		);
	}
}

Land.propTypes = {
	obligorId: PropTypes.number,
	id: PropTypes.string,
	total: PropTypes.number,
	stationId: PropTypes.number,
	title: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	childrenCount: PropTypes.array,
};

Land.defaultProps = {
	obligorId: 0,
	total: 0,
	stationId: 0,
	id: 'message-land',
	title: '土地信息',
	childrenCount: [],
};

export default Land;
