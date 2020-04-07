import * as React from 'react';
import { getHeight, getWidth } from './selectors/D3LineChart.selectors';
import { renderLineChart } from './helpers/D3LineChart.helpers';
import { drawPointer } from './helpers/D3LineChartPointer.helpers';
import { CanvasChart } from '../CanvasChart/CanvasChart.component';
import { Option } from 'fp-ts/lib/Option';

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

export const D3LineChart: React.FC<TD3LineChartProps> = React.memo((props) => {
	const width = getWidth(props);
	const height = getHeight(props);
	const {data, settings} = props;
	const renderProps = {width, height, data, settings};

	const renderChart = (canv: Option<HTMLCanvasElement>) => renderLineChart(renderProps, canv);
	const renderOnMove = (ctx: CanvasRenderingContext2D, x: number, y: number) => drawPointer(renderProps, ctx, x, y);

	return (
		<CanvasChart
			width={width}
			height={height}
			renderChart={renderChart}
			renderOnMove={renderOnMove}
		/>
	)
});
