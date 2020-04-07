import * as React from 'react';
import { useOptionRef } from '../../utils/createOptionRef';
import { getHeight, getWidth } from './selectors/CanvasChart.selectors';
import { renderPointer } from './helpers/CanvasChartPointer.helpers';
import './CanvasChart.component.css';
import { Option } from 'fp-ts/lib/Option';

export const yAxisWidth = 100;
export const xAxisHeight = 50;

export const padding = {
	top: 20,
	right: 20 + yAxisWidth,
	left: 20,
	bottom: 20 + xAxisHeight,
};

export interface TCanvasChartProps {
	width: number;
	height: number;
	renderChart: (optionRef: Option<HTMLCanvasElement>) => void;
	renderOnMove: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
	onMouseMove?: Function;
}

export const CanvasChart = React.memo((props: TCanvasChartProps) => {
	const candlesRef = useOptionRef<HTMLCanvasElement>();
	const chartPointerRef = useOptionRef<HTMLCanvasElement>();
	const {renderOnMove, onMouseMove} = props;

	const handleMouseMove = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		renderOnMove(ctx, x, y);
		onMouseMove && onMouseMove(ctx, x, y);
	};

	React.useEffect(() => props.renderChart(candlesRef.optionCurrent));
	// actually, here said that even if it's render oftet, it's safety as React calls 'useEffect' after all layout changes
	// so possibly we could omit '[]' and do it on every render. But not sure.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(() => renderPointer(chartPointerRef.optionCurrent, handleMouseMove), []);

	const width = getWidth(props);
	const height = getHeight(props);

	return (
		<div className={'chart-container'} style={{width: `${width}px`}}>
			<canvas width={width} height={height} ref={candlesRef} className={'chart'}/>
			<canvas width={width} height={height} ref={chartPointerRef} className={'pointer'}/>
		</div>
	)
});
