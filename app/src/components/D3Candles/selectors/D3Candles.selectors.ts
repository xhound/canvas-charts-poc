import { Endomorphism, identity } from 'fp-ts/lib/function';
import { createSelector } from 'reselect';
import { padding, TCandle, TD3CandlesProps } from '../D3Candles.component';
import { getMaxValue, getMinValue } from '../helpers/D3Candles.helpers';
import { scaleLinear, scaleTime } from 'd3';
import { addHours, subHours } from 'date-fns';

const getProps: Endomorphism<TD3CandlesProps> = identity;

export const getWidth = createSelector(getProps, props => props.width);
export const getHeight = createSelector(getProps, props => props.height);
export const getChartWidth = createSelector(getWidth, width => width - padding.left - padding.right);
export const getChartHeight = createSelector(getHeight, height => height - padding.top - padding.bottom);

export const getData = createSelector(getProps, props => props.data);
export const getFilteredData = createSelector(getData, (data) =>
	(predicate: (candle: TCandle) => boolean) => data.find(predicate));
export const getYScale = createSelector(getChartHeight, getData, (height, data) => {
		const max = getMaxValue(data);
		const min = getMinValue(data);
		return scaleLinear<number, number>().domain([min.y.low, max.y.high]).range([height - 150, 0])
	}
);
export const getXScale = createSelector(getChartWidth, getData, (width, data) =>
	scaleTime().domain([subHours(data[ 0 ].x, 1), addHours(data[ data.length - 1 ].x, 1)]).range([0, width]));

export const getYTicks = createSelector(getYScale,
	(yScale) =>
		yScale.nice().ticks(8));

export const getXTicks = createSelector(getXScale, (xScale) =>
	xScale.ticks(6));
