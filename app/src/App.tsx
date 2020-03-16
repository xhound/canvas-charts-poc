import * as React from 'react';
import './App.css';
import { Chart } from './components/Chart/Chart.component';
import { some } from 'fp-ts/lib/Option';

export class App extends React.Component {
	state = {
		data: []
	};

	componentDidMount() {
		window.setInterval(() => {
			const templ = [1, 2, 3,];
			const ds = new Array(30).fill(0);
			this.setState({
				data: templ.map(() => ds.map(() => Math.random() * (1 + 1) - 1))
			})

		}, 2000);
	}

	render() {
		const dimensions = {
			width: 800,
			height: 600,
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
