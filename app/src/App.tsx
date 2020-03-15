import * as React from 'react';
import './App.css';
import { Chart } from './components/Chart/Chart.component';

export class App extends React.Component {
  render() {
    const data = [[100, -20, 10, -20, 10], [10, -70, 50, 0, -10]];
    const dimensions = {
      width: 800,
      height: 600,
    };
    return (
        <section>
          <Chart data={data} dimensions={dimensions} />
        </section>
    );
  }
}

export default App;
