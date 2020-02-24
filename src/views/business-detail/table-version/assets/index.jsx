import React from 'react';
import { Button, NoContent, Spin } from '@/common';
import Auction from './auction';
import Subrogation from './subrogation';
import Land from './land';
// import Intangible from './intangible';
import Stock from './stock';
import Chattel from './chattel';


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
		name: '资产拍卖',
		total: data ? toGetTotal('1010', data) : 0,
		info: data ? data.filter(i => /1010/.test(i.id)) : '',
		tagName: 'e-assets-auction',
		component: Auction,
	},
	{
		id: 10200,
		name: '代位权',
		total: data ? toGetTotal('1020', data) : 0,
		info: data ? data.filter(i => /1020/.test(i.id)) : '',
		tagName: 'e-assets-subrogation',
		component: Subrogation,
	},
	{
		id: 10300,
		name: '土地信息',
		total: data ? toGetTotal('1030', data) : 0,
		info: data ? data.filter(i => /1030/.test(i.id)) : '',
		tagName: 'e-assets-land',
		component: Land,
	},
	// {
	// 	id: 10400,
	// 	name: '无形资产',
	// 	total: 0,
	// 	disabled: true,
	// 	tagName: 'e-assets-intangible',
	// 	component: Intangible,
	// },
	{
		id: 10500,
		name: '股权质押',
		total: data ? toGetTotal('1050', data) : 0,
		info: data ? data.filter(i => /1050/.test(i.id)) : '',
		tagName: 'e-assets-stock',
		component: Stock,
	},
	{
		id: 10600,
		name: '动产抵押',
		total: data ? toGetTotal('1060', data) : 0,
		info: data ? data.filter(i => /1060/.test(i.id)) : '',
		tagName: 'e-assets-chattel',
		component: Chattel,
	},
]);

export default class Assets extends React.Component {
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
