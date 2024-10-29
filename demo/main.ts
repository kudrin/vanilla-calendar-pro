// import { IOptions } from '@package/types';
// import VanillaCalendar from '@/package/build/vanilla-calendar.min';
// import '@/package/build/vanilla-calendar.min.css';

import { IOptions } from '@package/types';
import VanillaCalendar from '@src/vanilla-calendar';
import '@src/styles/vanilla-calendar.css';

const config: IOptions = {
	type: 'multiple',
	months: 12,
	jump_months: 12,
	date: {
		min: '2024-01-01',
		max: '2025-01-01',
		today: new Date('2024-01-01T00:00:00.000Z'),
	},
	settings: {
		selection: {
			day: 'multiple-ranged',
			month: false,
			year: false
		},
		range: {
			min: '2024-08-01',
			max: '2024-10-31',
			limitMin: 7,
			limitMax: 14,
			disabled: ['2024-08-10:2024-08-13', '2024-08-22'],
		},
		visibility: {
			weekend: true,
			today: false
		},
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const calendar = new VanillaCalendar('#calendar', config);
	calendar.init();
});
