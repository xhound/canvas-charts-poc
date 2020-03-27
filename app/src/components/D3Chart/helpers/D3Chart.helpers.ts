import { contramap, max, min, Ord, ordNumber } from 'fp-ts/lib/Ord';
import { padding, TChartPoint, TD3ChartProps } from '../D3Chart.component';
import { fromNullable } from 'fp-ts/es6/Option';
import {
	getArea,
	getChartHeight,
	getChartWidth,
	getData,
	getLine, getXScale, getXTicks,
	getYScale,
	getYTicks
} from '../selectors/D3Chart.selectors';
import { format } from "date-fns";
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

export const drawLine = (props: TD3ChartProps) => (ctx: CanvasRenderingContext2D) => {
	// render line and area
	const data = getData(props);
	const line = getLine(ctx)(props);

	ctx.lineWidth = 3;
	ctx.strokeStyle = 'green';
	line(data);
	ctx.stroke();
	ctx.beginPath();

	const area = getArea(ctx)(props);
	const grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * .9);
	grd.addColorStop(0, 'lime');
	grd.addColorStop(1, 'white');

	area(data);
	ctx.fillStyle = grd;
	ctx.fill();
	ctx.beginPath();
	return ctx;
};

export const drawYAxis = (props: TD3ChartProps) => (ctx: CanvasRenderingContext2D) => {
	//render YAxis
	const yTicks = getYTicks(props);
	const yScale = getYScale(props);
	const chartWidth = getChartWidth(props);

	ctx.font = '1.5rem Arial';
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

export const drawXAxis = (props: TD3ChartProps) => (ctx: CanvasRenderingContext2D) => {
	const xTicks = getXTicks(props);
	const xScale = getXScale(props);
	const chartHeight = getChartHeight(props);
	xTicks.map(tick => {
		const x = xScale(tick);
		ctx.textAlign = 'center';
		ctx.moveTo(x, 0);
		ctx.lineTo(x, chartHeight);
		ctx.stroke();
		ctx.beginPath();

		return ctx.fillText(format(tick, 'MM/dd/yy'), x, chartHeight + 20)
	})
};

export const renderLineChart = (props: TD3ChartProps, canv: Option<HTMLCanvasElement>) => {
	const renderLine = drawLine(props);
	const renderYAxis = drawYAxis(props);
	const renderXAxis = drawXAxis(props);

	pipe(canv,
		chain(getCanvasContext),
		map(flow(setRenderZeroPoint, renderLine, renderYAxis, renderXAxis))
	);
};