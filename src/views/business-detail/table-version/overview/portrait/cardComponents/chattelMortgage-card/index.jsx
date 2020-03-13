import React from 'react';
import { overviewMortgage } from 'api/detail/overview';
import { getQueryByName } from '@/utils';
import { toThousands } from '@/utils/changeTime';
import getCount from '@/views/portrait-inquiry/common/getCount';
import chattelMortgageImg from '@/assets/img/business/chattelMortgageCard.png';
import Card from '../card';
import './style.scss';

export default class ChattelMortgage extends React.Component {
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
		const obligorId = getQueryByName(window.location.href, 'id') || 348897;
		const params = {
			obligorId,
			type: 1,
		};
		// 业务列表信息
		overviewMortgage(params).then((res) => {
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
						imgCard={chattelMortgageImg}
						count={dataSourceNum}
						gmtCreate={gmtCreate}
						customStyle={{ width: '366px', height: '120px', marginBottom: '20px' }}
						text="动产抵押"
						styleName="chattelMortgage-card"
					>
						<div className="card-content">
							<div className="card-content-role">
								{
									newDataSource && newDataSource.map(item => (
										<div className="card-content-role-itemLeft" key={item.type} style={item.amount && item.amount > 100000000 ? { position: 'relative', left: '-20px' } : {}}>
											<span className="card-content-role-text">{item.type === 1 ? '抵押物所有人' : '抵押权人'}</span>
											<span className="card-content-role-info">：</span>
											<span className="card-content-role-num">
												{item.count}
												条
											</span>
											{item.type === 2 && item.amount ? (
												<span style={{ paddingLeft: '5px' }}>
													(涉及债权额
													<span style={{ color: '#FB5A5C', padding: '0 5px' }}>{ toThousands(item.amount)}</span>
													元)
												</span>
											) : null}
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
