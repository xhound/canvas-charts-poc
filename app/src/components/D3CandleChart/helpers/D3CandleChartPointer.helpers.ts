import { format } from 'date-fns';
import { padding, TD3CandleChartProps, } from '../D3CandleChart.component';
import { getChartHeight, getChartWidth, getXScale, getYScale } from '../selectors/D3CandleChart.selectors';
import {
	getPointerFont,
	getPointerLineColor,
	getPointerPillColor,
	getPointerPillTextColor
} from '../selectors/D3CandleChartPointer.selectors';

export const drawPointer = (props: TD3CandleChartProps, ctx: CanvasRenderingContext2D, x: number, y: number) => {
	const yScale = getYScale(props);
	const xScale = getXScale(props);
	const width = getChartWidth(props);
	const height = getChartHeight(props);
	const font = getPointerFont(props);
	const lineColor = getPointerLineColor(props);
	const pillColor = getPointerPillColor(props);
	const pillTextColor = getPointerPillTextColor(props);
	const areaWidth = width + padding.left;
	const areaHeight = height + padding.top;

	ctx.strokeStyle = lineColor;
	ctx.textBaseline = 'middle';

	if ( y < areaHeight && y > padding.top && x < areaWidth && x > padding.left ) {
		ctx.beginPath();
		ctx.moveTo(padding.left, y);
		ctx.lineTo(areaWidth, y);
		ctx.stroke();

		ctx.textAlign = 'left';
		ctx.font = font;
		const labelText = Math.floor(yScale.invert(y - padding.top)).toString();
		const labelWidth = ctx.measureText(labelText).width + 20;
		const startingX = areaWidth + 15;

		ctx.fillStyle = pillColor;
		ctx.moveTo(areaWidth, y);
		ctx.lineTo(startingX, y - 20);
		ctx.lineTo(startingX + labelWidth, y - 20);
		ctx.lineTo(startingX + labelWidth, y + 20);
		ctx.lineTo(startingX, y+ 20);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = pillTextColor;
		ctx.fillText(labelText, areaWidth + 20, y);
	}
	if ( x < areaWidth && x > padding.left ) {
		ctx.beginPath();
		ctx.moveTo(x, padding.top);
		ctx.lineTo(x, areaHeight);
		ctx.stroke();

		const labelText = format(xScale.invert(x - padding.left), 'HH:mm');
		const labelMeasurements = ctx.measureText(labelText);
		const labelWidth = labelMeasurements.width + 30;
		const labelHeight = 30;

		ctx.fillStyle = pillColor;
		ctx.moveTo(x, areaHeight);
		ctx.lineTo(x + 15, areaHeight + 15);
		ctx.lineTo(x + 15 + labelWidth / 4, areaHeight + 15);
		ctx.lineTo(x + 15 + labelWidth / 4, areaHeight + 15 + labelHeight);
		ctx.lineTo(x - 15 - labelWidth / 4, areaHeight + 15 + labelHeight);
		ctx.lineTo(x - 15 - labelWidth / 4, areaHeight + 15);
		ctx.lineTo(x - 15, areaHeight + 15);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = pillTextColor;
		ctx.textAlign = 'center';
		ctx.font = font;
		ctx.fillText(labelText, x, areaHeight + 30);
	}

	ctx.beginPath();
};