import React from 'react';
import { navigateDetail } from '@/utils';
import Card from '../card';
import './style.scss';

const hasCountStyle = { width: '366px', height: '175px', marginBottom: '20px' };
export default class LimitHeightCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			portrait, dataSource: {
				gmtModified, limitHeightCount, haveRemovedCount, obligorTotal,
			},
		} = this.props;
		return (
			<React.Fragment>
				{limitHeightCount > 0 ? (
					<Card
						Risk
						portrait={portrait}
						obligorTotal={obligorTotal}
						IconType="limit"
						IconColor={{ color: '#b927a6' }}
						customStyle={hasCountStyle}
						count={limitHeightCount}
						gmtCreate={gmtModified}
						obligorName="人匹配到限制高消费信息"
						text="限制高消费"
						onClick={() => navigateDetail('e-risk-limit')}
						styleName="limit-card"
					>
						<div className="business-limit-card">
							限高记录：
							<span className="business-limit-card-num">{limitHeightCount}</span>
							（已移除
							<span className="business-limit-card-num">
								{haveRemovedCount || 0}
							</span>
							条）
						</div>
					</Card>
				) : null}
			</React.Fragment>
		);
	}
}
