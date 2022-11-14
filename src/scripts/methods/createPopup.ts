import { FormatDateString, IVanillaCalendar } from 'src/types';

const createPopup = (self: IVanillaCalendar, daysEl: HTMLElement) => {
	if (!self.popups) return;

	// eslint-disable-next-line no-restricted-syntax
	for (const day in self.popups) {
		if (Object.hasOwnProperty.call(self.popups, day)) {
			const dayBtnEl = daysEl.querySelector(`[data-calendar-day="${day}"]`);

			if (dayBtnEl) {
				const dayInfo = self.popups[day as FormatDateString];
				if (dayInfo) {
					if (dayInfo.modifier) {
						dayInfo.modifier.split(' ').forEach((cl) => {
							dayBtnEl.classList.add(cl);
						});
					}
					(dayBtnEl.parentNode as HTMLElement).innerHTML += `<div class="${self.CSSClasses.dayPopup}">${dayInfo.html}</div>`;
				}
			}
		}
	}
};

export default createPopup;
