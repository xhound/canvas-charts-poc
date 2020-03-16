import * as React from 'react';
import './App.css';
import { Chart } from './components/Chart/Chart.component';
import { some } from 'fp-ts/lib/Option';

// Play with this numbers

const NUMBER_OF_CHARTS = 3;
const LENGTH_OF_DATA = 30;
const UPDATE_DELAY = 2000;

const fakeData = () => {
	const charts = new Array(NUMBER_OF_CHARTS).fill(0);
	const ds = new Array(LENGTH_OF_DATA).fill(0);
	return charts.map(() => ds.map(() => Math.random() * (1 + 1) - 1))};

export class App extends React.Component {
	state = {
		data: fakeData(),
		width: 0,
		height: 0,
	};

	componentDidMount() {
		window.setInterval(() => {
			this.setState({
				data: fakeData(),
			})

		}, UPDATE_DELAY);

		window.addEventListener('resize', this.handleResize);

		this.handleResize();
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
		const dimensions = {
			width: state.width,
			height: state.height,
			padding: some({
				top: some(10),
				bottom: some(10),
				left: some(10),
				right: some(40),
			}),
		};
		return (
			<section>
				<Chart data={this.state.data} dimensions={dimensions}/>
			</section>
		);
	}
}

export default App;
