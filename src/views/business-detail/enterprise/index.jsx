import React from 'react';
import { Affix, message } from 'antd';
import { navigate } from '@reach/router';
import Router from '@/utils/Router';
/* utils */
import { requestAll } from '@/utils/promise';
import {
	getQueryByName, timeStandard, toEmpty, reviseNum,
} from '@/utils';
/* api collection */
import assets from '@/utils/api/detail/assets';
// import lawsuits from '@/utils/api/portrait-inquiry/enterprise/lawsuits';
// import manage from '@/utils/api/portrait-inquiry/enterprise/manage';
import { companyInfo, dishonestStatus, exportListEnp } from '@/utils/api/portrait-inquiry';
/* components */
import {
	Tabs, Spin, Download, Icon as IconType,
} from '@/common';
import Overview from '../overview';
// import OverView from '@/views/_common-portrait/overview';
import Assets from '@/views/business-detail/table-version/assets';
// import Risk from '@/views/_common-portrait/risk';
// import Info from '@/views/_common-portrait/info';
// import Lawsuits from './lawsuits';
// import Manage from './manage';
// import Info from './info';
import Dishonest from '@/assets/img/icon/icon_shixin.png';
import './style.scss';

/* 基本选项 */
const source = () => [
	{
		id: 101,
		name: '概览',
		number: 0,
		showNumber: false,
		path: '/*',
		status: true,
		component: Overview,
		source: [],
	},
	{
		id: 102,
		name: '资产',
		showNumber: false,
		path: '/business/detail/info/102/*',
		config: Assets.config,
		status: Assets.config.status,
		component: Assets,
		apiData: assets,
		source: [],
	},
	{
		id: 103,
		name: '风险',
		number: 0,
		showNumber: false,
		field: 'followingCount',
	},
	{
		id: 105,
		name: '工商基本信息',
		field: 'ignoreCount',
	},
].filter(i => i.status);

/* 获取注册状态样式 */
const getRegStatusClass = (val) => {
	if (val) {
		if (val.match(/(存续|在业)/)) return ' regStatus-green';
		if (val.match(/(迁出|其他)/)) return ' regStatus-orange';
		if (val.match(/(撤销|吊销|清算|停业|注销)/)) return ' regStatus-red';
	}
	return '';
};

/* 企业概要 */
const EnterpriseInfo = (props) => {
	const {
		data: {
			name, regStatus, legalPersonName, regCapital, formerNames, establishTime, logoUrl,
		}, isDishonest,
	} = props;
	const _formerNames = (formerNames || []).join('、');
	const style = {
		minWidth: 80,
		display: 'inline-block',
	};

	return (
		<div className="enterprise-info">
			<div className="intro-icon">
				{
					logoUrl ? <div className="intro-icon-img-w"><img className="intro-icon-img" src={logoUrl} alt="" /></div>
						: <span>{name && name.slice(0, 4)}</span>
				}
			</div>
			<div className="intro-content">
				<div className="intro-title">
					<span className="yc-public-title-large-bold intro-title-name">
						{name}
						{isDishonest ? <img className="intro-title-tag" src={Dishonest} alt="" /> : null}
					</span>
					{
						regStatus ? <span className={`inquiry-list-regStatus${getRegStatusClass(regStatus)}`} style={isDishonest ? { marginTop: 2, marginLeft: 58 } : { marginTop: 2 }}>{regStatus}</span> : null
					}
				</div>
				<div className="intro-base-info">
					<li className="intro-info-list intro-list-border">
						<span className="yc-public-remark">法定代表人：</span>
						<span className="yc-public-title" style={style}>{legalPersonName || '--'}</span>
					</li>
					<li className="intro-info-list intro-list-border">
						<span className="yc-public-remark">注册资本：</span>
						<span className="yc-public-title" style={style}>{toEmpty(regCapital) ? reviseNum(regCapital) : '--'}</span>
					</li>
					<li className="intro-info-list">
						<span className="yc-public-remark">成立日期：</span>
						<span className="yc-public-title">{timeStandard(establishTime)}</span>
					</li>
				</div>
				<div className="intro-used">
					<li className="intro-info-list">
						{
						toEmpty(_formerNames) ? [
							<span className="yc-public-remark">曾用名：</span>,
							<span className="yc-public-title">{_formerNames}</span>,
						] : null
					}
					</li>
				</div>
			</div>
			<div className="intro-download">
				<Download
					style={{ width: 84 }}
					condition={{
						companyId: getQueryByName(window.location.href, 'id'),
					}}
					icon={<IconType type="icon-download" style={{ marginRight: 5 }} />}
					api={exportListEnp}
					normal
					text="下载"
				/>
			</div>
		</div>
	);
};
/* 企业概要-简单版 */
const EnterpriseInfoSimple = (props) => {
	const { data, isDishonest } = props;
	return (
		<div className="enterprise-info">
			<div className="intro-title">
				<span className="yc-public-title-large-bold intro-title-name">
					{data.name}
					{isDishonest ? <img className="intro-title-tag" src={Dishonest} alt="" /> : null}
				</span>
				{
					data.regStatus
						? <span className={`inquiry-list-regStatus${getRegStatusClass(data.regStatus)}`} style={isDishonest ? { marginTop: 2, marginLeft: 58 } : { marginTop: 2 }}>{data.regStatus}</span> : ''
				}
			</div>
			<div className="intro-download">
				<Download
					style={{ width: 84 }}
					condition={{
						companyId: getQueryByName(window.location.href, 'id'),
					}}
					icon={<IconType type="icon-download" style={{ marginRight: 5 }} />}
					api={exportListEnp}
					normal
					text="下载"
				/>
			</div>
		</div>
	);
};

export default class Enterprise extends React.Component {
	constructor(props) {
		document.title = '债务人详情';
		// const defaultSourceType = window.location.hash.match(/\d{3}?(\?)/);
		const defaultSourceType = window.location.hash.match(/\/detail\/info\/(\d{3})\/?/);
		super(props);
		this.state = {
			tabConfig: source(),
			childDom: '',
			sourceType: defaultSourceType ? Number(defaultSourceType[1]) : 101,
			affixStatus: false,
			loading: true,
			infoSource: {},
			isDishonest: false,
			countSource: {
				assets: [],
				lawsuits: [],
				manage: [],
			},
		};
	}

	componentWillMount() {
		const { tabConfig } = this.state;
		const companyId = getQueryByName(window.location.href, 'id') || 494493;
		companyInfo({ companyId }).then((res) => {
			if (res.code === 200) {
				this.setState({
					infoSource: res.data,
					loading: false,
				});
				tabConfig.forEach((item, index) => this.toGetSubItemsTotal(item, index));
			} else {
				message.error('网络请求失败！');
				this.setState({
					loading: false,
				});
			}
		}).catch(() => {
			this.setState({
				loading: false,
			});
		});
		dishonestStatus({ companyId }).then((res) => {
			if (res.code === 200) {
				this.setState({
					isDishonest: res.data,
				});
			}
		});
	}

	/* 获取各类子项总数 */
	toGetSubItemsTotal=((item, index) => {
		if (item.config) {
			const { apiData, config: { idList, status } } = item;
			const { tabConfig } = this.state;
			const apiArray = [];
			if (idList.length > 0 && status) {
				Object.keys(apiData).forEach((k) => {
					idList.forEach((i) => {
						const tempRep = new RegExp(`^${i}`);
						if (tempRep.test(k)) {
							apiArray.push({
								api: apiData[k].count({}),
								info: { id: apiData[k].id },
							});
						}
					});
				});
			}
			if (apiArray.length) {
				requestAll(apiArray).then((res) => {
					let count = 0;
					res.forEach(i => count += i.field ? i.data[i.field] : i.data);
					tabConfig[index].number = count;
					tabConfig[index].showNumber = true;
					tabConfig[index].source = res;
					console.log(tabConfig);
					this.setState({ tabConfig });
				});
			}
		}
	});

	handleDownload=() => {
		console.log('handleDownload');
	};

	handleAddChild=(val) => {
		this.setState({
			childDom: val,
		});
	};

	onChangeAffix=(val) => {
		this.setState({ affixStatus: val });
		// console.log('onChangeAffix:', val);
	};

	/* tab change */
	onSourceType=(val) => {
		const { sourceType } = this.state;
		const { href } = window.location;
		const params = href.match(/\?/) ? href.slice(href.match(/\?/).index) : '';
		if (val !== sourceType) {
			this.setState({
				sourceType: val,
				childDom: '',
			}, () => {
				navigate(`/business/detail/info/${val}${params}`);
			});
		}
	};

	render() {
		const {
			tabConfig, childDom, sourceType, affixStatus, loading, infoSource, countSource, isDishonest,
		} = this.state;
		// const classList = ['enterprise-intro'];
		// if (!childDom) classList.push('enterprise-intro-child');
		// if (affixStatus) classList.push('enterprise-intro-affix');
		return (
			<div className="yc-information-detail-wrapper">
				<div className="info-navigation info-wrapper">导航模块</div>
				<div className="mark-line" />
				<div className="info-detail info-wrapper">
					<EnterpriseInfo download={this.handleDownload} data={infoSource} isDishonest={isDishonest} />
					<Tabs.Simple
						onChange={this.onSourceType}
						source={tabConfig}
						symbol="none"
						defaultCurrent={sourceType}
					/>
					{childDom}
				</div>
				<div className="mark-line" />
				<div className="info-content">
					<Router>
						{ tabConfig.map(I => <I.component count={I.source} path={I.path} toPushChild={this.handleAddChild} />) }
					</Router>
				</div>
			</div>
		);
	}
}