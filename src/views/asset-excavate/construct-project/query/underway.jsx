import React from 'react';
import { Form, message } from 'antd';
import PropTypes from 'reactPropTypes';
import {
	Input, Button, timeRule, DatePicker,
} from '@/common';
import { clearEmpty } from '@/utils';
import '../index.scss';
import { getUrlParams, reserUrl } from '@/views/asset-excavate/query-util';

class QueryConstruct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		const url = window.location.hash;
		if (url.indexOf('?') !== -1) {
			const dParams = getUrlParams(url, 'updateTimeStart', 'updateTimeEnd');
			const { form: { setFieldsValue } } = this.props;
			setFieldsValue({ updateTimeStart: dParams.updateTimeStart });
			setFieldsValue({ updateTimeEnd: dParams.updateTimeEnd });
			this.handleSubmit();
		}
		window._addEventListener(document, 'keyup', this.toKeyCode13);
	}

	componentWillUnmount() {
		window._removeEventListener(document, 'keyup', this.toKeyCode13);
	}

	toKeyCode13 = (e) => {
		const event = e || window.event;
		const key = event.keyCode || event.which || event.charCode;
		if (document.activeElement.nodeName === 'INPUT' && key === 13) {
			const { className } = document.activeElement.offsetParent;
			if (/yc-input-wrapper/.test(className)) {
				this.handleSubmit();
				document.activeElement.blur();
			}
		}
	};

	// 点击查询按钮
	handleSubmit = () => {
		const { form: { getFieldsValue }, onQueryChange, clearSelectRowNum } = this.props;
		clearSelectRowNum();// 清除选中项
		const condition = getFieldsValue();
		const { consultPriceStart: start, consultPriceEnd: end } = condition;
		if (start && end && Number(start) > Number(end)) {
			message.error('评估价最低价不得高过最高价', 1);
			return false;
		}
		if (typeof onQueryChange === 'function')onQueryChange(clearEmpty(condition), '', '', 1);
		return true;
	};

	// 重置查询条件
	handleReset = () => {
		const url = window.location.hash;
		if (url.indexOf('timeHorizon') !== -1) {
			reserUrl();
		} else {
			const { form, onQueryChange, clearSelectRowNum } = this.props;
			clearSelectRowNum();// 清除选中项
			form.resetFields();
			const condition = form.getFieldsValue();
			if (typeof onQueryChange === 'function')onQueryChange(clearEmpty(condition), '', '', 1);
		}
	};

	render() {
		const { form: { getFieldProps, getFieldValue } } = this.props;
		const _style1 = { width: 278 };
		const _style2 = { width: 164 };
		const timeOption = {
			normalize(n) {
				return typeof n === 'object' ? (n && new Date(n).format('yyyy-MM-dd')) : n;
			},
		};
		return (
			<div className="yc-content-query">
				<div className="yc-query-item">
					<Input
						title="债务人"
						style={_style1}
						size="large"
						maxLength="40"
						placeholder="债务人姓名/公司名称"
						{...getFieldProps('obligorName')}
					/>
				</div>

				<div className="yc-query-item">
					<Input
						title="项目标题"
						style={_style1}
						size="large"
						maxLength="40"
						placeholder="公告标题关键字"
						{...getFieldProps('obligorName')}
					/>
				</div>

				<div className="yc-query-item">
					<span className="yc-query-item-title">发证日期：</span>
					<DatePicker
						size="large"
						style={_style2}
						placeholder="开始日期"
						{...getFieldProps('startStart', timeOption)}
						disabledDate={time => timeRule.disabledStartDate(time, getFieldValue('startEnd'))}
					/>
					<span className="yc-query-item-title">至</span>
					<DatePicker
						size="large"
						style={_style2}
						placeholder="结束日期"
						{...getFieldProps('startEnd', timeOption)}
						disabledDate={time => timeRule.disabledEndDate(time, getFieldValue('startStart'))}
					/>
				</div>

				<div className="yc-query-item">
					<span className="yc-query-item-title">更新时间：</span>
					<DatePicker
						size="large"
						style={_style2}
						placeholder="开始日期"
						{...getFieldProps('updateTimeStart', timeOption)}
						disabledDate={time => timeRule.disabledStartDate(time, getFieldValue('updateTimeEnd'))}
					/>
					<span className="yc-query-item-title">至</span>
					<DatePicker
						size="large"
						style={_style2}
						placeholder="结束日期"
						{...getFieldProps('updateTimeEnd', timeOption)}
						disabledDate={time => timeRule.disabledEndDate(time, getFieldValue('updateTimeStart'))}
					/>
				</div>

				<div className="yc-query-item yc-query-item-btn">
					<Button size="large" type="common" style={{ width: 84 }} onClick={this.handleSubmit}>查询</Button>
					<Button size="large" style={{ width: 120 }} onClick={this.handleReset}>重置查询条件</Button>
				</div>
				<div className="yc-split-hr" />
			</div>
		);
	}
}

QueryConstruct.propTypes = {
	onQueryChange: PropTypes.func,
	clearSelectRowNum: PropTypes.func,
};

QueryConstruct.defaultProps = {
	onQueryChange: () => {},
	clearSelectRowNum: () => {},
};

export default Form.create()(QueryConstruct);
