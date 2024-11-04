import createDatePopup from '@scripts/creators/createDates/createDatePopup';
import createDateRangeTooltip from '@scripts/creators/createDates/createDateRangeTooltip';
import createDatesFromCurrentMonth from '@scripts/creators/createDates/createDatesFromCurrentMonth';
import createDatesFromNextMonth from '@scripts/creators/createDates/createDatesFromNextMonth';
import createDatesFromPrevMonth from '@scripts/creators/createDates/createDatesFromPrevMonth';
import createWeekNumbers from '@scripts/creators/createWeekNumbers';
import type { VanillaCalendarPro } from '@src/index';

const createDates = (self: VanillaCalendarPro) => {
  const initDate = new Date(self.private.selectedYear as number, self.private.selectedMonth as number, 1);
  const datesEls = self.private.mainElement.querySelectorAll<HTMLElement>('[data-vc="dates"]');
  const weekNumbersEls = self.private.mainElement.querySelectorAll<HTMLElement>('[data-vc-week="numbers"]');

  datesEls.forEach((datesEl, index: number) => {
    if (!self.selectionDatesMode) datesEl.dataset.vcDatesDisabled = '';
    datesEl.textContent = '';

    const currentDate = new Date(initDate);
    currentDate.setMonth(currentDate.getMonth() + index);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayWeek = (new Date(currentYear, currentMonth, 1).getDay() - self.firstWeekday + 7) % 7;
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();

    createDatesFromPrevMonth(self, datesEl, currentYear, currentMonth, firstDayWeek);
    createDatesFromCurrentMonth(self, datesEl, days, currentYear, currentMonth);
    createDatesFromNextMonth(self, datesEl, days, currentYear, currentMonth, firstDayWeek);
    createDatePopup(self, datesEl);
    createWeekNumbers(self, firstDayWeek, days, weekNumbersEls[index], datesEl);
  });

  // temp
  createDateRangeTooltip(self, datesEls[0].querySelectorAll<HTMLElement>('[data-vc-date]')[15]);
};

export default createDates;
