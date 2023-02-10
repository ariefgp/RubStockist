import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleStockCompanyInfoFromAPI } from "../../store/stocks";
import { formatToCurrency, abbrNum } from "../utility";
import "./StockPageAboutCompany.css";

const StockPageAboutCompany = () => {
    const dispatch = useDispatch();
    const { symbol } = useParams();

    useEffect(() => {
        dispatch(getSingleStockCompanyInfoFromAPI(symbol));
        console.log('company info', companyInfo)
    }, [dispatch, symbol]);

    const companyInfo = useSelector(state => state.stocks.singleStock.CompanyInfo);


    return (
        <>
            {
                companyInfo && companyInfo.Name ?

                    <div classname='stock-page-about-company-container'>
                        <div className="stock-page-about-company-container-section-header">
                            <h2>About</h2>
                        </div>
                        <p>{companyInfo.Description}</p>
                        <div classname='stock-page-about-company-about-details'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Industry</th>
                                        <th>Exchange</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{companyInfo.Name}</td>
                                        <td>{companyInfo.Address}</td>
                                        <td>{companyInfo.Industry}</td>
                                        <td>{companyInfo.Exchange}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div classname='stock-page-about-company-key-statistics-container'>
                            <div className="stock-page-about-company-container-section-header">
                                <h2>Key Statistics</h2>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Market Cap</th>
                                        <th>PE Ratio</th>
                                        <th>Dividend Yield</th>
                                        <th>Analyst Target Price</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${abbrNum(parseFloat(companyInfo.MarketCapitalization), 2).length > 0 && abbrNum(parseFloat(companyInfo.MarketCapitalization), 2).toUpperCase()}</td>
                                        <td>{companyInfo.PERatio}</td>
                                        <td>{companyInfo.DividendYield}</td>
                                        <td>${formatToCurrency(companyInfo.AnalystTargetPrice)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <td>&nbsp;</td>
                                    </tr>
                                </thead>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Year High</th>
                                        <th>Year Low</th>
                                        <th>Sector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{companyInfo.Symbol}</td>
                                        <td>${formatToCurrency(companyInfo["52WeekHigh"])}</td>
                                        <td>${formatToCurrency(companyInfo["52WeekLow"])}</td>
                                        <td>{companyInfo.Sector}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
            }
        </>
    );
}

export default StockPageAboutCompany;