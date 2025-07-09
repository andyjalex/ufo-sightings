import React, { useRef, useState, useEffect } from 'react';
import D3Chart from './D3Chart';

const ChartWrapper = () => {
    const chartArea = useRef(null)
    const [chart, setChart] = useState(null)

    useEffect(() => {
        
		if (!chart) {
            console.log('herllo')
			setChart(new D3Chart(chartArea.current))
		}
		// // skip the loading state, when data is still a pending promise
		// else if (chart.) {
		// 	chart.update()
		// }
	}, [chart])

    return <div className="chart-area" ref={chartArea}></div>
}

export default ChartWrapper