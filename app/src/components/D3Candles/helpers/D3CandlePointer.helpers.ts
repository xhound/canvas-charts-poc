import { format } from 'date-fns';
import { padding, TD3CandlesProps, xAxisHeight, yAxisWidth } from '../D3Candles.component';
import { getChartHeight, getChartWidth, getData, getXScale, getYScale } from '../selectors/D3Candles.selectors';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, map, Option } from 'fp-ts/lib/Option';
import { getCanvasContext } from '../../D3Chart/helpers/D3Chart.helpers';

export const drawPointer = (props: TD3CandlesProps, onMouseMove: Function, color?: string) => {
	const yScale = getYScale(props);
	const xScale = getXScale(props);
	const width = getChartWidth(props);
	const height = getChartHeight(props);

	return (ctx: CanvasRenderingContext2D) => {
		ctx.strokeStyle = color || 'black';
		return (e: MouseEvent) => {
			const areaWidth = width + padding.left;
			const areaHeight = height + padding.top;
			ctx.clearRect(0, 0, areaWidth + padding.right, areaHeight + padding.bottom);
			const y = e.clientY;
			const x = e.clientX;

			if (y < areaHeight && y > padding.top) {
				ctx.moveTo(padding.left, y);
				ctx.lineTo(areaWidth, y);
				ctx.stroke();

				ctx.fillStyle = 'red';
				ctx.fillRect(areaWidth, y - 20, yAxisWidth , 40);
				ctx.fillStyle = 'white';
				ctx.textAlign = 'left';
				ctx.font = '1.5rem Arial';
				ctx.fillText(Math.floor(yScale.invert(y - padding.top)).toString(), areaWidth + 10, y);
			}
			if (x < areaWidth && x > padding.left) {
				ctx.beginPath();
				ctx.moveTo(x, padding.top);
				ctx.lineTo(x, areaHeight);
				ctx.stroke();

				ctx.fillStyle = 'red';
				ctx.fillRect(x - 50, areaHeight,  100, xAxisHeight);
				ctx.fillStyle = 'white';
				ctx.textAlign = 'center';
				ctx.font = '1.5rem Arial';
				ctx.fillText(format(xScale.invert(x - padding.left), 'HH:mm'), x, areaHeight + 20);
			}

			ctx.beginPath();
			onMouseMove(ctx, x - padding.left, y - padding.top);

			return ctx;
		}
	};
};

export const renderPointer = (props: TD3CandlesProps, canv: Option<HTMLCanvasElement>, onMouseMove: Function) => {
	const renderPointer = drawPointer(props, onMouseMove,'red');
	pipe(canv,
		chain(getCanvasContext),
		map(ctx => {
			ctx.textBaseline = 'middle';
			return ctx
		}),
		map(ctx => {
			ctx.canvas.addEventListener('mousemove', renderPointer(ctx));
			return ctx;
		})
	);
};