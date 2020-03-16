import * as React from 'react';
import { Option } from 'fp-ts/lib/Option';
import { renderChart } from './helpers/Chart.helpers';
import './Chart.component.css';
import { createOptionRef } from '../../utils/createOptionRef';
import { renderPointer } from './helpers/Pointer.helpers';

export interface TPadding {
	top: Option<number>;
	right: Option<number>;
	bottom: Option<number>;
	left: Option<number>;
}

interface TDimensions {
	width: number;
	height: number;
	padding: Option<TPadding>
}

interface TChartProps {
	data: number[][];
	dimensions: TDimensions;
}

export class Chart extends React.PureComponent<TChartProps> {
	private canvChart = createOptionRef<HTMLCanvasElement>();
	private canvPointer = createOptionRef<HTMLCanvasElement>();


	componentDidMount(): void {
		const props = this.props;
		const { width, height, padding } = props.dimensions;
		const canvChart: Option<HTMLCanvasElement> = this.canvChart.optionCurrent;
		const canvPointer: Option<HTMLCanvasElement> = this.canvPointer.optionCurrent;

		renderChart(props.data, canvChart, width, height, padding);
		renderPointer(canvPointer, width, height);

	}

	componentDidUpdate(prevProps: Readonly<TChartProps>, prevState: Readonly<{}>, snapshot?: any): void {
		const props = this.props;
		const { width, height, padding } = props.dimensions;

		const canvChart: Option<HTMLCanvasElement> = this.canvChart.optionCurrent;
		const canvPointer: Option<HTMLCanvasElement> = this.canvPointer.optionCurrent;

		renderChart(props.data, canvChart, width, height, padding);
		renderPointer(canvPointer, width, height);
	}

	render() {
		const props = this.props;
		const { width, height } = props.dimensions;

		return (
			<div className={'chart-container'}>
				<canvas width={width} height={height} ref={this.canvChart} className={'chart'}/>
				<canvas width={width} height={height} ref={this.canvPointer} className={'pointer'}/>
			</div>
		);
	}
}