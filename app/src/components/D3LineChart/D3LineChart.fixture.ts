import {addMonths, subYears} from 'date-fns';
import { getRandom } from '../../utils/math';

export const lineChartSettings = {
	pointer: {
		font: '1.2rem Arial',
		lineColor: 'lightgrey',
		pillColor: 'green',
		pillTextColor: 'white',
	},
	chart: {
		font: '1.2rem Arial',
		gridColor: 'lightgrey',
		axisLabelTextColor: 'grey',
		lineColor: 'green',
		areaColor: 'lime',
	}
};

const POINTS_COUNT = 30;
const data = new Array(POINTS_COUNT).fill(0);

const now = new Date();
const fiveYearsAgo = subYears(now, 5);

const getY = getRandom(-2000, 5000);
export const D3CHART_DATA = data.map((v, i) => {
	return ({
		x: addMonths(fiveYearsAgo, i),
		y: getY(),
	})
});