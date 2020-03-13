import { fromNullable } from 'fp-ts/es6/Option';

export const getCanvasContext = (el: HTMLCanvasElement) => fromNullable(el.getContext('2d'));

export const getAbsMax = (ds: number[]) => {
	return ds.reduce((acc, d) => Math.abs(d) > acc ? Math.abs(d) : acc, 0);
};

export const normalizeData = (data: number[], maxAbsValue: number) =>
	data.map(d => maxAbsValue && !isNaN(maxAbsValue) ? d / maxAbsValue : 0);

export const drawAbscissa = (width: number, offsetY: number) => (ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = 'black';

	ctx.moveTo(0, offsetY);
	ctx.lineTo(width, offsetY);
	ctx.stroke();
	ctx.beginPath();

	return ctx;
};

export const drawChart = (data: number[], width: number, offsetY: number, color?: string) =>
	(ctx: CanvasRenderingContext2D) => {
	const chartData = data.slice(1);

	const chartLength = chartData.length;
	if ( !chartLength ) {
		return ctx;
	}
	const offsetX = width / chartLength;

	ctx.strokeStyle = color || 'black';
	ctx.fillStyle = color || 'black';

	ctx.moveTo(0, offsetY);
	ctx.lineTo(0, offsetY - (offsetY - 20) * data[ 0 ]);
	chartData.forEach((d, i) => {
		ctx.lineTo(offsetX * (i + 1), offsetY - (offsetY - 20) * d);
	});
	ctx.lineTo(width, offsetY);
	ctx.closePath();

	ctx.stroke();
	ctx.fill();

	ctx.beginPath();

	return ctx;

};