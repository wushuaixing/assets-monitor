import React from 'react';
import { overviewAuction } from 'api/detail/overview';
import TagSide from '@/views/portrait-inquiry/common/checkBtn';
import ColumnarEcharts from '@/views/portrait-inquiry/common/columnarEcharts';
import RingEcharts from '@/views/portrait-inquiry/common/ringEcharts';
import { Spin } from '@/common';

export default class AssetAuction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			all: {},
			threeMonth: {},
			selectType: '',
			columnarData: [],
			RingData: [],
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
		overviewAuction(params).then((res) => {
			if (res.code === 200) {
				this.setState({
					columnarData: res.data.auctionInfos[1].count > 0 ? res.data.auctionInfos[1].roleDistributions : res.data.auctionInfos[0].roleDistributions,
					RingData: res.data.auctionInfos[1].count > 0 ? res.data.auctionInfos[1].auctionResults : res.data.auctionInfos[0].auctionResults,
					all: res.data.auctionInfos[0],
					threeMonth: res.data.auctionInfos[1],
					selectType: res.data.auctionInfos[1].count > 0 ? 'threeMonth' : 'all',
					loading: false,
				});
				getAssetProfile(res.data.auctionInfos[0].count, 'AssetAuction');
			} else {
				this.setState({ loading: false });
			}
		})
			.catch(() => {
				this.setState({ loading: false });
			});
	};

	checkTime = (selectType) => {
		const { all, threeMonth } = this.state;
		if (selectType === 'threeMonth') {
			this.setState({
				selectType,
				columnarData: threeMonth.roleDistributions,
				RingData: threeMonth.auctionResults,
			});
		} else if (selectType === 'all') {
			this.setState({
				selectType,
				columnarData: all.roleDistributions,
				RingData: all.auctionResults,
			});
		}
	};

	render() {
		const {
			columnarData, RingData, selectType, loading, all, threeMonth,
		} = this.state;

		return (
			<div>
				{
					all.count > 0 ? (
						<Spin visible={loading}>
							<div className="overview-container-title">
								<div className="overview-left-item" />
								<span className="container-title-num">
									{`${all.count} 条`}
								</span>
								<span className="container-title-name">相关资产拍卖</span>
							</div>
							<div className="overview-container-content">
								<div style={{ marginBottom: 20 }}>
									<TagSide
										content="三个月内"
										num={threeMonth.count}
										onClick={() => {
											if (threeMonth.count > 0) {
												this.checkTime('threeMonth');
											}
										}}
										tag={selectType === 'threeMonth' ? 'yc-tag-active' : ''}
									/>
									<TagSide
										content="全部"
										num={all.count}
										onClick={() => {
											if (all.count > 0) {
												this.checkTime('all');
											}
										}}
										tag={selectType === 'all' ? 'yc-tag-active' : ''}
									/>
									{/* <Button disabled={threeMonth && threeMonth.count === 0} type={selectType === 'threeMonth' ? 'warning' : 'select'} onClick={() => this.checkTime('threeMonth')}> */}
									{/*	{`三个月内 ${threeMonth.count}`} */}
									{/* </Button> */}
									{/* <Button disabled={all && all.count === 0} type={selectType === 'all' ? 'warning' : 'select'} onClick={() => this.checkTime('all')}> */}
									{/*	{`全部 ${all.count}`} */}
									{/* </Button> */}
								</div>
								<div style={{ marginBottom: 20 }}>
									<ColumnarEcharts title="角色分布" Data={columnarData} id="assetAuction" />
								</div>
								<RingEcharts title="拍卖结果分布" Data={RingData} id="assetAuction" />
							</div>
						</Spin>
					) : null
				}
			</div>
		);
	}
}