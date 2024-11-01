import VanillaCalendar from 'vanilla-calendar-pro';
import type { IOptions } from 'vanilla-calendar-pro/types';

import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

const options: IOptions = {
  selectionTimeMode: 12,
  settings: {
    selected: {
      time: '03:44 AM',
    },
  },
};

const calendar = new VanillaCalendar('#calendar', options);
calendar.init();
