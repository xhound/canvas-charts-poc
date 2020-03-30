import * as React from 'react';
import { getHeight, getWidth, getXScale, getFilteredData } from './selectors/D3Candles.selectors';
import { createOptionRef } from '../../utils/createOptionRef';
import './D3Candles.component.css';
import { renderCandles } from './helpers/D3Candles.helpers';
import { renderPointer } from './helpers/D3CandlePointer.helpers';
import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';
import { fromNullable, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

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

export interface TD3CandlesProps {
	width: number;
	height: number;
	data: TCandle[];
}

export class D3Candles extends React.Component<TD3CandlesProps> {
	private candlesRef = createOptionRef<HTMLCanvasElement>();
	private chartPointerRef = createOptionRef<HTMLCanvasElement>();

	componentDidUpdate() {
		const props = this.props;
		renderCandles(props, this.candlesRef.optionCurrent);
		renderPointer(props, this.chartPointerRef.optionCurrent, this.handleMouseMove);
	}

	componentDidMount(): void {
		const props = this.props;
		renderCandles(props, this.candlesRef.optionCurrent);
		renderPointer(props, this.chartPointerRef.optionCurrent, this.handleMouseMove);
	}

	handleMouseMove = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		const props = this.props;
		const xScale = getXScale(props);
		const data = fromNullable(getFilteredData(props)((candle: TCandle) => isWithinInterval(xScale.invert(x), {
			start: subMinutes(candle.x, 30), end: addMinutes(candle.x, 30)
		})));
		const xToRender = x + padding.left + 10;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fillRect(x + padding.left, padding.top, 130, 95);
		pipe(data,
			map(data => {
				ctx.fillStyle = 'black';
				ctx.font = '15px Arial';
				ctx.textAlign = 'left';
				const {open, close, high, low, volume} = data.y;
				ctx.fillText(`Open: ${open.toFixed(2)}`, xToRender, padding.top + 20);
				ctx.fillText(`Close: ${close.toFixed(2)}`, xToRender, padding.top + 35);
				ctx.fillText(`High: ${high.toFixed(2)}`, xToRender, padding.top + 50);
				ctx.fillText(`Low: ${low.toFixed(2)}`, xToRender, padding.top + 65);
				ctx.fillText(`Volume: ${volume.toFixed(2)}`, xToRender, padding.top + 80);
				return ctx;
			}))

	};

	render() {
		const props = this.props;
		const width = getWidth(props);
		const height = getHeight(props);

		return (
			<div className={'candles-container'}>
				<canvas width={width} height={height} ref={this.candlesRef} className={'chart'}/>
				<canvas width={width} height={height} ref={this.chartPointerRef} className={'pointer'}/>
			</div>
		)
	}
}