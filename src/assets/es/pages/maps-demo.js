$('#world-map-demo').vectorMap(
    {
        map: 'world_en',
        backgroundColor: 'transparent',
        color: '#f3f4f6',
        hoverOpacity: 0.7,
        selectedColor: '#666666',
        showTooltip: true,
        colors: {
            us: '#3b82f6',
            br: '#3b82f6',
            au: '#3b82f6',
        },
    }
)

$('#usa-map-demo').vectorMap(
    {
        map: 'usa_en',
        backgroundColor: 'transparent',
        color: '#f3f4f6',
        hoverOpacity: 0.7,
        selectedColor: '#666666',
        showTooltip: true,
    }
)