import * as React from 'react';
import { getHeight, getWidth } from './selectors/D3CandleChart.selectors';
import { renderCandles } from './helpers/D3CandleChart.helpers';
import { drawPointer } from './helpers/D3CandleChartPointer.helpers';
import { renderChartInfo } from './helpers/D3ChartInfo.helpers';
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

export interface TCandle {
	y: {
		open: number;
		close: number;
		high: number;
		low: number;
		volume: number;
	},
	x: Date;
}

export interface TD3CandleChartSettings {
	pointer: {
		font: string;
		lineColor: string;
		pillColor: string;
		pillTextColor: string;
	},
	chartInfo: {
		font: string;
		textColor: string;
		backgroundColor: string;
	},
	candle: {
		font: string;
		bearColor: string;
		bullColor: string;
		neutralColor: string;
		gridColor: string;
		axisLabelTextColor: string;
		volumeColor: string;
	}
}

export interface TD3CandleChartProps {
	width: number;
	height: number;
	data: TCandle[];
	settings: TD3CandleChartSettings
}

export const D3CandleChart: React.FC<TD3CandleChartProps> = React.memo((props) => {

	const width = getWidth(props);
	const height = getHeight(props);
	const {data, settings} = props;
	const renderProps = {width, height, data, settings};

	const renderChart = (canv: Option<HTMLCanvasElement>) => renderCandles(renderProps, canv);
	const renderOnMove = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		renderChartInfo(renderProps, ctx, x - padding.left, y - padding.top);
		drawPointer(props, ctx, x, y);
	}

	return (
		<CanvasChart
			width={width}
			height={height}
			renderChart={renderChart}
			renderOnMove={renderOnMove}
		/>
	)
});
