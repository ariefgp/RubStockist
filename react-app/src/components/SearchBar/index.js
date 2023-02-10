import React, { useEffect, useState } from "react";
import { NavLink, useHistory, Redirect, Link } from "react-router-dom";
import './SearchBar.css';

const SearchBar = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [matchingText, setMatchingText] = useState('');
    const [active, setActive] = useState('');

    const MAX_RESULTS = 5;

    useEffect(() => {
        let timer;
        setLoading(true);

        if (query.length > 0) {
            setLoading(true);
            setActive('active');
            timer = setTimeout(() => {
                handleSearch();
            }, 250);
        } else {
            setResults([]);
            setActive('');
            clearTimeout(timer);
        }

        return () => clearTimeout(timer);

    }, [query]);


    const handleFormSubmit = (e) => {
        e.preventDefault();
    }


    async function handleSearch(e) {
        // e.preventDefault();
        setLoading(true);

        const res = await fetch(`/api/stocks/search/${query}`);
        const data = await res.json();
        setResults(data.stocks);
        setActive('active');
        setMatchingText(query.toUpperCase().split(''))

        setLoading(false);
    }

    const handleSearchClick = (symbol) => {

        if (typeof symbol === 'string') {
            setQuery('');
            setResults([]);
            symbol = symbol.toUpperCase();
            // Redirect(`/stocks/${symbol}`);
            // .then(() => history.push(`/stocks/${symbol}`));
            // history.push(`/stocks/${symbol}`)
            // return <Redirect to={`/stocks/${symbol}`}></Redirect>
        } else {
            return
        }
    }

    return (
        <div className="search-bar-container">
            <form onSubmit={handleFormSubmit}>
                <i className="fa-solid fa-magnifying-glass"></i>
                &nbsp;
                <input type="search" onChange={e => setQuery(e.target.value)} value={query}
                    placeholder="Search for a stock"
                />
                {/* <button onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button> */}
            </form>
            <div className={`search-results-dropdown ${results.length > 0 ? `${active}` : ''}`}>
                <div id="search-results-ul">
                    {loading && 
                    <div className='search-results-individual-result'>
                        <span className='search-results-individual-result-symbol'>
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                            &nbsp;
                            Loading...
                        </span>
                    </div>
                    }

                    {results.slice(0, MAX_RESULTS).map(result => (
                        <div key={result.id} className='search-results-individual-result' onClick={() => handleSearchClick(result.symbol)}>
                            <Link to={`/stocks/${result.symbol}`}>
                                <span className='search-results-individual-result-symbol'>
                                    {result.symbol.split('').map((text, i) => (
                                        <span key={i} className={matchingText.includes(text.toUpperCase()) ? 'highlight' : ''}>
                                            {text}
                                        </span>
                                    ))}
                                    {/* {result.symbol} */}
                                </span>
                                &nbsp;
                                -
                                &nbsp;
                                <span className='search-results-individual-result-name'>
                                    {result.company_name.split('').map((text, i) => (
                                        <span key={i} className={matchingText.includes(text.toUpperCase()) ? 'highlight' : ''}>
                                            {text}
                                        </span>
                                    ))}
                                    {/* {result.company_name} */}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default SearchBar;