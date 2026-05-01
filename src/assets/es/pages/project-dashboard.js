import {
    ApexChartDefault,
    ApexBarDefault,
    COLOR_1,
    COLOR_3,
} from '../constant/chart.constant';

const taskOverviewChartOption = {
    ...ApexBarDefault,
    series: [
        {
            name: 'On Going',
            data: [45, 52, 68, 84, 103, 112, 126],
            color: COLOR_1
        },
        {
            name: 'Finished',
            data: [35, 41, 62, 62, 75, 81, 87],
            color: COLOR_3
        },
    ],
    chart: {
        ...ApexChartDefault,
        type: "bar",
        height: 300
    },
    xaxis: {
        categories: [
            '21 Jan',
            '22 Jan',
            '23 Jan',
            '24 Jan',
            '25 Jan',
            '26 Jan',
            '27 Jan',
        ]
    },
    legend: {
        show: false
    },
}
new ApexCharts(document.querySelector("#task-overview-chart"), taskOverviewChartOption).render();

const newDate = new Date()
const formattedDate = formatDate(newDate);
const divElement = document.querySelector('.project-calendar');
divElement.setAttribute('data-date', formattedDate);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
}