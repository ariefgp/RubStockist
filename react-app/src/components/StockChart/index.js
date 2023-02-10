import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleStockDataFromAPI } from '../../store/stocks';

import ApexCharts from 'react-apexcharts'
import moment from 'moment';

import { isObjectEmpty } from '../utility';

import './StockChart.css';

const StockChart = (props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('1D');
  const singleStockInfo = useSelector(state => state.stocks.singleStock.Info);
  const [filter, setFilter] = useState('1D');
  const [xaxisCategories, setXaxisCategories] = useState([]);

  const [color, setColor] = useState('#00C805');

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);

  const timeSeriesData = useSelector(state => state.stocks.singleStock.Data.values);
  const [tempData, setTempData] = useState();
  const [series, setSeries] = useState([]);

  // useEffect(() => {
  //     setTempData([]);
  //     setSeries([]);
  // }, [filter])

  useEffect(() => {
    setLoading(true);
    console.log('timeSeriesData: ', timeSeriesData)
    if (timeSeriesData !== undefined) {
      if (isObjectEmpty(timeSeriesData)) {
        setLoading(true);
      } else {
        setLoading(false);
        setTempData(timeSeriesData);
      }
    }
  }, [timeSeriesData]);

  useEffect(() => {
    if (tempData && tempData?.length > 0) {
      // compare start and end date to determine if reverse is needed
      if (new Date(tempData[0].datetime) > new Date(tempData[tempData.length - 1].datetime)) {
        tempData.reverse(); // Reverse the order of the data
      }

      let filteredData = tempData.filter(({ datetime }) => {
        // debugger

        const dateInQuestion = new Date(datetime);

        const date = new Date()

        let startDate, endDate;

        if (filter === '1D') {
          const day = date.getDay();
          if (day === 0) {
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 9, 30);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2, 16, 0);
          } else if (day === 6) {
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 9, 30);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 16, 0);
          } else {
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30);
            endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0);
          }
        } else if (filter === '1W') {
          startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '1M') {
          startDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '3M') {
          startDate = new Date(date.getFullYear(), date.getMonth() - 3, date.getDate(), 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '1Y') {
          startDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate(), 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else if (filter === '5Y') {
          startDate = new Date(date.getFullYear() - 5, date.getMonth(), date.getDate(), 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        } else {
          startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0);
          endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
        }

        return dateInQuestion >= startDate && dateInQuestion <= endDate;
      });


      let seriesData = filteredData.map(item => {
        return {
          x: item.datetime,
          y: Math.round(item.close * 100) / 100
        }
      });
      setSeries([{ name: '', data: seriesData }])
      setXaxisCategories(tempData.map(({ datetime }) => {
        if (filter === '1D') {
          return moment(datetime).format('HH:mm');
        } else {
          return moment(datetime).format('MMM DD');
        }
      }));

      if (seriesData?.length > 0) {
        setColor(seriesData[0].y <= seriesData[seriesData.length - 1].y ? '#00C805' : '#FF0000');
        // console.log(seriesData[0].y <= seriesData[seriesData.length - 1].y ? '#00C805' : '#FF0000')
        // console.log(seriesData[0].y, seriesData[seriesData.length - 1].y)
      }

      console.log(series)

    }
  }, [tempData, filter])





  const handleFilterChange = async (filter) => {
    setFilter(filter);

    setTempData([]);
    setSeries([]);

    // make API call with updated interval
    await dispatch(getSingleStockDataFromAPI(singleStockInfo.symbol, filter));
  }


  const options = {
    chart: {
      // id: "basic-bar",
      type: "line",
      align: "center",
      parentHeightOffset: 0,
      events: {
        mouseLeave: () => setCurrentMarketPrice(true),
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: false,
      },
      redrawOnParentResize: true,
    },

    responsive: [
      {
        // breakpoint: 900,
        // options: {
        //   plotOptions: {
        //     bar: {
        //       horizontal: false
        //     }
        //   },
        //   legend: {
        //     position: "bottom"
        //   }
        // }
      }
    ],

    xaxis: {
      // type: 'datetime',
      categories: xaxisCategories,
      labels: {
        show: false,
        showAlways: false,
      },
    },
    yaxis: {
      show: false,
      showAlways: false,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    colors: [`${color}`],
    stroke: {
      width: 2.75
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true,
      x: {
        // format: 'dd/MM/yy HH:mm',
        format: filter === '1D' ? 'HH:mm' : 'dd/MM/yy',
      },
      y: {
        title: {
          formatter: function (val) {
            return "$"
          }
        }
      }
    },
    toolbar: {
      show: false,
    },
    legend: {
      show: false,
    },
    noData: {
      text: "Loading...",
      align: "center",
      verticalAlign: "center",
      style: {
        color: "darkgray",
        fontSize: "24px",
      },
    },
  }

  return (
    <>
      {
        !loading ?
          <div className='big-chart-container'>
            <div className='big-chart-container'>
              <ApexCharts options={options} series={series} width='100%' height='100%' />
            </div>
            <div className='stock-chart-filter-buttons-container'>
              <button onClick={() => handleFilterChange('1D')} className={filter === '1D' ? 'active-filter-button' : ''} id='filter-button'>1D</button>
              <button onClick={() => handleFilterChange('1W')} className={filter === '1W' ? 'active-filter-button' : ''}>1W</button>
              <button onClick={() => handleFilterChange('1M')} className={filter === '1M' ? 'active-filter-button' : ''}>1M</button>
              <button onClick={() => handleFilterChange('3M')} className={filter === '3M' ? 'active-filter-button' : ''}>3M</button>
              <button onClick={() => handleFilterChange('1Y')} className={filter === '1Y' ? 'active-filter-button' : ''}>1Y</button>
              <button onClick={() => handleFilterChange('5Y')} className={filter === '5Y' ? 'active-filter-button' : ''}>5Y</button>
            </div>
          </div>
          :
          <></>
      }
    </>
  );
}

export default StockChart;