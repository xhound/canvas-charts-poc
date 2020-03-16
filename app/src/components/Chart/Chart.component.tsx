import * as React from 'react';
import { map, Option, chain, option, some } from 'fp-ts/lib/Option';
import { drawPointer, getCanvasContext, renderChart } from './helpers/Chart.helpers';
import { pipe } from 'fp-ts/lib/pipeable';
import './Chart.component.css';
import { sequenceT } from 'fp-ts/lib/Apply';
import { createOptionRef } from '../../utils/createOptionRef';

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

		const preparePointer = drawPointer(width, height, 'red');

		pipe(canvPointer,
			chain(canv => pipe(sequenceT(option)(some(canv), getCanvasContext(canv)),
				map(([canv, ctx]) => canv.addEventListener('mousemove', preparePointer(ctx)))
			)))

	}

	render() {
		const props = this.props;
		const { width, height, padding } = props.dimensions;

		renderChart(props.data, this.canvChart.optionCurrent, width, height, padding);

		return (
			<div className={'chart-container'}>
				<canvas width={width} height={height} ref={this.canvChart} className={'chart'}/>
				<canvas width={width} height={height} ref={this.canvPointer} className={'pointer'}/>
			</div>
		);
	}
}