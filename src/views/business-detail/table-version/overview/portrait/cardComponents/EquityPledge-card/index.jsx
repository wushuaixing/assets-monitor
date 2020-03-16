import React from 'react';
import { overviewStock } from 'api/detail/overview';
import { getQueryByName } from '@/utils';
import getCount from '@/views/portrait-inquiry/common/getCount';
import EquityPledgeImg from '@/assets/img/business/EquityPledgeCard.png';
import Card from '../card';
import './style.scss';

export default class EquityPledge extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			dataSourceNum: 0,
			gmtCreate: '',
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		const obligorId = getQueryByName(window.location.href, 'id') || 348812;
		const params = {
			obligorId,
			type: 1,
		};
		// 业务列表信息
		overviewStock(params).then((res) => {
			if (res.code === 200) {
				const dataSource = res.data.roleDistributions;
				const dataSourceNum = getCount(dataSource);
				this.setState({
					dataSource,
					dataSourceNum,
					gmtCreate: res.data.gmtCreate,
				});
			}
		}).catch(() => { this.setState({ dataSource: [] }); });
	};

	render() {
		const { dataSource, dataSourceNum, gmtCreate } = this.state;
		const isArray = dataSource && Array.isArray((dataSource)) && dataSource.length > 0;
		const newDataSource = isArray && dataSource.filter(i => i.count > 0);
		return (
			<span>
				{dataSourceNum > 0 ? (
					<Card
						imgCard={EquityPledgeImg}
						count={dataSourceNum}
						gmtCreate={gmtCreate}
						customStyle={{ width: '366px', height: '120px', marginBottom: '20px' }}
						text="股权质押"
						styleName="equityPledge-card"
					>
						<div className="card-content">
							<div className="card-content-role">
								{
									newDataSource && newDataSource.map(item => (
										<div className="card-content-role-itemLeft" key={item.type}>
											<span className="card-content-role-text">{item.type === 1 ? '股权持有人' : '股权质权人'}</span>
											<span className="card-content-role-info">：</span>
											<span className="card-content-role-num">
												{item.count}
												条
											</span>
										</div>
									))
								}
							</div>
						</div>
					</Card>
				) : null}
			</span>
		);
	}
}