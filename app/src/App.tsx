import * as React from 'react';
import './App.css';
import { D3LineChart } from './components/D3LineChart/D3LineChart.component';
import { D3CHART_DATA, lineChartSettings } from './components/D3LineChart/D3LineChart.fixture';
import { D3CandleChart, TCandle } from './components/D3CandleChart/D3CandleChart.component';
import { candleChartSettings, D3CANDLES_DATA, generateCandleData } from './components/D3CandleChart/D3CandleChart.fixture';

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
		}), 5000);
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
			<section className={'container'}>
				<D3CandleChart width={state.width / 2} height={state.height} data={state.data} settings={candleChartSettings}/>
				<D3LineChart width={state.width / 2} height={state.height} data={D3CHART_DATA} settings={lineChartSettings}/>
			</section>
		);
	}
}

export default App;
