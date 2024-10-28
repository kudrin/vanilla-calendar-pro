import { FormatDateString } from '@package/types';
import VanillaCalendar from '@src/vanilla-calendar';
import getDateString from '@scripts/helpers/getDateString';
import getDate from '@scripts/helpers/getDate';
import parseDates from '@scripts/helpers/parseDates';
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

	// Проверяем на минимальную и максимальную дату
	if (
		(current.rangeMin && formattedDate < current.rangeMin)
		|| (current.rangeMax && formattedDate > current.rangeMax)
	) {
		return;
	}

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

const handleHoverDaysEvent = (e: MouseEvent) => {
	if (!e.target || !current.self?.selectedDates) return;

	const btnDayEl: HTMLButtonElement | null = (e.target as HTMLElement).closest('[data-calendar-day]');
	if (!btnDayEl) {
		removeHoverEffect();
		return;
	}

	const startDate = getDate(current.self.selectedDates[0]);
	const hoverDate = getDate(btnDayEl.dataset.calendarDay as FormatDateString);

	const dayDiff = Math.abs(
		Math.ceil((hoverDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
	) + 1;

	let adjustedEndDate = new Date(hoverDate);

	// Применяем ограничения только если они заданы
	if (current.self.limitMin !== undefined && dayDiff < current.self.limitMin) {
		const daysToAdjust = current.self.limitMin - 1;
		if (hoverDate < startDate) {
			adjustedEndDate = new Date(startDate);
			adjustedEndDate.setDate(startDate.getDate() - daysToAdjust);
		} else {
			adjustedEndDate = new Date(startDate);
			adjustedEndDate.setDate(startDate.getDate() + daysToAdjust);
		}
	} else if (current.self.limitMax !== undefined && dayDiff > current.self.limitMax) {
		const daysToAdjust = current.self.limitMax - 1;
		if (hoverDate < startDate) {
			adjustedEndDate = new Date(startDate);
			adjustedEndDate.setDate(startDate.getDate() - daysToAdjust);
		} else {
			adjustedEndDate = new Date(startDate);
			adjustedEndDate.setDate(startDate.getDate() + daysToAdjust);
		}
	}

	// Устанавливаем rangeMin и rangeMax для ограничения выбора
	current.rangeMin = getDateString(
		new Date(Math.min(startDate.getTime(), adjustedEndDate.getTime())),
	);
	current.rangeMax = getDateString(
		new Date(Math.max(startDate.getTime(), adjustedEndDate.getTime())),
	);

	removeHoverEffect();

	const start = startDate < adjustedEndDate ? startDate : adjustedEndDate;
	const end = startDate > adjustedEndDate ? startDate : adjustedEndDate;

	for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
		const isFirstDay = i.getTime() === start.getTime();
		const isLastDay = i.getTime() === end.getTime();
		addHoverEffect(i, isFirstDay, isLastDay);
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
		if (self.selectedDates.length === 0) {
			// Начинаем новый выбор диапазона
			self.selectedDates = [formattedDate];
			self.HTMLElement.addEventListener('mousemove', handleHoverDaysEvent);
			document.addEventListener('keydown', handleCancelSelectionDays);
		} else if (self.selectedDates.length === 1) {
			// Завершаем выбор диапазона
			const startDate = getDate(self.selectedDates[0]);
			const endDate = getDate(formattedDate);

			const dayDiff = Math.abs(
				Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
			) + 1;

			let adjustedEndDate = new Date(endDate);

			// Применяем ограничения только если они заданы
			if (self.limitMin !== undefined && dayDiff < self.limitMin) {
				const daysToAdjust = self.limitMin - 1;
				if (endDate < startDate) {
					adjustedEndDate = new Date(startDate);
					adjustedEndDate.setDate(startDate.getDate() - daysToAdjust);
				} else {
					adjustedEndDate = new Date(startDate);
					adjustedEndDate.setDate(startDate.getDate() + daysToAdjust);
				}
			} else if (self.limitMax !== undefined && dayDiff > self.limitMax) {
				const daysToAdjust = self.limitMax - 1;
				if (endDate < startDate) {
					adjustedEndDate = new Date(startDate);
					adjustedEndDate.setDate(startDate.getDate() - daysToAdjust);
				} else {
					adjustedEndDate = new Date(startDate);
					adjustedEndDate.setDate(startDate.getDate() + daysToAdjust);
				}
			}

			const start = startDate < adjustedEndDate ? startDate : adjustedEndDate;
			const end = startDate > adjustedEndDate ? startDate : adjustedEndDate;

			// Обновляем rangeMin и rangeMax
			current.rangeMin = getDateString(start);
			current.rangeMax = getDateString(end);

			const startDateString = getDateString(start);
			const endDateString = getDateString(end);
			self.selectedDates = parseDates([`${startDateString}:${endDateString}`]);

			self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
			document.removeEventListener('keydown', handleCancelSelectionDays);

			// Обновляем интерфейс
			create(self);

			// Сбрасываем rangeMin и rangeMax после выбора
			current.rangeMin = undefined;
			current.rangeMax = undefined;
		} else {
			// Если диапазон уже выбран, сбрасываем и начинаем заново
			self.selectedDates = [];
			removeHoverEffect();
			current.rangeMin = undefined;
			current.rangeMax = undefined;
			self.HTMLElement.removeEventListener('mousemove', handleHoverDaysEvent);
			document.removeEventListener('keydown', handleCancelSelectionDays);

			// Начинаем новый выбор
			self.selectedDates = [formattedDate];
			self.HTMLElement.addEventListener('mousemove', handleHoverDaysEvent);
			document.addEventListener('keydown', handleCancelSelectionDays);
		}

		current.self = self;
	}
};

export default handleDayRangedSelection;
