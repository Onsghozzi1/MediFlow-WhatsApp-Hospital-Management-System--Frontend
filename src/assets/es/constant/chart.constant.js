import { themeColors } from './theme-constant'

const twColor = themeColors

export const COLOR_1 = twColor.indigo['600']
export const COLOR_2 = twColor.blue['500']
export const COLOR_3 = twColor.emerald['500']
export const COLOR_4 = twColor.amber['500']
export const COLOR_5 = twColor.red['500']
export const COLOR_6 = twColor.purple['500']
export const COLOR_7 = twColor.cyan['500']

export const COLOR_1_LIGHT = twColor.indigo['100']
export const COLOR_2_LIGHT = twColor.blue['100']
export const COLOR_3_LIGHT = twColor.emerald['100']
export const COLOR_4_LIGHT = twColor.amber['100']
export const COLOR_5_LIGHT = twColor.red['100']
export const COLOR_6_LIGHT = twColor.purple['100']
export const COLOR_7_LIGHT = twColor.cyan['100']

export const COLORS = [
    COLOR_1,
    COLOR_2,
    COLOR_3,
    COLOR_4,
    COLOR_5,
    COLOR_6,
    COLOR_7,
]

export const COLORS_LIGHT = [
    COLOR_1_LIGHT,
    COLOR_2_LIGHT,
    COLOR_3_LIGHT,
    COLOR_4_LIGHT,
    COLOR_5_LIGHT,
    COLOR_6_LIGHT,
    COLOR_7_LIGHT,
]


export const ApexChartDefault = {
    type: 'line',
    zoom: {
        enabled: false
    },
    toolbar: {
        show: false
    }
}

export const ApexStrokeDefault = {
    width: 3,
    curve: "smooth",
    lineCap: 'round'
}

export const ApexBarDefault = {
	chart: {
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
        type: "bar",
        height: 300
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '30px',
            borderRadius: 2,
        },
    },
    colors: [...COLORS],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 6,
        curve: 'smooth',
        colors: ['transparent'],
    },
    legend: {
        itemMargin: {
            vertical: 10,
        },
        tooltipHoverFormatter: function (val, opts) {
            return (
                val +
                ' - ' +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                ''
            )
        },
    },
    xaxis: {
        categories: [],
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: (val) => `${val}`,
        },
    },
    
}

export const ApexDataLabelDefault = {
    enabled: false
}

export const ApexDonutChartDefault = {
    colors: [...COLORS],
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        show: true,
                        showAlways: true,
                        label: '',
                        formatter: function (w) {
                            return w.globals.seriesTotals.reduce(
                                (a, b) => {
                                    return a + b
                                },
                                0
                            )
                        },
                    },
                },
                size: '85%',
            },
        },
    },
    stroke: {
        colors: ['transparent'],
    },
    labels: [],
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
}

export const ApexLineChartDefault = {
    chart: {
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    colors: [...COLORS],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 2.5,
        curve: 'smooth',
        lineCap: 'round',
    },
    legend: {
        itemMargin: {
            vertical: 10,
        },
        tooltipHoverFormatter: function (val, opts) {
            return (
                val +
                ' - ' +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                ''
            )
        },
    },
    xaxis: {
        categories: [],
    },
}

export const ApexColorDefault = [...COLORS]