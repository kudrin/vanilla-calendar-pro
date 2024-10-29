import { FormatDateString } from '@package/types';
import VanillaCalendar from '@src/vanilla-calendar';
import getDateString from '@scripts/helpers/getDateString';
import getDate from '@scripts/helpers/getDate';
import create from '@scripts/create';

const current: {
	self: VanillaCalendar | null;
	rangeMin: FormatDateString | undefined;
	rangeMax: FormatDateString | undefined;
} = {
	self: null,
	rangeMin: undefined,
	rangeMax: undefined,
};

const getDateFromString = (dateStr: string): Date => {
	if (dateStr === 'today') {
		return new Date();
	}
	return getDate(dateStr as FormatDateString);
};

const removeHoverEffect = () => {
	if (!current.self?.HTMLElement) return;
	const { CSSClasses } = current.self;

	const dayEls: NodeListOf<HTMLDivElement> = current.self.HTMLElement.querySelectorAll(
		`.${CSSClasses.dayBtnHover}`,
	);
	dayEls.forEach((d) => {
		d.classList.remove(CSSClasses.dayBtnHover);
		d.parentElement?.classList.remove(
			CSSClasses.dayHoverIntermediate,
			CSSClasses.dayHoverFirst,
			CSSClasses.dayHoverLast,
		);
	});
};

const addHoverEffect = (day: Date, isFirstDay: boolean, isLastDay: boolean) => {
	if (!current.self) return;

	const formattedDate = getDateString(day);
	const { CSSClasses } = current.self;

	// Пропускаем, если день отключён
	if (current.self.rangeDisabled?.includes(formattedDate)) return;

	const dayEls: NodeListOf<HTMLDivElement> = current.self.HTMLElement?.querySelectorAll(
		`[data-calendar-day="${formattedDate}"]`,
	);
	dayEls?.forEach((d) => {
		d.classList.add(CSSClasses.dayBtnHover);
		d.parentElement?.classList.add(CSSClasses.dayHoverIntermediate);
		if (isFirstDay) {
			d.parentElement?.classList.add(CSSClasses.dayHoverFirst);
		}
		if (isLastDay) {
			d.parentElement?.classList.add(CSSClasses.dayHoverLast);
		}
	});
};

const countActiveDays = (
	startDate: Date,
	endDate: Date,
	disabledDatesSet: Set<FormatDateString>,
	rangeMinDate: Date,
	rangeMaxDate: Date,
): number => {
	let activeDays = 0;
	const increment = startDate <= endDate ? 1 : -1;
	const currentDate = new Date(startDate);
	while (
		(increment > 0 && currentDate <= endDate)
		|| (increment < 0 && currentDate >= endDate)
	) {
		const dateString = getDateString(currentDate);

		// Проверяем, что текущая дата находится в пределах диапазона min/max
		if (currentDate >= rangeMinDate && currentDate <= rangeMaxDate) {
			if (!disabledDatesSet.has(dateString)) {
				activeDays++;
			}
		}
		currentDate.setDate(currentDate.getDate() + increment);

		if (!disabledDatesSet.has(dateString)) {
			activeDays++;
		}
		currentDate.setDate(currentDate.getDate() + increment);
	}
	return activeDays;
};

const adjustEndDateForLimits = (
	startDate: Date,
	initialEndDate: Date,
	limitMin: number | undefined,
	limitMax: number | undefined,
	disabledDatesSet: Set<FormatDateString>,
	rangeMinDate: Date,
	rangeMaxDate: Date,
): Date => {
	const increment = startDate <= initialEndDate ? 1 : -1;
	let adjustedEndDate = new Date(initialEndDate);

	let activeDayCount = countActiveDays(
		startDate,
		adjustedEndDate,
		disabledDatesSet,
		rangeMinDate,
		rangeMaxDate,
	);

	// Корректируем endDate, если activeDayCount < limitMin
	if (limitMin !== undefined && activeDayCount < limitMin) {
		while (activeDayCount < limitMin) {
			adjustedEndDate.setDate(adjustedEndDate.getDate() + increment);

			// Проверяем, что adjustedEndDate не выходит за пределы rangeMinDate и rangeMaxDate
			if (
				(adjustedEndDate < rangeMinDate && increment < 0)
				|| (adjustedEndDate > rangeMaxDate && increment > 0)
			) {
				break;
			}

			activeDayCount = countActiveDays(
				startDate,
				adjustedEndDate,
				disabledDatesSet,
				rangeMinDate,
				rangeMaxDate,
			);
		}
	} else if (limitMax !== undefined && activeDayCount > limitMax) {
		while (activeDayCount > limitMax) {
			adjustedEndDate.setDate(adjustedEndDate.getDate() - increment);

			// Проверяем, что adjustedEndDate не выходит за пределы rangeMinDate и rangeMaxDate
			if (
				(adjustedEndDate < rangeMinDate && increment < 0)
				|| (adjustedEndDate > rangeMaxDate && increment > 0)
			) {
				break;
			}

			activeDayCount = countActiveDays(
				startDate,
				adjustedEndDate,
				disabledDatesSet,
				rangeMinDate,
				rangeMaxDate,
			);
		}
	}

	// Убедимся, что adjustedEndDate находится в пределах rangeMinDate и rangeMaxDate
	if (adjustedEndDate < rangeMinDate) {
		adjustedEndDate = new Date(rangeMinDate);
	} else if (adjustedEndDate > rangeMaxDate) {
		adjustedEndDate = new Date(rangeMaxDate);
	}

	return adjustedEndDate;
};

const handleHoverDaysEvent = (e: MouseEvent) => {
	if (!e.target || !current.self?.selectedDates) return;

	const btnDayEl: HTMLButtonElement | null = (e.target as HTMLElement).closest('[data-calendar-day]');
	if (!btnDayEl) {
		removeHoverEffect();
		return;
	}

	const startDate = getDate(current.self.selectedDates[0]);
	const hoverDate = getDate(btnDayEl.dataset.calendarDay as FormatDateString);

	const disabledDatesSet = new Set(current.self.rangeDisabled);
	const rangeMinDate = getDateFromString(current.self.settings.range?.min || '1970-01-01');
	const rangeMaxDate = getDateFromString(current.self.settings.range?.max || '9999-12-31');

	const adjustedEndDate = adjustEndDateForLimits(
		startDate,
		hoverDate,
		current.self.settings.range.limitMin,
		current.self.settings.range.limitMax,
		disabledDatesSet,
		rangeMinDate,
		rangeMaxDate,
	);

	// Если скорректированная дата выходит за пределы диапазона, сбрасываем выбор
	if (adjustedEndDate < rangeMinDate || adjustedEndDate > rangeMaxDate) {
		removeHoverEffect();
		return;
	}

	current.rangeMin = getDateString(
		new Date(Math.min(startDate.getTime(), adjustedEndDate.getTime())),
	);
	current.rangeMax = getDateString(
		new Date(Math.max(startDate.getTime(), adjustedEndDate.getTime())),
	);

	removeHoverEffect();

	const start = startDate < adjustedEndDate ? startDate : adjustedEndDate;
	const end = startDate > adjustedEndDate ? startDate : adjustedEndDate;

	const increment = 1;
	const currentDate = new Date(start);
	while (currentDate <= end) {
		const dateString = getDateString(currentDate);

		if (currentDate >= rangeMinDate && currentDate <= rangeMaxDate) {
			if (!disabledDatesSet.has(dateString)) {
				const isFirstDay = currentDate.getTime() === start.getTime();
				const isLastDay = currentDate.getTime() === end.getTime();
				addHoverEffect(new Date(currentDate), isFirstDay, isLastDay);
			}
		}
		currentDate.setDate(currentDate.getDate() + increment);

		if (!disabledDatesSet.has(dateString)) {
			const isFirstDay = currentDate.getTime() === start.getTime();
			const isLastDay = currentDate.getTime() === end.getTime();
			addHoverEffect(new Date(currentDate), isFirstDay, isLastDay);
		}
		currentDate.setDate(currentDate.getDate() + increment);
	}
};

const handleCancelSelectionDays = (e: KeyboardEvent) => {
	if (!current.self || e.key !== 'Escape') return;
	current.self.selectedDates = [];
	current.rangeMin = undefined;
	current.rangeMax = undefined;
	current.self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
	document.removeEventListener('keydown', handleCancelSelectionDays);
	create(current.self);
};

const handleDayRangedSelection = (self: VanillaCalendar, formattedDate?: FormatDateString) => {
	if (formattedDate) {
		const rangeMinDate = getDateFromString(self.settings.range?.min || '1970-01-01');
		const rangeMaxDate = getDateFromString(self.settings.range?.max || '9999-12-31');

		if (self.selectedDates.length === 0) {
			// Проверяем, что выбранная дата находится в пределах диапазона
			const selectedDate = getDate(formattedDate);
			if (selectedDate < rangeMinDate || selectedDate > rangeMaxDate) {
				return;
			}

			// Начинаем новый выбор диапазона
			self.selectedDates = [formattedDate];
			self.HTMLElement.addEventListener('mousemove', handleHoverDaysEvent);
			document.addEventListener('keydown', handleCancelSelectionDays);
		} else if (self.selectedDates.length === 1) {
			const startDate = getDate(self.selectedDates[0]);
			const endDate = getDate(formattedDate);

			const disabledDatesSet = new Set(self.rangeDisabled);

			const adjustedEndDate = adjustEndDateForLimits(
				startDate,
				endDate,
				self.settings.range.limitMin,
				self.settings.range.limitMax,
				disabledDatesSet,
				rangeMinDate,
				rangeMaxDate,
			);

			// Если скорректированная дата выходит за пределы диапазона, сбрасываем выбор
			if (adjustedEndDate < rangeMinDate || adjustedEndDate > rangeMaxDate) {
				self.selectedDates = [];
				removeHoverEffect();
				current.rangeMin = undefined;
				current.rangeMax = undefined;
				self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
				document.removeEventListener('keydown', handleCancelSelectionDays);
				create(self);
				return;
			}

			const start = startDate < adjustedEndDate ? startDate : adjustedEndDate;
			const end = startDate > adjustedEndDate ? startDate : adjustedEndDate;

			// Обновляем rangeMin и rangeMax
			current.rangeMin = getDateString(start);
			current.rangeMax = getDateString(end);

			const selectedDates: FormatDateString[] = [];
			const currentDate = new Date(start);
			while (currentDate <= end) {
				const dateString = getDateString(currentDate);

				if (currentDate >= rangeMinDate && currentDate <= rangeMaxDate) {
					if (!disabledDatesSet.has(dateString)) {
						selectedDates.push(dateString);
					}
				}
				currentDate.setDate(currentDate.getDate() + 1);
			}

			self.selectedDates = selectedDates;

			self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
			document.removeEventListener('keydown', handleCancelSelectionDays);

			// Обновляем интерфейс
			create(self);

			// Сбрасываем rangeMin и rangeMax после выбора
			current.rangeMin = undefined;
			current.rangeMax = undefined;
		} else {
			// Сбрасываем и начинаем новый выбор
			self.selectedDates = [];
			removeHoverEffect();
			current.rangeMin = undefined;
			current.rangeMax = undefined;
			self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
			document.removeEventListener('keydown', handleCancelSelectionDays);

			// Проверяем, что выбранная дата находится в пределах диапазона
			const selectedDate = getDate(formattedDate);
			if (selectedDate < rangeMinDate || selectedDate > rangeMaxDate) {
				return;
			}

			// Начинаем новый выбор
			self.selectedDates = [formattedDate];
			self.HTMLElement.addEventListener('mousemove', handleHoverDaysEvent);
			document.addEventListener('keydown', handleCancelSelectionDays);
		}

		current.self = self;
	}
};

export default handleDayRangedSelection;
