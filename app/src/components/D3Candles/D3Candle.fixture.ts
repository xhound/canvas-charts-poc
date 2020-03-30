import { addHours } from 'date-fns';
import { getRandom } from '../../utils/math';

const POINTS_COUNT = 24;
const data = new Array(POINTS_COUNT).fill(0);

const day = new Date(2020, 3, 27, 0, 0);

const getClose = getRandom(2000, 5000);
const getVolume = getRandom(0, 10000);

export const generateCandleData = () => data.map((v, i) => {
	const close = getClose();
	return ({
		x: addHours(day, i),
		y: {
			close,
			volume: getVolume(),
		},
	})
}).map((v, i, data) => {
	const open = data[i - 1] !== undefined ? data[i - 1].y.close : 2500;
	const close = v.y.close;
	return ({
		...v,
		y: {
			...v.y,
			open,
			low: open > close ?  getRandom(close - 500, close)() : getRandom(open - 500, open)(),
			high: open > close ?  getRandom(open, open + 500)() : getRandom(close, close + 500)(),
		}
	})
});

export const D3CANDLES_DATA = generateCandleData();