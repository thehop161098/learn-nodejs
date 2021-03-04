import moment from 'moment';

export const locale = {
    direction: 'ltr',
    format: "DD/MM/YYYY",
    separator: ' - ',
    applyLabel: 'Chọn',
    cancelLabel: 'Hủy',
    weekLabel: 'W',
    customRangeLabel: 'Custom Range',
    // daysOfWeek: moment.weekdaysMin(),
    daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6','T7'],
    // monthNames: moment.monthsShort(),
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    firstDay: moment.localeData().firstDayOfWeek()
};

export const ranges = {
    'Hôm nay': [moment(), moment()],
    'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    '7 ngày trước': [moment().subtract(6, 'days'), moment()],
    '30 ngày trước': [moment().subtract(29, 'days'), moment()],
    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
}