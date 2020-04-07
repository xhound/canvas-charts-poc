import { createSelector } from 'reselect';
import { getProps } from './D3CandleChart.selectors';

export const getPointerSettings = createSelector(getProps, props => props.settings.pointer);
export const getPointerFont = createSelector(getPointerSettings, settings => settings.font);
export const getPointerLineColor = createSelector(getPointerSettings, settings => settings.lineColor);
export const getPointerPillColor = createSelector(getPointerSettings, settings => settings.pillColor);
export const getPointerPillTextColor = createSelector(getPointerSettings, settings => settings.pillTextColor);