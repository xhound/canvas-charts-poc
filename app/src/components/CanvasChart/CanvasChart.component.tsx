import * as React from 'react';
import { createOptionRef } from '../../utils/createOptionRef';
import { getHeight, getWidth } from './selectors/CanvasChart.selectors';
import { renderPointer } from './helpers/CanvasChartPointer.helpers';
import './CanvasChart.component.css';

export const yAxisWidth = 100;
export const xAxisHeight = 50;

export const padding = {
	top: 20,
	right: 20 + yAxisWidth,
	left: 20,
	bottom: 20 + xAxisHeight,
};

export interface TCanvasChartProps {
	width: number;
	height: number;
	renderChart: Function;
	renderOnMove: Function;
	onMouseMove?: Function;
}

export class CanvasChart<T> extends React.Component<TCanvasChartProps & T> {
	private candlesRef = createOptionRef<HTMLCanvasElement>();
	private chartPointerRef = createOptionRef<HTMLCanvasElement>();

	componentDidUpdate(prevProps: TCanvasChartProps) {
		const props = this.props;
		props.renderChart(props, this.candlesRef.optionCurrent);
	}

	componentDidMount(): void {
		const props = this.props;
		props.renderChart(props, this.candlesRef.optionCurrent);
		renderPointer(this.chartPointerRef.optionCurrent, this.handleMouseMove);
	}

	handleMouseMove = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		const props = this.props;
		props.renderOnMove(props, ctx, x, y);
		props.onMouseMove && props.onMouseMove(ctx, x, y)

	};

	render() {
		const props = this.props;
		const width = getWidth(props);
		const height = getHeight(props);

		return (
			<div className={'chart-container'} style={{width: `${width}px`}}>
				<canvas width={width} height={height} ref={this.candlesRef} className={'chart'}/>
				<canvas width={width} height={height} ref={this.chartPointerRef} className={'pointer'}/>
			</div>
		)
	}
}