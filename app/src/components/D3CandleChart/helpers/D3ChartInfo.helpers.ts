import {
	getChartInfoBackgroundColor,
	getChartInfoFont,
	getChartInfoTextColor
} from '../selectors/D3ChartInfo.selectors';
import { getChartHeight, getChartWidth, getFilteredData, getXScale } from '../selectors/D3CandleChart.selectors';
import { fromNullable, map } from 'fp-ts/lib/Option';
import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';
import { pipe } from 'fp-ts/lib/pipeable';
import { max, ordNumber } from 'fp-ts/lib/Ord';
import { padding, TCandle, TD3CandleChartProps } from '../D3CandleChart.component';

export const renderChartInfo = (props: TD3CandleChartProps, ctx: CanvasRenderingContext2D, x: number, y: number) => {
	const font = getChartInfoFont(props);
	const textColor = getChartInfoTextColor(props);
	const backgroundColor = getChartInfoBackgroundColor(props);

	const xScale = getXScale(props);
	const chartWidth = getChartWidth(props);
	const chartHeight = getChartHeight(props);
	const data = fromNullable(getFilteredData(props)((candle: TCandle) => isWithinInterval(xScale.invert(x), {
		start: subMinutes(candle.x, 30), end: addMinutes(candle.x, 30)
	})));
	const xToRender = x + padding.left + 10;
	const areaWidth = chartWidth + padding.left;
	const areaHeight = chartHeight + padding.top;
	ctx.clearRect(0, 0, areaWidth + padding.right, areaHeight + padding.bottom);
	pipe(data,
		map(data => {
			ctx.font = font;
			const { open, close, high, low, volume } = data.y;
			const labels = [`O: ${open.toFixed(2)}`,
				`C: ${close.toFixed(2)}`,
				`H: ${high.toFixed(2)}`,
				`L: ${low.toFixed(2)}`,
				`V: ${volume.toFixed(2)}`];

			ctx.fillStyle = backgroundColor;

			const backWidth = labels.map(label => ctx.measureText(label).width).reduce((acc, value) =>
				max(ordNumber)(acc, value), 0) + 20;
			if (chartWidth - x <= backWidth) {
				ctx.fillRect(x + padding.left - backWidth - 1, padding.top, backWidth, 95);

				ctx.fillStyle = textColor;
				ctx.textAlign = 'left';

				labels.forEach((label, i) => {
					ctx.fillText(label, xToRender - backWidth, padding.top + 20 + i * 15);
				});
			} else {
				ctx.fillRect(x + padding.left + 1, padding.top, backWidth, 95);
				ctx.fillStyle = textColor;
				ctx.textAlign = 'left';
				labels.forEach((label, i) => {
					ctx.fillText(label, xToRender, padding.top + 20 + i * 15);
				});
			}
			return ctx;
		}))

};