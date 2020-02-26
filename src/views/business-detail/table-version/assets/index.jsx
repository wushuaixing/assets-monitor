import React from 'react';
import { Button, NoContent, Spin } from '@/common';
import { roleState } from '@/utils/rule';
import Auction from './auction';
import Subrogation from './subrogation';
import Land from './land';
import Intangible from './intangible';
import Stock from './stock';
import Chattel from './chattel';
import Bidding from './bidding';

const toGetTotal = (field, data) => {
	let count = 0;
	const reg = new RegExp(field);
	data.forEach((item) => {
		if (reg.test(item.id)) {
			count += item.field ? item.data[item.field] : item.data;
		}
	});
	return count;
};

const subItems = data => ([
	{
		id: 10100,
		baseId: 1010,
		name: '资产拍卖',
		total: data ? toGetTotal('1010', data) : 0,
		info: data ? data.filter(i => /1010/.test(i.id)) : '',
		tagName: 'e-assets-auction',
		component: Auction,
		role: roleState('zcwj', 'zcpm'),
	},
	{
		id: 10200,
		baseId: 1020,
		name: '代位权',
		total: data ? toGetTotal('1020', data) : 0,
		info: data ? data.filter(i => /1020/.test(i.id)) : '',
		tagName: 'e-assets-subrogation',
		component: Subrogation,
		role: roleState('zcwj', 'dwq'),

	},
	{
		id: 10300,
		baseId: 1030,
		name: '土地信息',
		total: data ? toGetTotal('1030', data) : 0,
		info: data ? data.filter(i => /1030/.test(i.id)) : '',
		tagName: 'e-assets-land',
		component: Land,
		role: roleState('zcwj', 'tdsj'),

	},
	{
		id: 10400,
		baseId: 1040,
		name: '无形资产',
		total: data ? toGetTotal('1040', data) : 0,
		info: data ? data.filter(i => /1040/.test(i.id)) : '',
		disabled: true,
		tagName: 'e-assets-intangible',
		component: Intangible,
		role: roleState('zcwj', 'wxzc'),
	},
	// {
	// 	id: 10500,
	// baseId: 1050,
	// 	name: '股权质押',
	// 	total: data ? toGetTotal('1050', data) : 0,
	// 	info: data ? data.filter(i => /1050/.test(i.id)) : '',
	// 	tagName: 'e-assets-stock',
	// 	component: Stock,
	// },
	// {
	// 	id: 10600,
	// baseId: 1060,
	// 	name: '动产抵押',
	// 	total: data ? toGetTotal('1060', data) : 0,
	// 	info: data ? data.filter(i => /1060/.test(i.id)) : '',
	// 	tagName: 'e-assets-chattel',
	// 	component: Chattel,
	// },
	// {
	// 	id: 10700,
	// baseId: 1070,
	// 	name: '招投标',
	// 	total: data ? toGetTotal('1070', data) : 0,
	// 	info: data ? data.filter(i => /1070/.test(i.id)) : '',
	// 	disabled: true,
	// 	tagName: 'e-assets-bidding',
	// 	component: Bidding,
	// },
]);

class Assets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			config: subItems(props.count),
			loading: Boolean(props.count.length === 0),
		};
	}

	componentDidMount() {
		const { toPushChild } = this.props;
		toPushChild(this.toGetSubItems());
	}

	componentWillReceiveProps(nextProps) {
		const { count } = this.props;
		if (nextProps.count.length) {
			if (JSON.stringify(nextProps.count) !== JSON.stringify(count)) {
				this.setState({
					loading: nextProps.count.length === 0,
					config: subItems(nextProps.count),
				}, () => {
					const { toPushChild } = this.props;
					toPushChild(this.toGetSubItems());
				});
			}
		}
	}

	handleScroll=(eleID) => {
		const dom = document.getElementById(eleID);
		// const _height = document.getElementById('enterprise-intro').clientHeight;
		if (dom) {
			window.scrollTo(0, document.getElementById(eleID).offsetTop - 168);
		}
	};

	toGetSubItems=() => {
		const { config } = this.state;
		return (
			<div className="yc-intro-sub-items">
				{
					config.map(item => (
						<Button className="intro-btn-items" disabled={item.total === 0} onClick={() => this.handleScroll(item.tagName)}>
							{`${item.name}${item.total ? ` ${item.total}` : ' 0'}`}
						</Button>
					))
				}
			</div>
		);
	};


	render() {
		const { config, loading } = this.state;
		const { count } = this.props;
		const aryResult = (subItems(count).filter(i => i.total > 0)).length;
		return (
			<div className="inquiry-assets" style={{ padding: '10px 20px' }}>
				<Spin visible={loading} minHeight={350}>
					{
						aryResult ? config.map(Item => (
							Item.total ? <Item.component id={Item.tagName} data={Item.info} portrait="detail" /> : ''))
							: <NoContent />
					}
				</Spin>
			</div>
		);
	}
}
Assets.config = {
	items: subItems(),
	idList: (subItems().filter(i => i.role)).map(i => i.baseId),
	status: Boolean((subItems().filter(i => i.role)).length),
};
export default Assets;