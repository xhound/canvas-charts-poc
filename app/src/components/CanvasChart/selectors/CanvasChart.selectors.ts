import { Endomorphism, identity } from 'fp-ts/lib/function';
import { createSelector } from 'reselect';
import { TCanvasChartProps } from '../CanvasChart.component';

export const getProps: Endomorphism<TCanvasChartProps> = identity;
export const getWidth = createSelector(getProps, (props) => props.width);
export const getHeight = createSelector(getProps, (props) => props.height);