import service from '@/utils/service';
import { baseUrl } from '@/utils/api/index';

// 机构管理=>推送设置[C.H Wong]

// 推送人列表
export const pushList = params => service.get(`${baseUrl}/yc/pushManager/list`, { params })
	.then(res => res.data);
// 推送人修改及保存
export const pushSave = params => service.post(`${baseUrl}/yc/pushManager/save`, params)
	.then(res => res.data);

// 监控信息=>司法拍卖=>资产监控跟进[C.H Wong]

// 获取跟进记录列表
export const processList = params => service.post(`${baseUrl}/yc/monitor/process/list`, params)
	.then(res => res.data);

// 推送人修改及保存
export const processSave = params => service.post(`${baseUrl}/yc/monitor/process/save`, params)
	.then(res => res.data);
