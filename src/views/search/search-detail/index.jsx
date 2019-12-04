import React from 'react';
import { navigate } from '@reach/router';

import Router from '@/utils/Router';
import Tabs from '@/common/tabs';

import Write from './writ';
import Auction from './auction';
import Finance from './finance';
import Lawsuits from './lawsuits';
import Bankruptcy from './bankruptcy';

const source = rule => ([
	{
		id: 1,
		name: '拍卖信息',
		url: '/search/detail',
		number: 0,
		open: !!(rule && rule.xxsspmxx),
		components: Auction,
	},
	{
		id: 2,
		name: '涉诉信息',
		url: '/search/detail/lawsuits',
		number: 0,
		open: !!(rule && rule.xxssssxx),
		components: Lawsuits,
	},
	{
		id: 3,
		name: '文书信息',
		url: '/search/detail/writ',
		number: 0,
		open: !!(rule && rule.xxsswsss),
		components: Write,
	},
	{
		id: 4,
		name: '金融资产',
		url: '/search/detail/finance',
		number: 0,
		open: !!(rule && rule.xxssjrzc),
		components: Finance,
	},
	{
		id: 5,
		name: '破产重组',
		url: '/search/detail/bankruptcy',
		number: 0,
		open: !!(rule && rule.xxsspccz),
		components: Bankruptcy,
	},
]);

const SearchBase = (props) => {
	const { rule } = props && props;
	console.log(rule, 111);
	const displayArray = source(rule).filter(item => item.open === true); // 过滤权限

	return (
		<React.Fragment>
			<Tabs
				onChange={res => navigate(res.url)}
				source={displayArray}
			/>
			<div className="yc-business yc-page-content">
				<Router>
					{
					displayArray.map(Item => <Item.components path={`${Item.url}/*`} />)
				}
				</Router>
			</div>
		</React.Fragment>
	);
};


const SearchRouter = (props) => {
	const { rule } = props;

	return (
		<Router>
			<SearchBase rule={rule} path="/*" />
		</Router>
	);
};
export default SearchRouter;
