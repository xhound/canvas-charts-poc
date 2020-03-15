import * as React from 'react';
import {map, Option, chain, option, some} from 'fp-ts/lib/Option';
import {fromNullable} from 'fp-ts/es6/Option';
import {drawPointer, getCanvasContext, renderChart} from './helpers/Chart.helpers';
import {pipe} from "fp-ts/lib/pipeable";
import './Chart.component.css';
import {sequenceT} from "fp-ts/lib/Apply";

interface TDimensions {
    width: number;
    height: number;
}

interface TChartProps {
    data: number[][];
    dimensions: TDimensions;
}

export class Chart extends React.PureComponent<TChartProps> {
    componentDidMount(): void {
        const props = this.props;
        const {width, height} = props.dimensions;
        const canvChart: Option<HTMLCanvasElement> = fromNullable(document.getElementById('chart') as HTMLCanvasElement);
        const canvPointer: Option<HTMLCanvasElement> = fromNullable(document.getElementById('pointer') as HTMLCanvasElement);

        renderChart(props.data, canvChart, width, height);
        const preparePointer = drawPointer(width, height, 'red');

        pipe(canvPointer,
            chain(canv => pipe(sequenceT(option)(some(canv), getCanvasContext(canv)),
                map(([canv, ctx]) => canv.addEventListener('mousemove', preparePointer(ctx)))
                )))

    }

    render() {
        const props = this.props;
        const {width, height} = props.dimensions;
        return (
            <div className={'chart-container'}>
                <canvas width={width} height={height} id={'chart'} className={'chart'} />
                <canvas width={width} height={height} id={'pointer'} className={'pointer'} />
            </div>
        );
    }
}