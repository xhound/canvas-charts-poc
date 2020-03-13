import * as React from 'react';
import './App.css';
import { Chart } from './components/Chart/Chart.component';

export class App extends React.Component {
  render() {
    const data = [.20,.4,-.5,.2,-.10, .70, .120, -.50];
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
