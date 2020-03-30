import * as React from 'react';
import './App.css';
import { D3Chart } from './components/D3Chart/D3Chart.component';
import { D3CHART_DATA } from './components/D3Chart/D3Chart.fixture';
import { D3Candles, TCandle } from './components/D3Candles/D3Candles.component';
import { D3CANDLES_DATA, generateCandleData } from './components/D3Candles/D3Candle.fixture';

interface AppState {
	width: number;
	height: number;
	data: TCandle[];
}

export class App extends React.Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
			data: D3CANDLES_DATA,
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		window.setInterval(() => this.setState({
			data: generateCandleData(),
		}), 1000);
	}

	componentWillUnmount(): void {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		this.setState({
			width,
			height,
		});
	};

	render() {
		const state = this.state;
		return (
			<section>
				{/*<D3Chart width={state.width} height={state.height} data={D3CHART_DATA} />*/}
				<D3Candles  width={state.width} height={state.height} data={D3CANDLES_DATA} />
			</section>
		);
	}
}

export default App;
