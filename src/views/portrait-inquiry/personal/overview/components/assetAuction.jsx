import React from 'react';
import { ColumnarEcharts, RingEcharts, Button } from '@/common';

export default class AssetAuction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columnarData: [
				{ value: 8, name: '资产所有人' },
				{ value: 12, name: '债权人' },
				{ value: 9, name: '竞买人' },
				{ value: 9, name: '资产线索' },
			],
			RingData: [
				{ value: 20, name: '已成交' },
				{ value: 14, name: '正在进行' },
				{ value: 10, name: '即将开始' },
				{ value: 5, name: '已流拍' },
			],
			colorArray: ['#45A1FF', '#4DCAC9', '#59C874', '#FCD44A', '#F2657A', '#965EE3'],
		};
	}

	checkTime = (time) => {
		if (time === 'threeMonth') {
			this.setState({
				columnarData: [
					{ value: 8, name: '资产所有人' },
					{ value: 12, name: '债权人' },
					{ value: 9, name: '竞买人' },
					{ value: 9, name: '资产线索' },
				],
				RingData: [
					{ value: 20, name: '已成交' },
					{ value: 14, name: '正在进行' },
					{ value: 10, name: '即将开始' },
					{ value: 5, name: '已流拍' },
				],
			});
		} else if (time === 'all') {
			this.setState({
				columnarData: [
					{ value: 18, name: '资产所有人' },
					{ value: 12, name: '债权人' },
					{ value: 10, name: '竞买人' },
					{ value: 9, name: '资产线索' },
					{ value: 19, name: '股权分布' },
				],
				RingData: [
					{ value: 20, name: '已成交' },
					{ value: 14, name: '正在进行' },
					{ value: 10, name: '即将开始' },
					{ value: 5, name: '已流拍' },
					{ value: 7, name: '中止' },
					{ value: 6, name: '撤回' },
				],
			});
		}
	}

	render() {
		const { columnarData, RingData, colorArray } = this.state;
		return (
			<div>
				<div className="overview-container-title">
					<div className="overview-left-item" />

					<span className="container-title-num">12条</span>
					<span className="container-title-name">相关资产拍卖</span>
				</div>
				<div className="overview-container-content">
					<div style={{ marginBottom: 20 }}>
						<Button style={{ marginRight: 10 }} onClick={() => this.checkTime('threeMonth')}>三个月内 8</Button>
						<Button onClick={() => this.checkTime('all')}>全部 12</Button>
					</div>
					<ColumnarEcharts title="角色分布" Data={columnarData} id="assetAuction" />
					<RingEcharts title="拍卖结果分布" Data={RingData} id="assetAuction" colorArray={colorArray} />
				</div>
			</div>
		);
	}
}
