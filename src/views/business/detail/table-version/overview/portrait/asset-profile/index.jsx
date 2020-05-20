import React from 'react';
import {
	overviewAuction, // 债务人资产拍卖
	businessOverviewAuction, // 业务资产拍卖
	overviewLand, // 债务人土地信息
	businessOverviewLand, // 业务土地信息
	overviewIntangible, // 债务人无形资产
	businessOverviewIntangible, // 业务无形资产
	overviewSubrogation, // 债务人代位权
	businessOverviewSubrogation, // 业务代位权
	overviewStock, // 债务人股权质押
	businessOverviewStock, // 业务股权质押
	overviewMortgage, // 债务人动产抵押
	businessOverviewMortgage, // 业务动产抵押
	overviewBidding, // 债务人招投标
	businessOverviewBidding, // 业务招投标
} from '@/utils/api/professional-work/overview';
import { Spin } from '@/common';
import { getQueryByName } from '@/utils';
import { promiseAll } from '@/utils/promise';
import getCount from '@/views/portrait-inquiry/common/getCount';
import AssetsCard from '../card-components/assets-card';
import LandCard from '../card-components/land-card';
import Intangible from '../card-components/intangible-card';
import Subrogation from '../card-components/subrogation-card';
import EquityPledge from '../card-components/EquityPledge-card';
import ChattelMortgage from '../card-components/chattelMortgage-card';
import Bidding from '../card-components/bidding-card';
import './style.scss';

const constantNumber = 99999999; // 默认值
const apiType = (value, portrait) => {
	switch (value) {
	case 'Auction': return portrait === 'business' ? businessOverviewAuction : overviewAuction;
	case 'Land': return portrait === 'business' ? businessOverviewLand : overviewLand;
	case 'Intangible': return portrait === 'business' ? businessOverviewIntangible : overviewIntangible;
	case 'Subrogation': return portrait === 'business' ? businessOverviewSubrogation : overviewSubrogation;
	case 'Stock': return portrait === 'business' ? businessOverviewStock : overviewStock;
	case 'Mortgage': return portrait === 'business' ? businessOverviewMortgage : overviewMortgage;
	case 'Bidding': return portrait === 'business' ? businessOverviewBidding : overviewBidding;
	default: return {};
	}
};
export default class AssetProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			auctionPropsData: {}, // 资产拍卖
			landPropsData: {}, // 土地信息
			intangiblePropsData: {}, // 无形资产
			subrogationPropsData: {}, // 代位权
			stockPropsData: {}, // 股权质押
			mortgagePropsData: {}, // 动产抵押
			biddingPropsData: {}, // 招投标
		};
	}

	componentDidMount() {
		const urlId = getQueryByName(window.location.href, 'id') || constantNumber;
		const obligorId = urlId;
		const businessId = urlId;
		const { portrait } = this.props;
		const params = portrait === 'business' ? { businessId, type: 1 } : { obligorId, type: 1 };
		this.setState(() => ({ isLoading: true }));
		// 资产卡片列表
		this.getData(params, portrait);
	}

	getData = (value, portrait) => {
		const params = { ...value };
		const promiseArray = [];
		promiseArray.push(apiType('Auction', portrait)(params)); // 资产拍卖
		promiseArray.push(apiType('Land', portrait)(params)); // 土地信息
		promiseArray.push(apiType('Intangible', portrait)(params)); // 无形资产
		promiseArray.push(apiType('Subrogation', portrait)(params)); // 代位权
		promiseArray.push(apiType('Stock', portrait)(params)); // 股权质押
		promiseArray.push(apiType('Mortgage', portrait)(params)); // 动产抵押
		promiseArray.push(apiType('Bidding', portrait)(params)); // 招投标
		// 将传入promise.all的数组进行遍历，如果catch住reject结果，
		// 直接返回，这样就可以在最后结果中将所有结果都获取到,返回的其实是resolved
		const handlePromise = promiseAll(promiseArray.map(promiseItem => promiseItem.catch(err => err)));
		handlePromise.then((values) => {
			const isArray = Array.isArray(values) && values.length > 0;
			this.setState({ isLoading: false });
			// 资产拍卖
			this.getAuctionData(isArray, values);
			// 土地信息
			this.getLandData(isArray, values);
			// 无形资产
			this.getIntangibleData(isArray, values);
			// 代位权
			this.getSubrogationData(isArray, values);
			// 股权质押
			this.getStockData(isArray, values);
			// 动产抵押
			this.getMortgageData(isArray, values);
			// 招投标
			this.getBiddingData(isArray, values);
			// console.log('all promise are resolved', values);
		}).catch((reason) => {
			console.log('promise reject failed reason', reason);
		});
	};

	// 资产拍卖
	getAuctionData = (isArray, values) => {
		const res = values[0];
		if (isArray && res && res.code === 200) {
			const auctionPropsData = {
				auctionPropsData: res.data,
			};
			this.setState(() => ({
				auctionPropsData,
			}));
		}
	};

	// 土地信息
	getLandData = (isArray, values) => {
		const res = values[1];
		if (isArray && res && res.code === 200) {
			const dataSource = res.data.roleDistributions;
			const dataSourceNum = getCount(dataSource);
			const landPropsData = {
				dataSource,
				dataSourceNum,
				gmtCreate: res.data.gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				landPropsData,
			}));
		}
	};

	// 无形资产
	getIntangibleData = (isArray, values) => {
		const res = values[2];
		if (isArray && res && res.code === 200) {
			const dataSource = [];
			dataSource.push({ count: res.data.construct, typeName: '建造资质' });
			dataSource.push({ count: res.data.emission, typeName: '排污权发证' });
			dataSource.push({ count: res.data.mining, typeName: '矿业权发证' });
			dataSource.push({ count: res.data.trademark, typeName: '商标专利' });
			const dataSourceNum = getCount(dataSource);
			const intangiblePropsData = {
				dataSource,
				dataSourceNum,
				gmtCreate: res.data.gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				intangiblePropsData,
			}));
		}
	};

	// 代位权
	getSubrogationData = (isArray, values) => {
		const res = values[3];
		if (isArray && res && res.code === 200) {
			const {
				restore, execute, trial, judgment, courtNotice, gmtCreate,
			} = res.data;
			const allNum = trial + judgment + courtNotice;
			const otherCase = (trial + judgment + courtNotice) - execute;
			const subrogationPropsData = {
				restore,
				execute,
				allNum,
				otherCase,
				gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				subrogationPropsData,
			}));
		}
	};

	// 股权质押
	getStockData = (isArray, values) => {
		const res = values[4];
		if (isArray && res && res.code === 200) {
			const dataSource = res.data.roleDistributions;
			const dataSourceNum = getCount(dataSource);
			const stockPropsData = {
				dataSource,
				dataSourceNum,
				gmtCreate: res.data.gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				stockPropsData,
			}));
		}
	};

	// 动产抵押
	getMortgageData = (isArray, values) => {
		const res = values[5];
		if (isArray && res && res.code === 200) {
			const dataSource = res.data.roleDistributions;
			const dataSourceNum = getCount(dataSource);
			const mortgagePropsData = {
				dataSource,
				dataSourceNum,
				gmtCreate: res.data.gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				mortgagePropsData,
			}));
		}
	};

	// 招投标
	getBiddingData = (isArray, values) => {
		const res = values[6];
		if (isArray && res && res.code === 200) {
			const { bidding, gmtCreate } = res.data;
			const biddingPropsData = {
				biddingNum: bidding,
				gmtCreate,
				obligorTotal: res.data.obligorTotal || null,
			};
			this.setState(() => ({
				biddingPropsData,
			}));
		}
	};

	// 判断内部是否存数据
	isHasValue = () => {
		const { portrait } = this.props;
		const {
			auctionPropsData, landPropsData, intangiblePropsData, subrogationPropsData, stockPropsData, biddingPropsData, mortgagePropsData,
		} = this.state;
		return (Object.keys(auctionPropsData).length > 0 && auctionPropsData.auctionPropsData.count > 0) || (landPropsData.dataSourceNum > 0 && portrait !== 'debtor_personal')
			|| (intangiblePropsData.dataSourceNum > 0 && portrait !== 'debtor_personal') || subrogationPropsData.allNum > 0
			|| (stockPropsData.dataSourceNum > 0 && portrait !== 'debtor_personal') || (biddingPropsData.biddingNum > 0 && portrait !== 'debtor_personal')
			|| (mortgagePropsData.dataSourceNum > 0 && portrait !== 'debtor_personal');
	};

	render() {
		const { portrait } = this.props;
		const {
			auctionPropsData, landPropsData, intangiblePropsData, subrogationPropsData, stockPropsData, biddingPropsData, mortgagePropsData, isLoading,
		} = this.state;
		const isHasValue = this.isHasValue();
		// console.log(portrait, 13);
		return (
			<React.Fragment>
				{isHasValue ? (
					<div>
						<div className="overview-container-title" style={{ marginTop: '40px' }}>
							<div className="overview-left-item" />
							<span className="container-title-name">资产概况</span>
						</div>
						<Spin visible={isLoading}>
							<div className="overview-container-cardContent">
								{/* 资产拍卖 */}
								{Object.keys(auctionPropsData).length !== 0 && <AssetsCard dataSource={auctionPropsData} portrait={portrait} />}
								{/* 土地信息 */}
								{portrait !== 'debtor_personal' && Object.keys(landPropsData).length !== 0 && <LandCard dataSource={landPropsData} portrait={portrait} />}
								{/* 无形资产 */}
								{portrait !== 'debtor_personal' && Object.keys(intangiblePropsData).length !== 0 && <Intangible dataSource={intangiblePropsData} portrait={portrait} />}
								{/* 代位权 */}
								{Object.keys(subrogationPropsData).length !== 0 && <Subrogation dataSource={subrogationPropsData} portrait={portrait} />}
								{/* 股权质押 */}
								{portrait !== 'debtor_personal' && Object.keys(stockPropsData).length !== 0 && <EquityPledge dataSource={stockPropsData} portrait={portrait} />}
								{/* 动产抵押 */}
								{portrait !== 'debtor_personal' && Object.keys(mortgagePropsData).length !== 0 && <ChattelMortgage dataSource={mortgagePropsData} portrait={portrait} />}
								{/* 招投标 */}
								{portrait !== 'debtor_personal' && Object.keys(biddingPropsData).length !== 0 && <Bidding dataSource={biddingPropsData} portrait={portrait} />}
							</div>
						</Spin>
					</div>
				) : null}
			</React.Fragment>
		);
	}
}