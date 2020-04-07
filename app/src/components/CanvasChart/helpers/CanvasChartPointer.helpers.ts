import { chain, map, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { getCanvasContext } from '../../D3LineChart/helpers/D3LineChart.helpers';

export const createHandler = (onMouseMove: Function) => (ctx: CanvasRenderingContext2D) => {
	return (e: MouseEvent) => {
		const y = e.clientY;
		const x = e.clientX;
		const left = ctx.canvas.getBoundingClientRect().left;
		const top = ctx.canvas.getBoundingClientRect().top;

		onMouseMove(ctx, x - left, y - top);

		return ctx;
	};
};

export const renderPointer = (canv: Option<HTMLCanvasElement>, onMouseMove: Function) => {
	const handler = createHandler(onMouseMove);
	pipe(canv,
		chain(getCanvasContext),
		map(ctx => {
			ctx.canvas.addEventListener('mousemove', handler(ctx));
			return ctx;
		})
	);
};