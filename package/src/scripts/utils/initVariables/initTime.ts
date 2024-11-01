import errorMessages from '@scripts/utils/getErrorMessages';
import transformTime12 from '@scripts/utils/transformTime12';
import type VanillaCalendar from '@src/vanilla-calendar';

const initTime = (self: VanillaCalendar) => {
  if (!self.selectionTimeMode) return;

  if (![12, 24].includes(self.selectionTimeMode)) throw new Error(errorMessages.incorrectTime);

  const isTime12 = self.selectionTimeMode === 12;
  const timeRegex = isTime12 ? /^([1-9]|1[0-2]):([0-5][0-9]) ?(AM|PM)?$/i : /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

  let [hours, minutes, keeping] = self.settings.selected.time?.match(timeRegex)?.slice(1) ?? [];

  if (!hours) {
    hours = isTime12 ? transformTime12(String(self.settings.range.hourMin)) : String(self.settings.range.hourMin);
    minutes = String(self.settings.range.minuteMin);
    keeping = isTime12 && Number(transformTime12(String(self.settings.range.hourMin))) >= 12 ? 'PM' : 'AM';
  } else if (isTime12 && !keeping) {
    keeping = 'AM';
  }

  self.private.selectedHours = hours.padStart(2, '0');
  self.private.selectedMinutes = minutes.padStart(2, '0');
  self.private.selectedKeeping = keeping;
  self.private.selectedTime = `${self.private.selectedHours}:${self.private.selectedMinutes}${keeping ? ` ${keeping}` : ''}`;
};

export default initTime;
