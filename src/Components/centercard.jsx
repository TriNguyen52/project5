import React, { useState, useEffect } from "react";
import "./centercard.css"; // Your CSS file for styling
import Dashboard from "./dashboard";

const Centercard = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Function to fetch breweries based on search input
  const fetchBreweries = async (query) => {
    setIsLoading(true);
    const response = await fetch(
      `https://api.openbrewerydb.org/v1/breweries/search?query=${query}`
    );
    const data = await response.json();
    setSearchResults(data);
    setIsLoading(false);
  };

  // Fetch all breweries on component mount
  useEffect(() => {
    const fetchAllBreweries = async () => {
      setIsLoading(true);
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/search?query=${query}`);
      const data = await response.json();
      setSearchResults(data);
      setIsLoading(false);
    };
    fetchAllBreweries();
  }, []);

  // Function to handle search input change
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      fetchBreweries(searchValue);
    } else {
      setSearchResults([]);
    }
  };

  // Scroll to search bar function
  const scrollToSearchBar = () => {
    document.getElementById("search-bar").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Filter results based on type and city
  const filteredResults = searchResults.filter((brewery) => {
    return (
      (filterType === "" || brewery.brewery_type === filterType) &&
      (filterCity === "" || brewery.city === filterCity)
    );
  });

  // Summary statistics based on filtered results
  const totalBreweries = filteredResults.length;
  const totalMicroBreweries = filteredResults.filter(
    (brewery) => brewery.brewery_type === "micro"
  ).length;
  const totalCities = new Set(filteredResults.map((brewery) => brewery.city)).size;

  return (
    <div className="centercard">
      <header className="header">
        <h1>Let's grab a beer!!!</h1>
      </header>

      <div className="main-content">
        {/* Main content section on the left */}
        <section className="card-section">
          <div className="stats-card">
            <h3>Total Breweries: {totalBreweries}</h3>
            <h4>Total Micro Breweries: {totalMicroBreweries}</h4>
            <h4>Total Cities: {totalCities}</h4>
          </div>

          {/* Search input with id */}
          <input
            id="search-bar"
            type="text"
            placeholder="Search for breweries..."
            value={searchInput}
            onChange={(e) => searchItems(e.target.value)}
          />

          {/* Filters */}
          <div className="filters">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="micro">Micro</option>
              <option value="regional">Regional</option>
              <option value="brewpub">Brewpub</option>
            </select>
            <input
              type="text"
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </div>

          {/* Loading indicator */}
          {isLoading && <p>Loading...</p>}

          {/* Display search results */}
          {filteredResults.length > 0 && (
            <table className="astro-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Brewery Type</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((brewery) => (
                  <tr key={brewery.id}>
                    <td>{brewery.name}</td>
                    <td>{brewery.address_1}</td>
                    <td>{brewery.city}</td>
                    <td>{brewery.brewery_type}</td>
                    <td>{brewery.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* If no results */}
          {!isLoading && searchInput !== "" && filteredResults.length === 0 && (
            <p>No results found for "{searchInput}".</p>
          )}
        </section>

        {/* Dashboard section on the right, sticky while scrolling */}
        <aside className="dashboard-section">
          <Dashboard onSearchClick={scrollToSearchBar} />
        </aside>
      </div>
    </div>
  );
};

export default Centercard;
