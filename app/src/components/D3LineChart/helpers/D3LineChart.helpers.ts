import { contramap, max, min, Ord, ordNumber } from 'fp-ts/lib/Ord';
import { padding, TChartPoint, TD3LineChartProps } from '../D3LineChart.component';
import { fromNullable } from 'fp-ts/es6/Option';
import {
	getArea,
	getHeight, getWidth,
	getChartHeight,
	getChartWidth,
	getData,
	getLine, getXScale, getXTicks,
	getYScale,
	getYTicks, getFont, getAxisLabelTextColor, getGridColor, getLineColor, getAreaColor
} from '../selectors/D3LineChart.selectors';
import { format } from 'date-fns';
import { chain, map, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';

const ordChartPoint: Ord<TChartPoint> = contramap((point: TChartPoint) => point.y)(ordNumber);
export const getMinValue = (data: TChartPoint[]) => data.reduce((acc, val) =>
	min(ordChartPoint)(acc, val), data[ 0 ]);
export const getMaxValue = (data: TChartPoint[]) => data.reduce((acc, val) =>
	max(ordChartPoint)(acc, val), data[ 0 ]);

export const getCanvasContext = (el: HTMLCanvasElement) => fromNullable(el.getContext('2d'));

export const setRenderZeroPoint = (ctx: CanvasRenderingContext2D) => {
	// set (0,0) point according padding
	ctx.translate(padding.left, padding.top);
	return ctx;
};

export const drawLine = (props: TD3LineChartProps) => (ctx: CanvasRenderingContext2D) => {
	// render line and area
	const data = getData(props);
	const lineColor = getLineColor(props);
	const areaColor = getAreaColor(props);
	const line = getLine(props);

	const area = getArea(props);
	const grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * .9);
	grd.addColorStop(0, areaColor);
	grd.addColorStop(1, 'white');

	area.context(ctx)(data);
	ctx.fillStyle = grd;
	ctx.fill();
	ctx.beginPath();

	ctx.lineWidth = 2;
	ctx.setLineDash([]);
	ctx.strokeStyle = lineColor;
	line.context(ctx)(data);
	ctx.stroke();
	ctx.beginPath();

	return ctx;
};

export const drawYAxis = (props: TD3LineChartProps) => (ctx: CanvasRenderingContext2D) => {
	//render YAxis
	const yTicks = getYTicks(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);
	const font = getFont(props);
	const axisLabelTextColor = getAxisLabelTextColor(props);
	const gridColor = getGridColor(props);

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

export const drawXAxis = (props: TD3LineChartProps) => (ctx: CanvasRenderingContext2D) => {
	const xTicks = getXTicks(props);
	const xScale = getXScale(props);
	const chartHeight = getChartHeight(props);
	xTicks.forEach(tick => {
		const x = xScale(tick);
		ctx.textAlign = 'center';
		ctx.setLineDash([2, 2]);
		ctx.moveTo(x, 0);
		ctx.lineTo(x, chartHeight);
		ctx.stroke();
		ctx.beginPath();

		ctx.fillText(format(tick, 'MM/dd/yy'), x, chartHeight + 20)
	});
	ctx.beginPath();
	return ctx;
};

export const clearCanvas = (props: TD3LineChartProps) => (ctx: CanvasRenderingContext2D) => {
	const width = getWidth(props);
	const height = getHeight(props);
	ctx.clearRect(0, 0, width, height);
	return ctx;
};

export const setZeroPointBack = (ctx: CanvasRenderingContext2D) => ctx.resetTransform();

export const renderLineChart = (props: TD3LineChartProps, canv: Option<HTMLCanvasElement>) => {
	const renderLine = drawLine(props);
	const renderYAxis = drawYAxis(props);
	const renderXAxis = drawXAxis(props);
	const clear = clearCanvas(props);

	pipe(canv,
		chain(getCanvasContext),
		map(flow(clear, setRenderZeroPoint, renderLine, renderYAxis, renderXAxis, setZeroPointBack))
	);
};