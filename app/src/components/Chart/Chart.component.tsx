import * as React from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, map, Option } from 'fp-ts/lib/Option';
import { fromNullable } from 'fp-ts/es6/Option';
import { flow } from 'fp-ts/lib/function';
import { drawAbscissa, drawChart, getAbsMax, normalizeData, getCanvasContext } from './helpers/Chart.helpers';

interface TDimensions {
	width: number;
	height: number;
}

interface TChartProps {
	data: number[];
	dimensions: TDimensions;
}

export class Chart extends React.PureComponent<TChartProps> {
	componentDidMount(): void {
		const props = this.props;
		const { width, height } = props.dimensions;
		const canv: Option<HTMLCanvasElement> = fromNullable(document.getElementById('canvas') as HTMLCanvasElement);

		const offsetY = height / 2;

		const maxAbsValue = getAbsMax(props.data);

		const data = normalizeData(props.data, maxAbsValue);

		const drawAbscissaLine = drawAbscissa(width, offsetY);
		const drawChart1Line = drawChart(data, width, offsetY, 'red');

		pipe(canv,
			chain(getCanvasContext),
			map(flow(drawChart1Line, drawAbscissaLine))
		);
	}

	render() {
		const props = this.props;
		const { width, height } = props.dimensions;
		return (
			<canvas width={width} height={height} id={'canvas'}>Oooops...</canvas>
		);
	}
}