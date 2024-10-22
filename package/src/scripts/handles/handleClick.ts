import handleClickArrow from '@scripts/handles/handleClickArrow';
import handleClickDate from '@scripts/handles/handleClickDate';
import handleClickMonthOrYear from '@scripts/handles/handleClickMonthOrYear';
import handleClickWeekNumber from '@scripts/handles/handleClickWeekNumber';
import type VanillaCalendar from '@src/vanilla-calendar';

const handleClick = (self: VanillaCalendar) => {
  const clickEventHandler = (e: MouseEvent) => {
    handleClickArrow(self, e);
    handleClickWeekNumber(self, e);
    handleClickDate(self, e);
    handleClickMonthOrYear(self, e);
  };

  self.HTMLElement.addEventListener('click', clickEventHandler);
  return () => self.HTMLElement.removeEventListener('click', clickEventHandler);
};

export default handleClick;
