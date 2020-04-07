import { contramap, max, min, Ord, ordNumber } from 'fp-ts/lib/Ord';
import { TCandle, TD3CandleChartProps } from '../D3CandleChart.component';
import {
	getCandleAxisLabelTextColor, getCandleBearColor, getCandleBullColor,
	getCandleFont, getCandleGridColor, getCandleNeutralColor, getCandleVolumeColor,
	getChartHeight,
	getChartWidth, getData, getHeight, getVolumeYScale, getWidth,
	getXScale,
	getXTicks,
	getYScale,
	getYTicks
} from '../selectors/D3CandleChart.selectors';
import { format } from 'date-fns';
import { chain, map, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { getCanvasContext, setRenderZeroPoint } from '../../D3LineChart/helpers/D3LineChart.helpers';
import { ScaleTime, ScaleLinear } from 'd3';
import { composeFromArray } from '../../../utils/function';

const ordCandleHigh: Ord<TCandle> = contramap((candle: TCandle) => candle.y.high)(ordNumber);
const ordCandleLow: Ord<TCandle> = contramap((candle: TCandle) => candle.y.low)(ordNumber);
const ordCandleVolume: Ord<TCandle> = contramap((candle: TCandle) => candle.y.volume)(ordNumber);

export const getMinValue = (data: TCandle[]) => data.reduce((acc, value) =>
	min(ordCandleLow)(acc, value), data[ 0 ]);

export const getMaxValue = (data: TCandle[]) => data.reduce((acc, value) =>
	max(ordCandleHigh)(acc, value), data[ 0 ]);

export const getMaxVolume = (data: TCandle[]) => data.reduce((acc, value) =>
	max(ordCandleVolume)(acc, value), data[ 0 ]);

const drawCandle = (candle: TCandle,
                    candleWidth: number,
                    xScale: ScaleTime<number, number>,
                    yScale: ScaleLinear<number, number>,
                    colors: {
	                    bear: string;
	                    bull: string;
	                    neutral: string;
                    }) => (ctx: CanvasRenderingContext2D) => {
	const { open, close, high, low } = candle.y;
	const x = xScale(candle.x);
	ctx.fillStyle = open < close ? colors.bull : open > close ? colors.bear : colors.neutral;
	ctx.strokeStyle = open < close ? colors.bull : open > close ? colors.bear : colors.neutral;
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

	ctx.fillRect(candleX, candleY, width, height);

	return ctx;
};

const drawVolume = (candle: TCandle,
                    candleWidth: number,
                    chartHeight: number,
                    xScale: ScaleTime<number, number>,
                    yScale: ScaleLinear<number, number>,
                    color: string) => (ctx: CanvasRenderingContext2D) => {
	const { volume } = candle.y;
	const x = xScale(candle.x);
	ctx.fillStyle = color;

	// draw volume rect
	const volumeY = yScale(volume);
	const volumePadding = 10 * candleWidth / 100;
	const candleX = x - candleWidth / 2 + volumePadding;
	const width = candleWidth - 2 * volumePadding;
	const volumeHeight = volumeY;
	const height = volumeHeight < 1 ? 1 : volumeHeight;
	ctx.fillRect(candleX, chartHeight - volumeY, width, height);

	return ctx;
};

const drawCandles = (props: TD3CandleChartProps) => (ctx: CanvasRenderingContext2D) => {
	const xScale = getXScale(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);
	const data = getData(props);
	const dataLength = data.length;

	const candleWidth = chartWidth / dataLength;
	const colors = {
		bear: getCandleBearColor(props),
		bull: getCandleBullColor(props),
		neutral: getCandleNeutralColor(props),
	};

	const candles = data.map(candle => drawCandle(candle, candleWidth, xScale, yScale, colors));
	return composeFromArray(candles)(ctx);
};

const drawVolumes = (props: TD3CandleChartProps) => (ctx: CanvasRenderingContext2D) => {
	const xScale = getXScale(props);
	const yScale = getVolumeYScale(props);
	const chartWidth = getChartWidth(props);
	const chartHeight = getChartHeight(props);
	const data = getData(props);
	const dataLength = data.length;

	const candleWidth = chartWidth / dataLength;
	const color = getCandleVolumeColor(props);

	const volumes = data.map(candle => drawVolume(candle, candleWidth,  chartHeight, xScale, yScale, color));
	return composeFromArray(volumes)(ctx);
};

export const drawYAxis = (props: TD3CandleChartProps) => (ctx: CanvasRenderingContext2D) => {
	//render YAxis
	const yTicks = getYTicks(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);
	const font = getCandleFont(props);
	const gridColor = getCandleGridColor(props);
	const axisLabelTextColor = getCandleAxisLabelTextColor(props);

	ctx.font = font;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';

	ctx.fillStyle = axisLabelTextColor;
	ctx.strokeStyle = gridColor;
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

export const drawXAxis = (props: TD3CandleChartProps) => (ctx: CanvasRenderingContext2D) => {
	const xTicks = getXTicks(props);
	const xScale = getXScale(props);
	const chartHeight = getChartHeight(props);
	const font = getCandleFont(props);
	const gridColor = getCandleGridColor(props);
	const axisLabelTextColor = getCandleAxisLabelTextColor(props);

	ctx.font = font;
	ctx.fillStyle = axisLabelTextColor;
	ctx.strokeStyle = gridColor;
	ctx.lineWidth = 1;

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

export const clearCanvas = (props: TD3CandleChartProps) => (ctx: CanvasRenderingContext2D) => {
	const width = getWidth(props);
	const height = getHeight(props);
	ctx.clearRect(0, 0, width, height);
	return ctx;
};

export const setZeroPointBack = (ctx: CanvasRenderingContext2D) => ctx.resetTransform();

export const renderCandles = (props: TD3CandleChartProps, canv: Option<HTMLCanvasElement>) => {
	const renderYAxis = drawYAxis(props);
	const renderXAxis = drawXAxis(props);
	const renderCandles = drawCandles(props);
	const renderVolumes = drawVolumes(props);
	const clear = clearCanvas(props);

	pipe(canv,
		chain(getCanvasContext),
		map(flow(clear, setRenderZeroPoint, renderYAxis, renderXAxis, renderCandles, renderVolumes, setZeroPointBack)),
	);
};