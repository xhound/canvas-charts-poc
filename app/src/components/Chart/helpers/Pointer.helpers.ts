import { getCanvasContext } from './Chart.helpers';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, map, Option, option, some } from 'fp-ts/lib/Option';
import { sequenceT } from 'fp-ts/lib/Apply';

export const renderPointer = (pointerCanv: Option<HTMLCanvasElement>, width: number, height: number, color?: string) => {
	const pointerColor = color || 'red';
	const preparePointer = drawPointer(width, height, pointerColor);

	pipe(pointerCanv,
		chain(canv => pipe(sequenceT(option)(some(canv), getCanvasContext(canv)),
			map(([canv, ctx]) => canv.addEventListener('mousemove', preparePointer(ctx)))
		)))
};

export const drawPointer = (width: number, height: number, color?: string) =>
	(ctx: CanvasRenderingContext2D) => {
		ctx.strokeStyle = color || 'black';
		return (e: MouseEvent) => {
			ctx.clearRect(0, 0, width, height);
			ctx.moveTo(0, e.clientY);
			ctx.lineTo(width, e.clientY);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(e.clientX, 0);
			ctx.lineTo(e.clientX, height);
			ctx.stroke();

			ctx.beginPath();

			return ctx;
		}
	};