import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleStockDataFromAPI } from '../../store/stocks';

import ApexCharts from 'react-apexcharts'
import moment from 'moment';

import { isObjectEmpty } from '../utility';

// import './WatchListStockChart.css';

const HoldingsStockChartMini = ({stockSymbol}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
//   const singleStockInfo = useSelector(state => state.stocks.singleStock.Info);

  const [color, setColor] = useState('#00C805');

  const [filter, setFilter] = useState('1D');
  const [xaxisCategories, setXaxisCategories] = useState([]);

  const [currentMarketPrice, setCurrentMarketPrice] = useState(true);
  // console.log("stockSymbol in mini chart", stockSymbol)
  // const timeSeriesData = useSelector(state => state.watchlists?.watchlistStockData[stockSymbol]?.dailyData);
  const timeSeriesData = useSelector(state => state.holdings?.stockData[stockSymbol]?.values);
  const [tempData, setTempData] = useState();
  const [series, setSeries] = useState([]);


  useEffect(() => {
    setLoading(true);
    // console.log('timeSeriesData: ', timeSeriesData)
    if (typeof timeSeriesData !== 'undefined') {
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
        return { x: item.datetime, y: item.close }
      });
      setSeries([{ name: '', data: seriesData }])
      setXaxisCategories(tempData.map(({ datetime }) => {
        return moment(datetime).format('HH:mm');
      }));

      if(seriesData?.length > 0) {
        setColor(seriesData[seriesData.length - 1].y > seriesData[0].y ? '#00C805' : '#FF0000');
      }
    }
  }, [tempData, filter])


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

    xaxis: {
      categories: [],
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
      width: 2
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false,
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
        (!loading ) ?
          <div>
            <div className='watchlist-stock-chart-container'>
              <ApexCharts options={options} series={series} width='140px' />
            </div>
          </div>
          :
          <>
          <i className="fa-solid fa-circle-notch fa-spin"></i>
          </>
      }
    </>
  );
}

export default HoldingsStockChartMini;