import { Endomorphism, identity } from 'fp-ts/lib/function';
import { createSelector } from 'reselect';
import { area, line, scaleLinear, scaleTime } from 'd3';
import { padding, TChartPoint, TD3ChartProps } from '../D3Chart.component';
import { getMaxValue, getMinValue } from '../helpers/D3Chart.helpers';

const getProps: Endomorphism<TD3ChartProps> = identity;

export const getWidth = createSelector(getProps, props => props.width);
export const getHeight = createSelector(getProps, props => props.height);
export const getChartWidth = createSelector(getWidth, width => width - padding.left - padding.right);
export const getChartHeight = createSelector(getHeight, height => height - padding.top - padding.bottom);

export const getData = createSelector(getProps, props => props.data);
export const getYScale = createSelector(getChartHeight, getData, (height, data) => {
		const max = getMaxValue(data);
		const min = getMinValue(data);
		return scaleLinear<number, number>().domain([min.y, max.y]).range([height, 0])
	}
);
export const getXScale = createSelector(getChartWidth, getData, (width, data) =>
	scaleTime().domain([data[ 0 ].x, data[ data.length - 1 ].x]).range([0, width]));

export const getLine = (ctx: CanvasRenderingContext2D) => createSelector(getXScale, getYScale, (xScale, yScale) =>
	line<TChartPoint>().context(ctx).x(point => xScale(point.x)).y(point => yScale(point.y))
);

export const getArea = (ctx: CanvasRenderingContext2D) => createSelector(getXScale, getYScale, getChartHeight,
	(xScale, yScale, height) =>
		area<TChartPoint>().context(ctx).x(point => xScale(point.x)).y0(height).y1(point => yScale(point.y))
);

export const getYTicks = createSelector(getYScale,
	(yScale) =>
		yScale.ticks());

export const getXTicks = createSelector(getXScale, (xScale) =>
	xScale.nice().ticks());