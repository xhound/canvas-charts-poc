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

export const App: React.FC<{}> = () => {
	const [width, setWidth] = React.useState<number>(window.innerWidth);
	const [height, setHeight] = React.useState<number>(window.innerHeight);
	const [data, setData] = React.useState<TCandle[]>(D3CANDLES_DATA);
	
	const handleResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);
		window.setInterval(() => setData(generateCandleData()), 5000);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<section className={'container'}>
			<D3CandleChart width={width / 2} height={height} data={data} settings={candleChartSettings}/>
			<D3LineChart width={width / 2} height={height} data={D3CHART_DATA} settings={lineChartSettings}/>
		</section>
	);
}

export default App;
