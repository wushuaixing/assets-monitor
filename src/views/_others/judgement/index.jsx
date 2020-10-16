import React from 'react';
import { Button, Spin, NoContent } from '@/common';
import { parseQuery } from '@/utils';
import { judgmentDetail } from '@/utils/api/index';
import './style.scss';

class Judgement extends React.Component {
	constructor(props) {
		super(props);
		document.title = '文书正文';
		this.state = {
			loading: true,
			url: '',
			htmlText: '',
			title: '',
		};
	}

	componentWillMount() {
		const { hash } = window.location;
		const params = parseQuery(hash);
		const newParams = {
			pid: params.pid,
			sourceId: parseInt(params.sourceId, 10),
		};
		this.setState({
			title: params.title,
		});
		this.getData(newParams);
	}

	// 请求数据
	getData = (params) => {
		judgmentDetail(params).then((res) => {
			if (res.code === 200) {
				this.setState({
					loading: false,
					url: res.data.url,
					htmlText: res.data.htmlText,
				});
			} else {
				this.setState({
					loading: false,
				});
			}
		}).catch((err) => {
			console.log(err);
			this.setState({
				loading: false,
			});
		});
	};

	// 手动跳转源链接
	handleJumpSourceLink = () => {
		const { url } = this.state;
		console.log('url', url);
		const w = window.open('about:blank');
		w.location.href = url;
	};

	render() {
		const { loading, htmlText, title } = this.state;
		return (
			<Spin visible={loading}>
				<div className="judgement">
					<div className="judgement-header">
						<span className="judgement-header-title">{title}</span>
						<Button className="judgement-header-btn" onClick={this.handleJumpSourceLink}>源链接</Button>
					</div>
					<div className="judgement-line">
						<div className="judgement-line-title">文书正文</div>
						<div className="judgement-line-line" />
					</div>
					{
						htmlText ? <div className="judgement-body" dangerouslySetInnerHTML={{ __html: htmlText }} /> : <NoContent font="文书未公开或未查到" style={{ paddingTop: 50 }} />
					}
				</div>
			</Spin>
		);
	}
}
export default Judgement;
