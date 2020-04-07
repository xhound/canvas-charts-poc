import { createSelector } from 'reselect';
import { getProps } from './D3LineChart.selectors';

export const getLineChartPointerSettings = createSelector(getProps, props => props.settings.pointer);
export const getPointerFont = createSelector(getLineChartPointerSettings, settings => settings.font);
export const getPointerLineColor = createSelector(getLineChartPointerSettings, settings => settings.lineColor);
export const getPointerPillColor = createSelector(getLineChartPointerSettings, settings => settings.pillColor);
export const getPointerPillTextColor = createSelector(getLineChartPointerSettings, settings => settings.pillTextColor);