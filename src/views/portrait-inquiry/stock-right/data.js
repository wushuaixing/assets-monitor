const data = {
	name: 'flare',
	children: [
		{
			name: 'analytics',
			children: [
				{
					name: 'cluster',
					children: [
						{ name: 'AgglomerativeCluster', value: 3938 },
						{ name: 'CommunityStructure', value: 3812 },
						{ name: 'HierarchicalCluster', value: 6714 },
						{ name: 'MergeEdge', value: 743 },
					],
				},
				{
					name: 'graph',
					children: [
						{ name: 'BetweennessCentrality', value: 3534 },
						{ name: 'LinkDistance', value: 5731 },
						{ name: 'MaxFlowMinCut', value: 7840 },
						{ name: 'ShortestPaths', value: 5914 },
						{ name: 'SpanningTree', value: 3416 },
					],
				},
			],
		},
		{
			name: 'animate',
			children: [
				{ name: 'Easing', value: 17010 },
				{ name: 'FunctionSequence', value: 5842 },
				{
					name: 'interpolate',
					children: [
						{ name: 'ArrayInterpolator', value: 1983 },
						{ name: 'ColorInterpolator', value: 2047 },
						{ name: 'DateInterpolator', value: 1375 },
						{ name: 'Interpolator', value: 8746 },
						{ name: 'MatrixInterpolator', value: 2202 },
						{ name: 'NumberInterpolator', value: 1382 },
						{ name: 'ObjectInterpolator', value: 1629 },
						{ name: 'PointInterpolator', value: 1675 },
						{ name: 'RectangleInterpolator', value: 2042 },
					],
				},
				{ name: 'ISchedulable', value: 1041 },
				{ name: 'Parallel', value: 5176 },
			],
		},
	],
};
export default data;
