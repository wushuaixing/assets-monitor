import React from 'react';
import { Icon } from 'antd';

export default class MatchingReason extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 'none',
		//	none canOpen canClose
		};
		this.toCal = false;
	}

	componentDidMount() {
		// console.log(this.dom.clientHeight);
		if (this.dom.clientHeight > 64) {
			this.setState({ status: 'canOpen' });
		}
	}
	//
	// componentWillReceiveProps(nextProps) {
	// 	const { content: { id } } = this.props;
	// 	const _id = nextProps.content.id;
	// 	if (id !== _id) {
	// 		this.toCal = true;
	// 		console.log('重新渲染：', this.dom.clientHeight);
	// 	}
	// }

	componentDidUpdate(prevProps) {
		const { content: { id } } = this.props;
		const _id = prevProps.content.id;
		if (id !== _id) {
			this.toCal = true;
			if (this.dom.clientHeight > 64) {
				this.setState({ status: 'canOpen' });
			} else {
				this.setState({ status: 'none' });
			}
			// console.log('重新渲染：', this.dom.clientHeight);
		}
	}

	toGetReasonList=(reason) => {
		const _reason = JSON.parse(reason);
		return _reason.map((item) => {
			if (item.used_name) {
				return (
					<div className="reason-list">
						<div>{`● 根据曾用名"${item.used_name}"匹配`}</div>
						{ item.hl.map(i => <p dangerouslySetInnerHTML={{ __html: i }} />) }
					</div>
				);
			} if (item.birth) {
				return (
					<div className="reason-list">
						<div>{`● 根据"${item.birth}"匹配`}</div>
						<p dangerouslySetInnerHTML={{ __html: item.desc }} />
					</div>
				);
			}
			return (
				<div className="reason-list">
					<div>{`● 根据"${item.name || item.number}"匹配`}</div>
					{ item.hl.map(i => <p dangerouslySetInnerHTML={{ __html: i }} />) }
				</div>
			);
		});
	};

	render() {
		const { content: { reason, remark } } = this.props;
		const { status } = this.state;
		return (
			<div className="assets-matching-reason-wrapper">
				<div className={`reason-content-wrapper content-${status}`}>
					<div className="reason-content" ref={e => this.dom = e}>
						{
							remark ? (
								<div className="reason-list">
									<div>● 审核备注</div>
									<p>{remark}</p>
								</div>
							) : null
						}
						{this.toGetReasonList(reason)}
					</div>
				</div>
				<div className={`reason-action reason-action-${status}`}>
					{
						status === 'canOpen' ? (
							<React.Fragment>
								<li className="action-ellipsis yc-text-normal">
									<Icon type="ellipsis" />
								</li>
								<li className="action-btn yc-text-normal" onClick={() => this.setState({ status: 'canClose' })}>
									<span>展开</span>
									<Icon type="down" />
								</li>
							</React.Fragment>
						) : (
							<li className="action-btn yc-text-normal" onClick={() => this.setState({ status: 'canOpen' })}>
								<span>收起</span>
								<Icon type="up" />
							</li>
						)
					}
				</div>
			</div>
		);
	}
}