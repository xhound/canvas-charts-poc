import {fromNullable} from 'fp-ts/es6/Option';
import {composeFromArray} from "../../../utils/function";
import {chain, map, Option} from "fp-ts/lib/Option";
import {flatten} from "fp-ts/lib/Array";
import {flow} from "fp-ts/lib/function";
import {pipe} from "fp-ts/lib/pipeable";

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

    if (min >= 0) {
        ratioY = height / absMax;
    } else if (max < 0) {
        ratioY = height / absMin;
    } else {
        ratioY = height / (absMin + absMax);
    }

    return ratioY;
};

export const normalizeData = (data: number[], ratio: number) => {
    return data.map(d => d * ratio);
};

export const drawAbscissa = (width: number, zeroPoint: number) => (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';

    ctx.moveTo(0, zeroPoint);
    ctx.lineTo(width, zeroPoint);
    ctx.stroke();
    ctx.beginPath();

    return ctx;
};

export const drawChart = (data: number[], width: number, zeroPoint: number, color?: string) =>
    (ctx: CanvasRenderingContext2D) => {
        const chartData = data.slice(1);

        const chartLength = chartData.length;
        if (!chartLength) {
            return ctx;
        }
        const offsetX = width / chartLength;

        ctx.strokeStyle = color || 'black';

        ctx.moveTo(0, zeroPoint - data[0]);
        chartData.forEach((d, i) => {
            ctx.lineTo(offsetX * (i + 1), zeroPoint - d);
        });

        ctx.stroke();

        ctx.beginPath();

        return ctx;
    };

export const renderChart = (data: number[][], canv: Option<HTMLCanvasElement>, width: number, height: number) => {
    const flatData = flatten(data);
    const ratio = getRatioY(flatData, height);

    const zeroPoint = getMax(flatData) * getRatioY(flatData, height);

    const chartsSetup = data
        .map(d => normalizeData(d, ratio))
        .map(d => drawChart(d, width, zeroPoint));

    const drawCharts = composeFromArray(chartsSetup);

    const drawAbscissaLine = drawAbscissa(width, zeroPoint);

    pipe(canv,
        chain(getCanvasContext),
        map(flow(drawCharts, drawAbscissaLine))
    );
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