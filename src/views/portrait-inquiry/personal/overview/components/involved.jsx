import React from 'react';
import ColumnarEcharts from '../../../common/columnarEcharts';
import RingEcharts from '../../../common/ringEcharts';
import TimeLine from '../../../common/timeLine';
import { getLitigation } from '@/utils/api/portrait-inquiry/personal/overview';
import { getQueryByName } from '@/utils';
import getCount from '../../../common/getCount';

export default class Subrogation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columnarData: [],
			RingData: [],
			timeLineData: [],
			allNum: 0,
			colorArray: ['#45A1FF', '#4DCAC9', '#FCD44A', '#F2657A'],
		};
		this.info = {
			obligorName: getQueryByName(window.location.href, 'name'),
			obligorNumber: getQueryByName(window.location.href, 'num'),
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		const params = this.info;
		const { getAssetProfile } = this.props;
		getLitigation(params)
			.then((res) => {
				if (res.code === 200) {
					const timeLineData = res.data.litigationInfo.yearDistributions;
					const columnarData = res.data.litigationInfo.caseReasons;
					const RingData = res.data.litigationInfo.caseTypes;
					const allNum = res.data.litigationInfo.count;
					getAssetProfile(allNum, 'Involved', false);
					this.setState({
						allNum,
						RingData,
						columnarData,
						timeLineData,
					});
				} else {
					// this.setState({ loading: false });
				}
			})
			.catch(() => {
				// this.setState({ loading: false });
			});
	}

	render() {
		const {
			columnarData, RingData, timeLineData, colorArray, allNum,
		} = this.state;

		return (
			<div>
				<div>
					{
						columnarData && RingData && getCount(timeLineData) > 0 && getCount(columnarData) > 0 && RingData && getCount(RingData) > 0 && (
						<div>
							<div className="overview-container-title">
								<div className="overview-left-item" />
								<span className="container-title-num">
									{`${allNum || '-'} 条`}
								</span>
								<span className="container-title-name">涉诉信息 (涉诉文书)</span>
							</div>
							<div className="overview-container-content">
								{timeLineData && getCount(timeLineData) > 0 && <TimeLine title="年份分布" Data={timeLineData} id="subrogation" />}
								{columnarData && getCount(columnarData) > 0 && <ColumnarEcharts title="案由分布" Data={columnarData} id="subrogation" />}
								{RingData && getCount(RingData) > 0 && <RingEcharts title="案件类型分布" Data={RingData} id="subrogation" colorArray={colorArray} />}
							</div>
						</div>
						)
					}
				</div>

			</div>
		);
	}
}