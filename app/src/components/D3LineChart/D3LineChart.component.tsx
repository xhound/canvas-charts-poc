import * as React from 'react';
import { getHeight, getWidth } from './selectors/D3LineChart.selectors';
import { renderLineChart } from './helpers/D3LineChart.helpers';
import { drawPointer } from './helpers/D3LineChartPointer.helpers';
import { CanvasChart } from '../CanvasChart/CanvasChart.component';

export const yAxisWidth = 100;
export const xAxisHeight = 50;

export const padding = {
	top: 20,
	right: 20 + yAxisWidth,
	left: 20,
	bottom: 20 + xAxisHeight,
};

export interface TD3LineChartSettings {
	pointer: {
		font: string;
		lineColor: string;
		pillColor: string;
		pillTextColor: string;
	},
	chart: {
		font: string;
		gridColor: string;
		axisLabelTextColor: string;
		lineColor: string;
		areaColor: string;
	}
}

export interface TChartPoint {
	x: Date;
	y: number;
}

export interface TD3LineChartProps {
	width: number;
	height: number;
	data: TChartPoint[];
	settings: TD3LineChartSettings;
}

export class D3LineChart extends React.PureComponent<TD3LineChartProps> {
	render() {
		const props = this.props;
		const width = getWidth(props);
		const height = getHeight(props);
		return (
			<CanvasChart<TD3LineChartProps>
				width={width}
				height={height}
				data={props.data}
				renderChart={renderLineChart}
				renderOnMove={drawPointer}
				settings={props.settings}
			/>
		)
	}
}