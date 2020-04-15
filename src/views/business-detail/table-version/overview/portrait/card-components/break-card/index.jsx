import React from 'react';
import { overviewIntangible } from '@/utils/api/professional-work/overview';
import { getQueryByName } from '@/utils';
import getCount from '@/views/portrait-inquiry/common/getCount';
import breakImg from '@/assets/img/business/breakCard.png';
import Card from '../card';
import './style.scss';

export default class Break extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			dataSourceNum: 0,
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		const obligorId = getQueryByName(window.location.href, 'id') || 326740;
		const params = {
			obligorId,
			type: 1,
		};
		// 业务列表信息
		overviewIntangible(params).then((res) => {
			if (res.code === 200) {
				const dataSource = [];
				dataSource.push({ count: res.data.construct, typeName: '建造资质' });
				dataSource.push({ count: res.data.emission, typeName: '排污权发证' });
				dataSource.push({ count: res.data.mining, typeName: '矿业权发证' });
				dataSource.push({ count: res.data.trademark, typeName: '商标专利' });
				const dataSourceNum = getCount(dataSource);
				this.setState({
					dataSource,
					dataSourceNum,
				});
			}
		}).catch(() => {
			this.setState({
				dataSource: [],
			});
		});
	};

	render() {
		const { dataSource, dataSourceNum } = this.state;
		const isArray = dataSource && Array.isArray((dataSource)) && dataSource.length > 0;
		const newDataSource = isArray && dataSource.filter(i => i.count > 0);
		return (
			<React.Fragment>
				{dataSourceNum > 0
					? (
						<Card
							imgCard={breakImg}
							count={dataSourceNum}
							gmtCreate={dataSource.gmtCreate}
							customStyle={{ width: '366px', height: '120px', marginBottom: '20px' }}
							text="失信记录"
							styleName="intangible-card"
						>
							<div className="card-content">
								<div className="card-content-role">
									{
										newDataSource && newDataSource.map((item, index) => {
											if (index > 1) {
												return (
													<div className="card-content-role-itemRight">
														<span className="card-content-role-text">{item.typeName}</span>
														<span className="card-content-role-info">：</span>
														<span className="card-content-role-num">
															<span className="portrait-card-num">{item.count}</span>
															条
														</span>
													</div>
												);
											}
											return (
												<div className="card-content-role-itemLeft">
													<span className="card-content-role-text">{item.typeName}</span>
													<span className="card-content-role-info">：</span>
													<span className="card-content-role-num">
														<span className="portrait-card-num">{item.count}</span>
														条
													</span>
												</div>
											);
										})
									}
								</div>
							</div>
						</Card>
					) : null
				}
			</React.Fragment>
		);
	}
}