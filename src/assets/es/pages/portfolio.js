import { 
    ApexChartDefault,
    ApexDonutChartDefault,
    ApexLineChartDefault
} from '../constant/chart.constant';

ApexDonutChartDefault.plotOptions.pie.donut.labels.total.formatter = () => 'Assets'
ApexDonutChartDefault.plotOptions.pie.donut.labels.total.label = '$34551'

const assetsDonutOption ={
    chart: {
        ...ApexChartDefault,
        height: 230,
        type: "donut"
    },
    ...ApexDonutChartDefault,
    series: [15032, 11246, 8273],
    labels: ["Bitcoin", "Ethereum", "Solana"],
    
}
new ApexCharts(document.querySelector("#assets-chart"), assetsDonutOption).render();

const statisticChartOptions = {
    ...ApexLineChartDefault,
    series: [
        {
            name: 'Bitcoin',
            data: [
                16375, 18954, 16869, 19569, 17381, 18981, 21403, 18902,
                20244, 19706,
            ],
        },
        {
            name: 'Ethereum',
            data: [
                10689, 12646, 11420, 13520, 11655, 13826, 13092, 13805,
                12560, 13993,
            ],
        },
        {
            name: 'Solana',
            data: [
                8163, 8921, 8337, 9614, 9063, 9998, 9041, 10224, 9332,
                10379,
            ],
        },
    ],
    chart: {
        ...ApexChartDefault,
        height: 350,
        type: "line",
        zoom: {
            enabled: false
        }
    },
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
        ],
    }
};
new ApexCharts(document.querySelector("#statistic-chart"), statisticChartOptions).render();