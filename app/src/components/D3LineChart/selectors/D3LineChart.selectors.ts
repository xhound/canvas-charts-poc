import { Endomorphism, identity } from 'fp-ts/lib/function';
import { createSelector } from 'reselect';
import { area, line, scaleLinear, scaleTime } from 'd3';
import { padding, TChartPoint, TD3LineChartProps } from '../D3LineChart.component';
import { getMaxValue, getMinValue } from '../helpers/D3LineChart.helpers';

export const getProps: Endomorphism<TD3LineChartProps> = identity;

export const getLineChartSettings = createSelector(getProps, props => props.settings.chart);
export const getLineColor = createSelector(getLineChartSettings, settings => settings.lineColor);
export const getAreaColor = createSelector(getLineChartSettings, settings => settings.areaColor);
export const getGridColor = createSelector(getLineChartSettings, settings => settings.gridColor);
export const getAxisLabelTextColor = createSelector(getLineChartSettings, settings => settings.axisLabelTextColor);
export const getFont = createSelector(getLineChartSettings, settings => settings.font);

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
export const getXScale = createSelector(getChartWidth, getData, (width, data) => {
	return scaleTime().domain([data[ 0 ].x, data[ data.length - 1 ].x]).range([0, width]);
});

export const getLine = createSelector(getXScale, getYScale, (xScale, yScale) =>
	line<TChartPoint>().x(point => xScale(point.x)).y(point => yScale(point.y))
);

export const getArea = createSelector(getXScale, getYScale, getChartHeight,
	(xScale, yScale, height) =>
		area<TChartPoint>().x(point => xScale(point.x)).y0(height).y1(point => yScale(point.y))
);

export const getYTicks = createSelector(getYScale, getChartHeight,
	(yScale, chartHeight) => {
		const ticksCount = Math.floor(chartHeight / 60);
		return yScale.nice().ticks(ticksCount);
	});

export const getXTicks = createSelector(getXScale, getChartWidth, (xScale, chartWidth) => {
	const ticksCount = Math.floor(chartWidth / 150);
	return xScale.ticks(ticksCount);
});