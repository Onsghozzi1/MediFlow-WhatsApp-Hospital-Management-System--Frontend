import {
    ApexChartDefault,
    ApexLineChartDefault,
    ApexDonutChartDefault
} from '../constant/chart.constant';

ApexLineChartDefault.chart.height = "380px"

const portfolioPerfomanceChartOption = {
    ...ApexLineChartDefault,
    series: [
        {
            name: 'Porfolio Balance',
            data: [
                14576.39, 23895.12, 19473.64, 26454.96, 24741.98,
                33153.32, 30218.32, 37645.11, 35556.15, 38886.34,
                36135.95, 45966.12,
            ],
        },
    ],
    xaxis: {
        categories: [
            '02 Jan',
            '05 Jan',
            '07 Jan',
            '10 Jan',
            '13 Jan',
            '15 Jan',
            '18 Jan',
            '20 Jan',
            '23 Jan',
            '25 Jan',
            '28 Jan',
            '30 Jan',
        ]
    },
    legend: {
        show: false
    },
}
new ApexCharts(document.querySelector("#portfolio-perfomance-chart"), portfolioPerfomanceChartOption).render();
