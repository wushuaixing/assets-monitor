import React from 'react';
import './style.scss';
import analogData from './analog-data';


const obligorType = {
	1: {
		normal: {
			color: '#fff',
			borderWidth: '1',
			borderColor: '#ccc',
			label: {
				show: true,
				position: 'inside',
				textStyle: {
					fontSize: 14,
					color: '#333',
					fontStyle: 'normal',
				},
			},
		},
		emphasis: {
			color: 'rgba(255,255,255,0)',
			borderWidth: '1',
			borderColor: 'rgba(255,255,255,0)',
		},
	},
	2: {
		normal: {
			color: '#f3f9fe',
			borderColor: '#1e81e1',
			borderWidth: '1',
			label: {
				show: true,
				position: 'inside',
				textStyle: {
					color: 'black',
				},
			},
		},
	},
};

/* 处理配置文件，并返回 eCharts配置 */
const optionMethods = (source1, source2) => ({
	calculable: false,
	series: [
		{
			name: '股东',
			type: 'tree',
			rootLocation: { x: '50%', y: '50%' }, // 根节点位置  {x: 'center',y: 10}
			nodePadding: 20,
			layerPadding: 40,
			symbol: 'circle',
			orient: 'vertical',
			direction: 'inverse',
			roam: true,
			symbolSize: 40,
			itemStyle: {
				normal: {
					color: '#128bed',
					borderWidth: '1',
					borderColor: '#128bed',
					label: {
						position: 'inside',
						textStyle: {
							color: '#ffffff',
							fontSize: 14,
							fontStyle: 'normal',
						},
					},
				},
				emphasis: {
					color: 'rgba(255,255,255,0)',
					borderWidth: '1',
					borderColor: '#128bed',
				},
			},
			data: source1,
		},
		{
			name: '投资',
			type: 'tree',
			rootLocation: { x: '50%', y: '50%' }, // 根节点位置  {x: 'center',y: 10}
			nodePadding: 20,
			layerPadding: 40,
			symbol: 'circle',
			orient: 'vertical',
			roam: true,
			symbolSize: 40,
			itemStyle: {
				normal: {
					color: '#128bed',
					borderWidth: '1',
					borderColor: '#128bed',
					label: {
						show: !0,
						position: 'inside',
						textStyle: {
							color: '#ffffff',
							fontSize: 16,
							fontStyle: 'normal',
						},
					},
				},
				emphasis: {
					color: 'rgba(255,255,255,0)',
					borderWidth: '1',
					borderColor: '#128bed00',
				},
			},
			data: source2,
		},

	],
});

export default class StockRight extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}


	componentDidMount() {
		const source = this.toCreatOption();
		this.myChart = window.echarts.init(document.getElementById('zRenderEcharts'));
		this.myChart.setOption(optionMethods(source.holderData, source.investorData));
		this.toAddShape();
	}

	toCreatOption=() => {
		const { holderList, investorList } = analogData;
		const holderData = [{
			name: analogData.name,
			symbolSize: [40 + analogData.name.length * 18, 50],
			symbol: 'rectangle',
			children: holderList.map(item => ({
				username: item.name,
				symbol: 'rectangle',
				symbolSize: [146, 50],
				itemStyle: item.type === 1 ? obligorType[1] : obligorType[2],
				amount: item.amount,
				children: item.holderList.map(childItem => ({
					username: childItem.name,
					value: 2,
					symbol: 'rectangle',
					symbolSize: [140, 50],
					amount: childItem.amount,
					itemStyle: childItem.type === 1 ? obligorType[1] : obligorType[2],
				})),
			})),
		}];
		const investorData = [{
			name: analogData.name,
			symbolSize: [40 + analogData.name.length * 18, 50],
			symbol: 'rectangle',
			children: investorList.map(item => ({
				username: item.name,
				symbol: 'rectangle',
				symbolSize: [146, 50],
				itemStyle: item.type === 1 ? obligorType[1] : obligorType[2],
				amount: item.amount,
				children: item.investorList && item.investorList.map(childItem => ({
					username: childItem.name,
					value: 2,
					symbol: 'rectangle',
					symbolSize: [140, 50],
					amount: childItem.amount,
					itemStyle: childItem.type === 1 ? obligorType[1] : obligorType[2],
				})),
			})),
		}];
		return {
			holderData,
			investorData,
		};
	};

	toAddShape=() => {
		const { Text } = window.zrDefine;
		const myZr = this.myChart.getZrender();
		const shapeList = myZr.storage.getShapeList();
		for (let i = 0; i < shapeList.length; i += 1) {
			const myChartData = shapeList[i]._echartsData;
			const locationX = shapeList[i].rotation[1];
			const locationY = shapeList[i].rotation[2];
			if (myChartData) {
				const shapeText = new Text({
					style: {
						x: locationX,
						y: locationY - 5,
						textFont: 'normal 12px verdana',
						text: myChartData._data.username,
						textAlign: 'center',
						color: '#333',
						fontSize: 14,
						lineWidth: 0,
					},
					highlightStyle: {
						lineWidth: 0,
						color: '#333',
						strokeColor: 'rgba(255,255,255,0)',
					},
					zlevel: 4,
				});
				shapeText.zlevel = 1;
				shapeText.z = 5;
				shapeText.ndelete = true;
				shapeText.hoverable = false;
				myZr.addShape(shapeText);
				if (myChartData._data.amount) {
					const shapeText1 = new Text({
						style: {
							x: locationX,
							y: locationY + 10,
							textFont: 'normal 10px verdana',
							text: `认缴金额：${myChartData._data.amount}`,
							textAlign: 'center',
							color: '#333',
							lineWidth: 0,
						},
						highlightStyle: {
							lineWidth: 0,
							color: '#333',
							strokeColor: 'rgba(255,255,255,0)',
						},
						zlevel: 4,
					});
					shapeText1.zlevel = 1;
					shapeText1.z = 5;
					shapeText1.ndelete = true;
					shapeText1.hoverable = false;
					myZr.addShape(shapeText1);
				}
			}
		}
	};

	render() {
		return (
			<div style={{ padding: 10 }}>
				<div id="zRenderEcharts" style={{ width: 1000, height: 700, border: '3px solid #ddd' }} />
			</div>
		);
	}
}
