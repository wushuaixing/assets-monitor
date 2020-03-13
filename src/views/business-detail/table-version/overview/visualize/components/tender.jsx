import React from 'react';
import { overviewBidding } from 'api/detail/overview';
import TimeLine from '@/views/portrait-inquiry/common/timeLine';
import { Spin } from '@/common';
import getCount from '@/views/portrait-inquiry/common/getCount';
import './style.scss';

export default class Bankruptcy extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			timeLineData: [],
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		const { obligorId, getAssetProfile } = this.props;
		this.setState({
			loading: true,
		});
		const params = {
			obligorId,
			type: 2,
		};
		overviewBidding(params).then((res) => {
			if (res.code === 200) {
				const timeLineData = res.data.yearDistributions;
				const allNum = getCount(timeLineData);
				getAssetProfile(allNum, 'Bidding');
				this.setState({
					loading: false,
					timeLineData, // 年份分布
				});
			} else {
				this.setState({ loading: false });
			}
		}).catch(() => {
			this.setState({ loading: false });
		});
	};

	render() {
		const { timeLineData, loading } = this.state;
		return (
			<div>
				{
					getCount(timeLineData) > 0
					&& (
						<Spin visible={loading}>
							<div className="overview-container-title">
								<div className="overview-left-item" />
								<span className="container-title-num">
									{`${getCount(timeLineData)} 条`}
								</span>
								<span className="container-title-name">相关招投标信息</span>
							</div>
							<div className="overview-container-content">
								{getCount(timeLineData) > 0 && <TimeLine title="年份分布" Data={timeLineData} id="ChattelMortgage" />}
							</div>
						</Spin>
					)}
			</div>
		);
	}
}
