import {
    ApexChartDefault,
    ApexLineChartDefault,
    ApexDonutChartDefault
} from '../constant/chart.constant';

ApexLineChartDefault.chart.height = "380px"

const salesReportChartOption = {
    ...ApexLineChartDefault,
    series: [
        {
            name: 'Online Sales',
            data: [24, 33, 29, 36, 34, 43, 40, 47, 45, 48, 46, 55],
        },
        {
            name: 'Marketing Sales',
            data: [20, 26, 23, 24, 22, 29, 27, 36, 32, 35, 32, 38],
        },
    ],
    xaxis: {
        categories: [
            '01 Jan',
            '02 Jan',
            '03 Jan',
            '04 Jan',
            '05 Jan',
            '06 Jan',
            '07 Jan',
            '08 Jan',
            '09 Jan',
            '10 Jan',
            '11 Jan',
            '12 Jan',
        ]
    },
    legend: {
        show: false
    },
}
new ApexCharts(document.querySelector("#sales-report-chart"), salesReportChartOption).render();

ApexDonutChartDefault.plotOptions.pie.donut.labels.total.formatter = () => 'Product Sold'
ApexDonutChartDefault.plotOptions.pie.donut.labels.total.label = '284'

const categoriesChartOption ={
    chart: {
        ...ApexChartDefault,
        height: 300,
        type: "donut"
    },
    ...ApexDonutChartDefault,
    series: [351, 246, 144, 83],
    labels: ['Devices', 'Watches', 'Bags', 'Shoes'],
    
}
new ApexCharts(document.querySelector("#categories-chart"), categoriesChartOption).render();

const newDate = new Date()
const formattedDate = formatDate(newDate);
const divElement = document.querySelector('#date-query-input');
divElement.setAttribute('value', formattedDate);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
}