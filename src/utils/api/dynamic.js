import assetsDebtor from './professional-work/debtor/assets';
import assetsBusiness from './professional-work/business/assets';

import assetsPortrait from './portrait-inquiry/enterprise/assets';
import assetsPersonal from './portrait-inquiry/personal/assets';

import riskDebtor from './professional-work/debtor/risk';
import riskBusiness from './professional-work/business/risk';

import riskPersonal from './portrait-inquiry/personal/risk';

import portraitLawsuits from './portrait-inquiry/enterprise/lawsuits';

import portraitManage from './portrait-inquiry/enterprise/manage';

import { getHrefQuery } from '@/utils';

const riskPortrait = Object.assign({}, portraitLawsuits, portraitManage);

export const getDynamicAsset = (portrait = 'enterprise', option) => {
	const { b, e, p } = option;
	/* b：业务api相关id ， e：画像查询-企业api相关 ， p：画像查询-个人api相关  */
	let api = '';
	if (e) api = assetsPortrait[e];
	else if (b) api = assetsDebtor[e];
	else if (p) api = assetsPersonal[p];
	// api 默认值 优先级：画像企业=> 业务债务人=>画像个人
	const params = {};
	if ((portrait === 'debtor_enterprise' || portrait === 'debtor_personal') && b) {
		api = assetsDebtor[b];
		params.obligorId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	} else if (portrait === 'business' && b) {
		api = assetsBusiness[b];
		params.obligorId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	} else if (portrait === 'personal' && p) {
		api = assetsPersonal[p];
		params.obligorName = getHrefQuery('name');
		params.obligorNumber = getHrefQuery('num');
	} else if (portrait === 'enterprise' && e) {
		api = assetsPortrait[e];
		params.companyId = getHrefQuery('id');
		params.obligorId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	}
	return { api, params };
};

export const getDynamicRisk = (portrait = 'enterprise', option) => {
	const { b, e, p } = option;
	/* b：业务api相关id ， e：画像查询-企业api相关 ， p：画像查询-个人api相关  */
	let api = '';
	if (e) api = riskPortrait[e];
	else if (b) api = riskDebtor[e];
	else if (p) api = riskPersonal[p];
	// api 默认值 优先级：画像企业=> 业务债务人=>画像个人
	const params = {};
	if ((portrait === 'debtor_enterprise' || portrait === 'debtor_personal') && b) {
		api = riskDebtor[b];
		params.obligorId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	} else if (portrait === 'business' && b) {
		api = riskBusiness[b];
		params.obligorId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	} else if (portrait === 'personal' && p) {
		api = riskPersonal[p];
		params.obligorName = getHrefQuery('name');
		params.obligorNumber = getHrefQuery('num');
		params.businessId = getHrefQuery('id');
	} else if (portrait === 'enterprise' && e) {
		api = riskPortrait[e];
		params.companyId = getHrefQuery('id');
		params.businessId = getHrefQuery('id');
	}
	return { api, params };
};
