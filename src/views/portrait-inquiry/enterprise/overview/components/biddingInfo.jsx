import React from 'react';
import { getBidding } from '@/utils/api/portrait-inquiry/enterprise/overview';
import { Spin } from '@/common';
import TimeLine from '../../../common/timeLine';
import getCount from '../../../common/getCount';
import './style.scss';

export default class BiddingInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			timeLineData: [],
			allTimeDate: 0,
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		const { companyId, getAssetProfile } = this.props;
		this.setState({
			loading: true,
		});
		const params = {
			companyId,
		};
		getBidding(params).then((res) => {
			if (res.code === 200) {
				const timeLineData = res.data.yearDistributions;
				this.setState({
					loading: false,
					timeLineData, // 年份分布
					allTimeDate: getCount(timeLineData),
				});
				getAssetProfile(getCount(timeLineData), 'Bidding');
			} else {
				this.setState({ loading: false });
			}
		}).catch(() => {
			this.setState({ loading: false });
		});
	};

	render() {
		const { timeLineData, loading, allTimeDate } = this.state;
		return (
			<div>
				{
					allTimeDate > 0
					&& (
						<Spin visible={loading}>
							<div className="overview-container-title">
								<div className="overview-left-item" />
								<span className="container-title-num">
									{`${allTimeDate} 条`}
								</span>
								<span className="container-title-name"> 相关招投标信息</span>
							</div>
							<div className="overview-container-content">
								{allTimeDate > 0 && <TimeLine title="年份分布" Data={timeLineData} id="Bidding" />}
							</div>
						</Spin>
					)}
			</div>
		);
	}
}
