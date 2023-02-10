import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { getAllUserHoldings } from '../../store/holdings';

import { formatToCurrency } from '../utility';

const ProfileHoldings = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const user = useSelector(state => state.session.user);

    const holdings = useSelector(state => state.holdings.allHoldings);

    return (
        <div className='profile-page-holdings-container'>
            <>
                {holdings.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Company Name</th>
                                <th>Shares</th>
                                <th>Avg. Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {
                                    holdings.map(holding => (
                                        <tr>
                                            <td>{holding.stock[0].symbol}</td>
                                            <td>{holding.stock[0].company_name}</td>
                                            <td>x{holding.shares}</td>
                                            <td>${formatToCurrency(holding.avg_cost)}</td>
                                        </tr>
                                    ))
                                }
                            </>
                        </tbody>
                    </table>
                    :
                    <p>
                        You do not have any holdings
                    </p>
                }
            </>
        </div>
    )
}
export default ProfileHoldings;