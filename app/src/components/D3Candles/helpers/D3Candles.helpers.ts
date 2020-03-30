import { contramap, max, min, Ord, ordNumber } from 'fp-ts/lib/Ord';
import { TCandle, TD3CandlesProps } from '../D3Candles.component';
import {
	getChartHeight,
	getChartWidth, getData, getHeight, getWidth,
	getXScale,
	getXTicks,
	getYScale,
	getYTicks
} from '../selectors/D3Candles.selectors';
import { format } from 'date-fns';
import { chain, map, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { getCanvasContext, setRenderZeroPoint } from '../../D3Chart/helpers/D3Chart.helpers';
import { ScaleTime, ScaleLinear } from 'd3';
import { composeFromArray } from '../../../utils/function';
import { padding } from '../../D3Chart/D3Chart.component';

const ordCandleHigh: Ord<TCandle> = contramap((candle: TCandle) => candle.y.high)(ordNumber);
const ordCandleLow: Ord<TCandle> = contramap((candle: TCandle) => candle.y.low)(ordNumber);

export const getMinValue = (data: TCandle[]) => data.reduce((acc, value) =>
	min(ordCandleLow)(acc, value), data[ 0 ]);
export const getMaxValue = (data: TCandle[]) => data.reduce((acc, value) =>
	max(ordCandleHigh)(acc, value), data[ 0 ]);

const drawCandle = (candle: TCandle,
                    candleWidth: number,
                    xScale: ScaleTime<number, number>,
                    yScale: ScaleLinear<number, number>) => (ctx: CanvasRenderingContext2D) => {
		const { open, close, high, low } = candle.y;
		const x = xScale(candle.x);
		ctx.fillStyle = open < close ? 'green' : open > close ? 'red' : 'grey';
		ctx.strokeStyle = open < close ? 'green' : open > close ? 'red' : 'grey';
		ctx.lineWidth = 1;
		ctx.setLineDash([]);
		// draw candle line;
		ctx.moveTo(x, yScale(high));
		ctx.lineTo(x, yScale(low));
		ctx.stroke();
		ctx.beginPath();

		// draw candle rect
		const openY = yScale(open);
		const closeY = yScale(close);
		const candleY = openY <= closeY ? openY : closeY;
		const candlePadding = 10 * candleWidth / 100;
		const candleX = x - candleWidth / 2 + candlePadding;
		const width = candleWidth - 2 * candlePadding;
		const candleHeight = Math.abs(yScale(open) - yScale(close));
		const height = candleHeight < 1 ? 1 : candleHeight;

		ctx.fillRect( candleX, candleY, width, height);

		return ctx;
	};

const drawCandles = (props: TD3CandlesProps) => (ctx: CanvasRenderingContext2D) => {
	const xScale = getXScale(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);
	const data = getData(props);
	const dataLength = data.length;
	const candleWidth = chartWidth / dataLength;

	const candles = data.map(candle => drawCandle(candle, candleWidth, xScale, yScale));
	return composeFromArray(candles)(ctx);


};

export const drawYAxis = (props: TD3CandlesProps) => (ctx: CanvasRenderingContext2D) => {
	//render YAxis
	const yTicks = getYTicks(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);

	ctx.font = '1.5rem Arial';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';

	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'grey';
	ctx.lineWidth = 1;

	yTicks.map(tick => {
		const y = yScale(tick);
		ctx.setLineDash(tick === 0 ? [] : [2, 2]);
		ctx.moveTo(0, y);
		ctx.lineTo(chartWidth, y);
		ctx.stroke();
		ctx.beginPath();

		return ctx.fillText(tick.toString(), chartWidth + 10, y);
	});
	return ctx;
};

export const drawXAxis = (props: TD3CandlesProps) => (ctx: CanvasRenderingContext2D) => {
	const xTicks = getXTicks(props);
	const xScale = getXScale(props);
	const chartHeight = getChartHeight(props);
	xTicks.map((tick) => {
		const x = xScale(tick);
		ctx.textAlign = 'center';
		ctx.moveTo(x, 0);
		ctx.lineTo(x, chartHeight);
		ctx.stroke();
		ctx.beginPath();

		return ctx.fillText(format(tick, 'HH:mm'), x, chartHeight + 20);
	});

	return ctx;
};

export const clearCanvas = (props: TD3CandlesProps) => (ctx: CanvasRenderingContext2D) => {
	const width = getWidth(props);
	const height = getHeight(props);
	ctx.clearRect(0, 0, width, height);
	return ctx;
};

export const setZeroPointBack = (ctx: CanvasRenderingContext2D) => ctx.translate(-padding.left, -padding.top);

export const renderCandles = (props: TD3CandlesProps, canv: Option<HTMLCanvasElement>) => {
	const renderYAxis = drawYAxis(props);
	const renderXAxis = drawXAxis(props);
	const renderCandles = drawCandles(props);
	const clear = clearCanvas(props);

	pipe(canv,
		chain(getCanvasContext),
		map(flow(clear, setRenderZeroPoint, renderYAxis, renderXAxis, renderCandles, setZeroPointBack)),
	);
};