import * as React from 'react';
import { createOptionRef } from '../../utils/createOptionRef';
import './D3Chart.component.css';
import { getHeight, getWidth } from './selectors/D3Chart.selectors';
import { renderLineChart } from './helpers/D3Chart.helpers';
import { renderPointer } from './helpers/D3Pointer.helpers';

export const yAxisWidth = 100;
export const xAxisHeight = 50;

export const padding = {
	top: 20,
	right: 20 + yAxisWidth,
	left: 20,
	bottom: 20 + xAxisHeight,
};

export interface TChartPoint {
	x: Date;
	y: number;
}

export interface TD3ChartProps {
	width: number;
	height: number;
	data: TChartPoint[];
}

export class D3Chart extends React.Component<TD3ChartProps> {
	private chartRef = createOptionRef<HTMLCanvasElement>();
	private chartPointerRef = createOptionRef<HTMLCanvasElement>();

	componentDidUpdate(): void {
		const props = this.props;
		renderLineChart(props, this.chartRef.optionCurrent);
		renderPointer(props, this.chartPointerRef.optionCurrent);
	}

	render() {
		const props = this.props;
		const width = getWidth(props);
		const height = getHeight(props);
		return (
			<div className={'chart-container'}>
				<canvas width={width} height={height} ref={this.chartRef} className={'chart'}/>
				<canvas width={width} height={height} ref={this.chartPointerRef} className={'pointer'}/>
			</div>
		)
	}
}