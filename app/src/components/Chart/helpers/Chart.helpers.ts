import { fromNullable } from 'fp-ts/es6/Option';
import { composeFromArray } from '../../../utils/function';
import { chain, map, Option, getOrElse } from 'fp-ts/lib/Option';
import { flatten } from 'fp-ts/lib/Array';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { TPadding } from '../Chart.component';

const chartColors = [
	'green',
	'blue',
	'magenta',
	'orange',
	'black',
];

const lineDashes = [
	[],
	[2, 5],
	[2, 7, 2],
	[5, 7, 5],
	[5, 15, 5],
];

const getChartColor = (i: number) => {
	if ( (i + 1) % 5 === 0 ) {
		return chartColors[ i ];
	}
	if ( (i + 1) % 4 === 0 ) {
		return chartColors[ i ];
	} else if ( (i + 1) % 3 === 0 ) {
		return chartColors[ i ];
	} else if ( (i + 1) % 2 === 0 ) {
		return chartColors[ i ];
	} else {
		return chartColors[ 0 ];
	}
};

const getDashes = (i: number) => {
	if ( (i + 1) % 5 === 0 ) {
		return lineDashes[ i ];
	}
	if ( (i + 1) % 4 === 0 ) {
		return lineDashes[ i ];
	} else if ( (i + 1) % 3 === 0 ) {
		return lineDashes[ i ];
	} else if ( (i + 1) % 2 === 0 ) {
		return lineDashes[ i ];
	} else {
		return lineDashes[ 0 ];
	}
};

export const getCanvasContext = (el: HTMLCanvasElement) => fromNullable(el.getContext('2d'));

export const getMin = (ds: number[]) => {
	return ds.reduce((acc, d) => d < acc ? d : acc, 0);
};

export const getMax = (ds: number[]) => {
	return ds.reduce((acc, d) => d > acc ? d : acc, 0);
};

export const getRatioY = (data: number[], height: number) => {
	const min = getMin(data);
	const max = getMax(data);

	let ratioY: number;
	const absMax = Math.abs(max);
	const absMin = Math.abs(min);

	if ( min >= 0 ) {
		ratioY = height / absMax;
	} else if ( max < 0 ) {
		ratioY = height / absMin;
	} else {
		ratioY = height / (absMin + absMax);
	}

	return ratioY;
};

export const normalizeData = (data: number[], ratio: number) => {
	return data.map(d => d * ratio);
};

export const drawAbscissa = (width: number, zeroPoint: number, paddingLeft: number) => (ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = 'black';
	ctx.setLineDash([]);

	ctx.moveTo(paddingLeft, zeroPoint);
	ctx.lineTo(width, zeroPoint);
	ctx.stroke();
	ctx.beginPath();

	return ctx;
};

export const drawOrdinate = (width: number, height: number, paddingTop: number) => (ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = 'black';
	ctx.setLineDash([]);

	ctx.moveTo(width, paddingTop);
	ctx.lineTo(width, height);
	ctx.stroke();
	ctx.beginPath();

	return ctx;
};

export const drawChart = (data: number[], width: number, zeroPoint: number, paddingLeft: number, color?: string, lineDash?: number[]) =>
	(ctx: CanvasRenderingContext2D) => {
		const chartData = data.slice(1);

		const chartLength = chartData.length;
		if ( !chartLength ) {
			return ctx;
		}
		const offsetX = width / chartLength;

		ctx.strokeStyle = color || 'black';
		ctx.setLineDash(lineDash || []);

		ctx.moveTo(paddingLeft, zeroPoint - data[ 0 ]);
		chartData.forEach((d, i) => {
			ctx.lineTo(paddingLeft + offsetX * (i + 1), zeroPoint - d);
		});

		ctx.stroke();

		ctx.beginPath();

		return ctx;
	};

export const renderChart = (data: number[][], canv: Option<HTMLCanvasElement>, width: number, height: number, padding: Option<TPadding>) => {
	const flatData = flatten(data);
	const paddingTop = pipe(padding, chain(padding => padding.top), getOrElse(() => 0));
	const paddingBottom = pipe(padding, chain(padding => padding.bottom), getOrElse(() => 0));
	const paddingLeft = pipe(padding, chain(padding => padding.left), getOrElse(() => 0));
	const paddingRight = pipe(padding, chain(padding => padding.right), getOrElse(() => 0));

	const chartHeight = height - paddingTop - paddingBottom;
	const chartWidth = width - paddingLeft - paddingRight;

	const ratio = getRatioY(flatData, chartHeight);

	const zeroPoint = getMax(flatData) * ratio + paddingTop;

	const chartsSetup = data
		.map(d => normalizeData(d, ratio))
		.map((d, i) => {
			return drawChart(d, chartWidth, zeroPoint, paddingLeft, getChartColor(i), getDashes(i))
		});

	const drawCharts = composeFromArray(chartsSetup);

	const drawAbscissaLine = drawAbscissa(width - paddingRight, zeroPoint, paddingLeft);
	const drawOrdinateLine = drawOrdinate(width - paddingRight, height - paddingBottom, paddingTop);

	pipe(canv,
		chain(getCanvasContext),
		map(ctx => {
			ctx.clearRect(0, 0, width, height);
			return ctx;
		}),
		map(flow(drawCharts, drawAbscissaLine, drawOrdinateLine))
	);
};