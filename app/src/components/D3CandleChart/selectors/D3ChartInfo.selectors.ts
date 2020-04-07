import { createSelector } from 'reselect';
import { getProps } from './D3CandleChart.selectors';

export const getChartInfoSettings = createSelector(getProps, props => props.settings.chartInfo);
export const getChartInfoFont = createSelector(getChartInfoSettings, settings => settings.font);
export const getChartInfoBackgroundColor = createSelector(getChartInfoSettings, settings => settings.backgroundColor);
export const getChartInfoTextColor = createSelector(getChartInfoSettings, settings => settings.textColor);