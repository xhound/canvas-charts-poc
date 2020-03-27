import * as React from 'react';
import './App.css';
import { D3Chart } from './components/D3Chart/D3Chart.component';
import { D3CHART_DATA } from './components/D3Chart/D3Chart.fixture';

export class App extends React.Component {
	state = {
		width: 0,
		height: 0,
	};

	componentDidMount() {
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
		return (
			<section>
				<D3Chart width={state.width} height={state.height} data={D3CHART_DATA}/>
			</section>
		);
	}
}

export default App;
