import React, { PureComponent } from 'react';
import { navigate } from '@reach/router';
import { Spin } from '@/common';
import {
	auctionCard, landCard, intangibleCard, subrogationCard, stockCard, mortgageCard, financeCard, biddingCard,
} from '@/utils/api/monitor-info/excavate/index';
import getCount from '@/views/portrait-inquiry/common/getCount';
import { promiseAll } from '@/utils/promise';
import {
	AssetCard, LandCard, Intangible, Subrogation, Stock, Chattel, Finance, Bidding,
} from '../components';
import './style.scss';

export default class Excavate extends PureComponent {
	constructor(props) {
		super(props);
		document.title = '资产挖掘';
		// console.log(props.rule);
		const isRule = props && props.rule && props.rule.children;
		this.state = {
			config: [
				{
					id: 1,
					title: '资产拍卖',
					rule: isRule && props.rule.children.zcwjzcpm,
					url: '/monitor?process=1',
					Component: AssetCard,
					API: auctionCard,
				},
				{
					id: 2,
					title: '土地信息',
					rule: isRule && props.rule.children.zcwjtdsj,
					url: '/monitor/land',
					Component: LandCard,
					API: landCard,
				},
				{
					id: 3,
					title: '无形资产',
					rule: isRule && props.rule.children.zcwjwxzc,
					url: '/monitor/intangible',
					Component: Intangible,
					API: intangibleCard,
				},
				{
					id: 4,
					title: '代位权',
					rule: isRule && props.rule.children.zcwjdwq,
					url: '/monitor/subrogation',
					Component: Subrogation,
					API: subrogationCard,
				},
				{
					id: 5,
					title: '股权质押',
					rule: isRule && props.rule.children.zcwjzcpm,
					url: '/risk/operation',
					Component: Stock,
					API: stockCard,
				},
				{
					id: 6,
					title: '动产抵押',
					rule: isRule && props.rule.children.zcwjdcdy,
					url: '/monitor/mortgage',
					Component: Chattel,
					API: mortgageCard,
				},
				{
					id: 7,
					title: '金融资产',
					rule: isRule && props.rule.children.zcwjjrzj,
					url: '/monitor/financial',
					Component: Finance,
					API: financeCard,
				},
				{
					id: 8,
					title: '招投标',
					rule: isRule && props.rule.children.zcwjzbzb,
					url: '/monitor/tender',
					Component: Bidding,
					API: biddingCard,
				},
			].filter(i => this.isObject(i.rule)),
			loading: false,
			auctionPropsData: {},
			landPropsData: {},
			intangiblePropsData: {},
			subrogationPropsData: {},
			stockPropsData: {},
			mortgagePropsData: {},
			financePropsData: {},
			biddingPropsData: {},
			auctionCount: undefined,
			landCount: undefined,
			intangibleCount: undefined,
			subrogationCount: undefined,
			stockCount: undefined,
			mortgageCount: undefined,
			financeCount: undefined,
			biddingCount: undefined,
		};
	}

	componentDidMount() {
		// 资产卡片列表
		this.getData();
	}

	getData = () => {
		const excavate = new Map([
			['asset', this.getAuctionData],
			['land', this.getLandData],
			['intangible', this.getIntangibleData],
			['subrogation', this.getSubrogationData],
			['stock', this.getStockData],
			['mortgage', this.getMortgageData],
			['finance', this.getFinanceData],
			['bidding', this.getBiddingData],
			['default', () => { console.log('未匹配'); }],
		]);

		const promiseArray = [];
		const { config } = this.state;
		config.forEach((item) => {
			promiseArray.push(item.API());
		});
		// 将传入promise.all的数组进行遍历，如果catch住reject结果，
		// 直接返回，这样就可以在最后结果中将所有结果都获取到,返回的其实是resolved
		// console.log(promiseArray, 123);
		const handlePromise = promiseAll(promiseArray.map(promiseItem => promiseItem.catch(err => err)));
		this.setState({ loading: true });
		handlePromise.then((res) => {
			const isArray = Array.isArray(res) && res.length > 0;
			this.setState({ loading: false });
			if (isArray) {
				res.forEach((item) => {
					const excavateMap = excavate.get(item.name) || excavate.get('default');
					excavateMap.call(this, item);
				});
			}
			// console.log('all promise are resolved', values);
		}).catch((reason) => {
			this.setState({ loading: false });
			console.log('promise reject failed reason', reason);
		});
	};

	// 资产拍卖
	getAuctionData = (res) => {
		if (res && res.code === 200) {
			const dataSource = [];
			dataSource.push({ count: res.data.assetOwner || 0, typeName: '资产所有人' });
			dataSource.push({ count: res.data.bidder || 0, typeName: '竞买人' });
			dataSource.push({ count: res.data.creditor || 0, typeName: '债权人' });
			dataSource.push({ count: res.data.assetClue || 0, typeName: '财产线索' });
			dataSource.push({ count: res.data.unknown || 0, typeName: '未知角色' });
			const dataSourceNum = getCount(dataSource);
			const auctionPropsData = {
				auctionArray: dataSource,
				totalCount: dataSourceNum,
				assetTotal: res.data.assetTotal,
				gmtUpdate: res.data.gmtUpdate,
			};
			this.setState(() => ({
				auctionPropsData,
				auctionCount: dataSourceNum,
			}));
		}
	};

	// 土地信息
	getLandData = (res) => {
		if (res && res.code === 200) {
			const {
				gmtUpdate, mortgagee, mortgageeAmount, owner, ownerAmount,
			} = res.data;
			const dataSourceNum = Number(mortgagee || 0) + Number(owner || 0);
			const landPropsData = {
				gmtUpdate,
				mortgagee, // 抵押权人
				mortgageeAmount, // 抵押额
				owner, // 使用权人
				ownerAmount, // 土地价值
				totalCount: dataSourceNum,
			};
			this.setState(() => ({
				landPropsData,
				landCount: dataSourceNum,
			}));
		}
	};

	// 无形资产
	getIntangibleData = (res) => {
		if (res && res.code === 200) {
			const dataSource = [];
			dataSource.push({ count: res.data.emission || 0, typeName: '排污权发证' });
			dataSource.push({ count: res.data.trademark || 0, typeName: '商标专利' });
			dataSource.push({ count: res.data.mining || 0, typeName: '矿业权发证' });
			dataSource.push({ count: res.data.construct || 0, typeName: '建造资质' });
			const dataSourceNum = getCount(dataSource);
			const intangiblePropsData = {
				intangibleArray: dataSource,
				totalCount: dataSourceNum,
				gmtUpdate: res.data.gmtUpdate,
			};
			this.setState(() => ({
				intangiblePropsData,
				intangibleCount: dataSourceNum,
			}));
		}
	};

	// 代位权
	getSubrogationData = (res) => {
		if (res && res.code === 200) {
			const {
				courtNotice, execute, trial, judgment, restore, gmtUpdate,
			} = res.data;
			const dataSourceNum = trial + judgment + courtNotice;
			const otherCase = (trial + judgment + courtNotice) - execute;
			const subrogationPropsData = {
				restore,
				execute,
				otherCase,
				gmtUpdate,
				totalCount: dataSourceNum,
			};
			this.setState(() => ({
				subrogationPropsData,
				subrogationCount: dataSourceNum,
			}));
		}
	};

	// 股权质押
	getStockData = (res) => {
		if (res && res.code === 200) {
			const { stockOwner, stockUser, gmtUpdate } = res.data;
			const totalCount = stockOwner + stockUser;
			const stockPropsData = {
				totalCount,
				stockOwner,
				stockUser,
				gmtUpdate,
			};
			this.setState(() => ({
				stockPropsData,
				stockCount: totalCount,
			}));
		}
	};

	// 动产抵押
	getMortgageData = (res) => {
		if (res && res.code === 200) {
			const {
				owner, people, peopleAmount, gmtUpdate,
			} = res.data;

			const totalCount = owner + people;
			const mortgagePropsData = {
				totalCount,
				peopleAmount,
				owner,
				people,
				gmtUpdate,
			};
			this.setState(() => ({
				mortgagePropsData,
				mortgageCount: totalCount,
			}));
		}
	};

	// 金融资产
	getFinanceData = (res) => {
		if (res && res.code === 200) {
			const {
				auctionBidding, finance, gmtUpdate,
			} = res.data;

			const totalCount = auctionBidding + finance;
			const financePropsData = {
				totalCount,
				auctionBidding,
				finance,
				gmtUpdate,
			};
			this.setState(() => ({
				financePropsData,
				financeCount: totalCount,
			}));
		}
	};

	// 招投标
	getBiddingData = (res) => {
		if (res && res.code === 200) {
			const { bidding, gmtUpdate } = res.data;
			const biddingPropsData = {
				bidding,
				totalCount: bidding,
				gmtUpdate,
			};
			this.setState(() => ({
				biddingPropsData,
				biddingCount: bidding,
			}));
		}
	};

	isObject = value => value != null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';

	handleNavigate = (url) => { navigate(url); };

	getNumber = (arr) => {
		let sum = 0;
		const newArr = arr && Array.isArray(arr) && arr.length > 0;
		const arrTotalArr = newArr && arr.filter(item => item !== undefined);
		arrTotalArr.forEach((ele) => {
			sum += ele;
		});
		return sum;
	};

	render() {
		const {
			config, loading, auctionPropsData, landPropsData, intangiblePropsData, subrogationPropsData, stockPropsData, mortgagePropsData, financePropsData, biddingPropsData,
			auctionCount, landCount, intangibleCount, subrogationCount, stockCount, mortgageCount, financeCount, biddingCount,
		} = this.state;

		const allNumber = this.getNumber([auctionCount, landCount, intangibleCount, subrogationCount, stockCount, mortgageCount, financeCount, biddingCount]);
		// 权限过滤
		// const ruleResultArr = config.filter(i => this.isObject(i.rule));
		const params = {
			auctionPropsData,
			landPropsData,
			intangiblePropsData,
			subrogationPropsData,
			stockPropsData,
			mortgagePropsData,
			financePropsData,
			biddingPropsData,
		};
		return (
			<Spin visible={loading} minHeight={540}>
				<div className="monitor-excavate-container">
					{!loading && allNumber === 0 ?	(
						<div className="monitor-excavate-container-nodata">
						暂未匹配到资产线索信息，建议
							<span className="monitor-excavate-container-findMore" onClick={() => this.handleNavigate('/business')}>去导入更多债务人</span>
						，以匹配更多价值信息
						</div>
					) : null}
					{
						loading ? null : config.map(Item => <Item.Component {...params} title={Item.title} url={Item.url} />)
					}
				</div>
			</Spin>
		);
	}
}
