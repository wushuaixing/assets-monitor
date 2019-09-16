import service from '@/utils/service';
import { baseUrl } from '@/utils/api/index';

/*  债务人详情页推送结果相关接口[C.H Wong] 11 */

const obligor = {
	// 司法监控列表
	auctionList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/auctionList/${obligorId}`, { params })
		.then(res => res.data),

	// 金融资产竞价项目
	auctionBiddingList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/auctionBiddingList/${obligorId}`, { params })
		.then(res => res.data),

	// 金融资产公示项目列表
	financeList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/financeList/${obligorId}`, { params })
		.then(res => res.data),

	// 代位权-开庭列表
	courtSessionListD: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/courtSessionList/${obligorId}`, { params })
		.then(res => res.data),

	// 代位权-立案列表
	trialListD: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/trialList/${obligorId}`, { params })
		.then(res => res.data),

	// 涉诉-开庭列表
	courtSessionListS: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/courtSessionList/${obligorId}`, { params })
		.then(res => res.data),

	// 涉诉-立案列表
	trialListS: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/trialList/${obligorId}`, { params })
		.then(res => res.data),

	// 破产列表
	bankruptcyList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/bankruptcyList/${obligorId}`, { params })
		.then(res => res.data),

	// 失信记录列表
	dishonestList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/dishonestList/${obligorId}`, { params })
		.then(res => res.data),

	// 公示公告招标总标列表
	biddingList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/biddingList/${obligorId}`, { params })
		.then(res => res.data),

	// 公示公告环境处罚列表
	epbList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/epbList/${obligorId}`, { params })
		.then(res => res.data),

	// 公示公告税收违法列表
	taxList: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/taxList/${obligorId}`, { params })
		.then(res => res.data),

	// 数量统计
	viewCount: (params, obligorId) => service
		.get(`${baseUrl}/yc/obligor/monitor/overview/${obligorId}`, { params })
		.then(res => res.data),
};

/*  业务详情页相关监控列表[C.H Wong]10 */

const business = {
	// 司法监控列表
	auctionList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/auctionList/${businessId}`, { params })
		.then(res => res.data),

	// 金融资产竞价项目
	auctionBiddingList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/auctionBiddingList/${businessId}`, { params })
		.then(res => res.data),

	// 金融资产公示项目列表
	financeList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/financeList/${businessId}`, { params })
		.then(res => res.data),

	// 代位权-开庭列表
	courtSessionListD: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/courtSessionList/${businessId}`, { params })
		.then(res => res.data),

	// 代位权-立案列表
	trialListD: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/trialList/${businessId}`, { params })
		.then(res => res.data),

	// 涉诉-开庭列表
	courtSessionListS: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/courtSessionList/${businessId}`, { params })
		.then(res => res.data),

	// 涉诉-立案列表
	trialListS: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/trialList/${businessId}`, { params })
		.then(res => res.data),

	// 破产列表
	bankruptcyList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/bankruptcyList/${businessId}`, { params })
		.then(res => res.data),

	// 公示公告招标总标列表
	biddingList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/biddingList/${businessId}`, { params })
		.then(res => res.data),

	// 公示公告环境处罚列表
	epbList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/epbList/${businessId}`, { params })
		.then(res => res.data),

	// 公示公告税收违法列表
	taxList: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/taxList/${businessId}`, { params })
		.then(res => res.data),

	// 数量统计
	viewCount: (params, businessId) => service
		.get(`${baseUrl}/yc/business/monitor/overview/${businessId}`, { params })
		.then(res => res.data),
};

export default { obligor, business };