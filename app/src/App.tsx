import * as React from 'react';
import './App.css';
import {Chart} from './components/Chart/Chart.component';

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
        };
        return (
            <section>
                <Chart data={this.state.data} dimensions={dimensions}/>
            </section>
        );
    }
}

export default App;
