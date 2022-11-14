import { IOptions } from 'src/types';

const CSSClasses = (option: IOptions | undefined) => ({
	calendar: option?.CSSClasses?.calendar ?? 'vanilla-calendar',
	calendarDefault: option?.CSSClasses?.calendarDefault ?? 'vanilla-calendar_default',
	calendarMonth: option?.CSSClasses?.calendarMonth ?? 'vanilla-calendar_month',
	calendarYear: option?.CSSClasses?.calendarYear ?? 'vanilla-calendar_year',
	header: option?.CSSClasses?.header ?? 'vanilla-calendar-header',
	headerContent: option?.CSSClasses?.headerContent ?? 'vanilla-calendar-header__content',
	month: option?.CSSClasses?.month ?? 'vanilla-calendar-month',
	monthDisabled: option?.CSSClasses?.monthDisabled ?? 'vanilla-calendar-month_disabled',
	year: option?.CSSClasses?.year ?? 'vanilla-calendar-year',
	yearDisabled: option?.CSSClasses?.yearDisabled ?? 'vanilla-calendar-year_disabled',
	arrow: option?.CSSClasses?.arrow ?? 'vanilla-calendar-arrow',
	arrowPrev: option?.CSSClasses?.arrowPrev ?? 'vanilla-calendar-arrow_prev',
	arrowNext: option?.CSSClasses?.arrowNext ?? 'vanilla-calendar-arrow_next',
	wrapper: option?.CSSClasses?.content ?? 'vanilla-calendar-wrapper',
	content: option?.CSSClasses?.content ?? 'vanilla-calendar-content',
	week: option?.CSSClasses?.week ?? 'vanilla-calendar-week',
	weekDay: option?.CSSClasses?.weekDay ?? 'vanilla-calendar-week__day',
	weekDayWeekend: option?.CSSClasses?.weekDayWeekend ?? 'vanilla-calendar-week__day_weekend',
	days: option?.CSSClasses?.days ?? 'vanilla-calendar-days',
	daysSelecting: option?.CSSClasses?.daysSelecting ?? 'vanilla-calendar-days_selecting',
	months: option?.CSSClasses?.months ?? 'vanilla-calendar-months',
	monthsSelecting: option?.CSSClasses?.monthsSelecting ?? 'vanilla-calendar-months_selecting',
	monthsMonth: option?.CSSClasses?.monthsMonth ?? 'vanilla-calendar-months__month',
	monthsMonthSelected: option?.CSSClasses?.monthsMonthSelected ?? 'vanilla-calendar-months__month_selected',
	monthsMonthDisabled: option?.CSSClasses?.monthsMonthDisabled ?? 'vanilla-calendar-months__month_disabled',
	years: option?.CSSClasses?.years ?? 'vanilla-calendar-years',
	yearsSelecting: option?.CSSClasses?.yearsSelecting ?? 'vanilla-calendar-years_selecting',
	yearsYear: option?.CSSClasses?.yearsYear ?? 'vanilla-calendar-years__year',
	yearsYearSelected: option?.CSSClasses?.yearsYearSelected ?? 'vanilla-calendar-years__year_selected',
	yearsYearDisabled: option?.CSSClasses?.yearsYearDisabled ?? 'vanilla-calendar-years__year_disabled',
	time: option?.CSSClasses?.time ?? 'vanilla-calendar-time',
	timeContent: option?.CSSClasses?.timeContent ?? 'vanilla-calendar-time__content',
	timeHours: option?.CSSClasses?.timeHours ?? 'vanilla-calendar-time__hours',
	timeMinutes: option?.CSSClasses?.timeMinutes ?? 'vanilla-calendar-time__minutes',
	timeKeeping: option?.CSSClasses?.timeKeeping ?? 'vanilla-calendar-time__keeping',
	timeRanges: option?.CSSClasses?.timeRanges ?? 'vanilla-calendar-time__ranges',
	timeRange: option?.CSSClasses?.timeRange ?? 'vanilla-calendar-time__range',
	day: option?.CSSClasses?.day ?? 'vanilla-calendar-day',
	dayPopup: option?.CSSClasses?.dayPopup ?? 'vanilla-calendar-day__popup',
	dayBtn: option?.CSSClasses?.dayBtn ?? 'vanilla-calendar-day__btn',
	dayBtnPrev: option?.CSSClasses?.dayBtnPrev ?? 'vanilla-calendar-day__btn_prev',
	dayBtnNext: option?.CSSClasses?.dayBtnNext ?? 'vanilla-calendar-day__btn_next',
	dayBtnToday: option?.CSSClasses?.dayBtnToday ?? 'vanilla-calendar-day__btn_today',
	dayBtnSelected: option?.CSSClasses?.dayBtnSelected ?? 'vanilla-calendar-day__btn_selected',
	dayBtnDisabled: option?.CSSClasses?.dayBtnDisabled ?? 'vanilla-calendar-day__btn_disabled',
	dayBtnIntermediate: option?.CSSClasses?.dayBtnIntermediate ?? 'vanilla-calendar-day__btn_intermediate',
	dayBtnWeekend: option?.CSSClasses?.dayBtnWeekend ?? 'vanilla-calendar-day__btn_weekend',
	dayBtnHoliday: option?.CSSClasses?.dayBtnHoliday ?? 'vanilla-calendar-day__btn_holiday',
	weekNumbers: option?.CSSClasses?.weekNumbers ?? 'vanilla-calendar-week-numbers',
	weekNumbersTitle: option?.CSSClasses?.weekNumbersTitle ?? 'vanilla-calendar-week-numbers__title',
	weekNumbersContent: option?.CSSClasses?.weekNumbersContent ?? 'vanilla-calendar-week-numbers__content',
	weekNumber: option?.CSSClasses?.weekNumber ?? 'vanilla-calendar-week-number',
	isFocus: option?.CSSClasses?.isFocus ?? 'vanilla-calendar-is-focus',
});

export default CSSClasses;
