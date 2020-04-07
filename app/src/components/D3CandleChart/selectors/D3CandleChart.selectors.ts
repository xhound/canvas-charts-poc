import { Endomorphism, identity } from 'fp-ts/lib/function';
import { createSelector } from 'reselect';
import { padding, TCandle, TD3CandleChartProps } from '../D3CandleChart.component';
import { getMaxValue, getMaxVolume, getMinValue } from '../helpers/D3CandleChart.helpers';
import { scaleLinear, scaleTime } from 'd3';
import { addHours, subHours } from 'date-fns';

export const getProps: Endomorphism<TD3CandleChartProps> = identity;

export const getCandleSettings = createSelector(getProps, props => props.settings.candle);
export const getCandleFont = createSelector(getCandleSettings, settings => settings.font);
export const getCandleBearColor = createSelector(getCandleSettings, settings => settings.bearColor);
export const getCandleBullColor = createSelector(getCandleSettings, settings => settings.bullColor);
export const getCandleNeutralColor = createSelector(getCandleSettings, settings => settings.neutralColor);
export const getCandleGridColor = createSelector(getCandleSettings, settings => settings.gridColor);
export const getCandleAxisLabelTextColor = createSelector(getCandleSettings, settings => settings.axisLabelTextColor);
export const getCandleVolumeColor = createSelector(getCandleSettings, settings => settings.volumeColor);

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
		return scaleLinear<number, number>().domain([min.y.low, max.y.high]).range([height, 0])
	}
);

export const getXScale = createSelector(getChartWidth, getData, (width, data) =>
	scaleTime().domain([subHours(data[ 0 ].x, 1), addHours(data[ data.length - 1 ].x, 1)]).range([0, width]));

export const getYTicks = createSelector(getYScale, getChartHeight,
	(yScale, chartHeight) => {
	const ticksCount = Math.floor(chartHeight / 60);
		return yScale.nice().ticks(ticksCount)
	});

export const getXTicks = createSelector(getXScale, getChartWidth, (xScale, chartWidth) => {
	const ticksCount = Math.floor(chartWidth / 150);
	return xScale.ticks(ticksCount);
});

export const getVolumeYScale = createSelector(getChartHeight, getData, (chartHeight, data) => {
	const max = getMaxVolume(data);
	return scaleLinear<number, number>().domain([max.y.volume, 0]).range([chartHeight / 5, 0])
});
