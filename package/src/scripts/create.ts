import getLocale from '@scripts/helpers/getLocale';
import changeTheme from '@scripts/modules/changeTheme';
import createDates from '@scripts/modules/createDates/createDates';
import createDOM from '@scripts/modules/createDOM';
import createMonths from '@scripts/modules/createMonths';
import createTime from '@scripts/modules/createTime';
import createWeek from '@scripts/modules/createWeek';
import createYears from '@scripts/modules/createYears';
import visibilityArrows from '@scripts/modules/visibilityArrows';
import visibilityTitle from '@scripts/modules/visibilityTitle';
import type VanillaCalendar from '@src/vanilla-calendar';

const create = (self: VanillaCalendar) => {
  const types = {
    default: () => {
      createWeek(self);
      createDates(self);
    },
    multiple: () => {
      createWeek(self);
      createDates(self);
    },
    month: () => createMonths(self),
    year: () => createYears(self),
  };

  changeTheme(self);
  getLocale(self);
  createDOM(self);
  visibilityTitle(self);
  visibilityArrows(self);
  createTime(self);

  types[self.currentType]();
};

export default create;
