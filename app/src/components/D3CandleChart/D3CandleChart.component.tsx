import * as React from 'react';
import { getHeight, getWidth } from './selectors/D3CandleChart.selectors';
import { renderCandles } from './helpers/D3CandleChart.helpers';
import { drawPointer } from './helpers/D3CandleChartPointer.helpers';
import { renderChartInfo } from './helpers/D3ChartInfo.helpers';
import { CanvasChart } from '../CanvasChart/CanvasChart.component';

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

export class D3CandleChart extends React.PureComponent<TD3CandleChartProps> {
	render() {
		const props = this.props;
		const width = getWidth(props);
		const height = getHeight(props);

		return (
			<CanvasChart<TD3CandleChartProps>
				width={width}
				height={height}
				settings={props.settings}
				data={props.data}
				renderChart={renderCandles}
				renderOnMove={this.renderOnMove}
			/>
		)
	}

	renderOnMove = (props: TD3CandleChartProps, ctx: CanvasRenderingContext2D, x: number, y: number) => {
		renderChartInfo(props, ctx, x - padding.left, y - padding.top);
		drawPointer(props, ctx, x, y);
	}
}