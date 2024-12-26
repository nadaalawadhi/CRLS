// import React, { useState } from 'react';
// import { Slider } from '@mui/material';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';


// const SearchBar = ({ onSearch, onFilterChange, brands, categories}) => {
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [category, setCategory] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');


//   const handleInputChange = (e) => {
//     onSearch(e.target.value); // Call the search function
//   };
   
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setCategory(value);
//       onFilterChange({ category: value, priceRange, startDate, endDate });
//     } else if (name === 'startDate' || name === 'endDate') {
//       if (name === 'startDate') setStartDate(value);
//       if (name === 'endDate') setEndDate(value);
//       onFilterChange({ category, priceRange, startDate: value, endDate });
//       }
//   };

//   const handleBrandChange = (e) => {
//     onFilterChange({ carMake: e.target.value });
//   };
  
//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//     onFilterChange({ startDate: date });
//   };
  
//   const handleEndDateChange = (date) => {
//     setEndDate(date);
//     onFilterChange({ endDate: date });
//   };
  
//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//     // onFilterChange({ priceRange: newValue });
//     onFilterChange({ priceRange: newValue });

//   }; 

//   return (
//     <div className="search-bar">
//       <h2>Book Your Car</h2>

//       <div className="search-input">
//         <input
//           type="text"
//           placeholder="Search by keyword (brand, model, year)"
//           onChange={handleInputChange}
//         />
//       </div> 
      
//       <div className="filters">

//         <div>
//           <select onChange={handleBrandChange}>
//             <option value="">All Brands</option>
//             {brands.map((brand) => (
//               <option key={brand} value={brand}>
//                 {brand}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <select name="category" value={category} onChange={handleFilterChange}>
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Price Range</label>
//           <Slider
//             value={priceRange}
//             onChange={handlePriceChange}
//             valueLabelDisplay="auto"
//             valueLabelFormat={value => `${value} BHD`}
//             min={0}
//             max={300}
//             step={10}
//           />
//         </div>
        
//         <div>
//           <label>Select Rental Period:</label>
//           <div style={{ display: 'flex', gap: '20px' }}>
//             {/* Start Date Picker */}
//             <DatePicker
//               selected={startDate}
//               onChange={handleStartDateChange}
//               startDate={startDate}
//               endDate={endDate}
//               selectsStart
//               placeholderText="Start Date"
//               minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Start tomorrow
//               dateFormat="yyyy/MM/dd"
//               isClearable
//               required
//             />
//             <br/>
//             {/* End Date Picker */}
//             <DatePicker
//               selected={endDate}
//               onChange={handleEndDateChange}
//               startDate={startDate}
//               endDate={endDate}
//               selectsEnd
//               placeholderText="End Date"
//               minDate={
//                 startDate
//                   ? new Date(
//                       Math.max(
//                         new Date().setDate(new Date().getDate() + 1), // Tomorrow
//                         startDate.getTime() // Start date
//                       )
//                     )
//                   : new Date(new Date().setDate(new Date().getDate() + 1)) // Default to tomorrow
//               }
//               dateFormat="yyyy/MM/dd"
//               isClearable
//               required
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;
import React, { useState } from 'react';
import { Slider } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchBar = ({ onSearch, onFilterChange, brands, categories }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleInputChange = (e) => {
    onSearch(e.target.value); // Call the search function
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setCategory(value);
      onFilterChange({ category: value, priceRange, startDate, endDate });
    } else if (name === 'startDate' || name === 'endDate') {
      if (name === 'startDate') setStartDate(value);
      if (name === 'endDate') setEndDate(value);
      onFilterChange({ category, priceRange, startDate: value, endDate });
    }
  };

  const handleBrandChange = (e) => {
    onFilterChange({ carMake: e.target.value });
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null); // Clear the end date
    onFilterChange({ startDate: date, endDate: null }); // Pass the updated filters
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onFilterChange({ endDate: date });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ priceRange: newValue });
  };

  return (
    <div className="search-bar">
      <h2>Book Your Car</h2>

      <div className="search-input">
        <input
          type="text"
          placeholder="Search by keyword (brand, model, year)"
          onChange={handleInputChange}
        />
      </div>

      <div className="filters">
        <div>
          <select onChange={handleBrandChange}>
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select name="category" value={category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Price Range</label>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} BHD`}
            min={0}
            max={300}
            step={10}
          />
        </div>

        <div>
          <label>Select Rental Period:</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Start Date Picker */}
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsStart
              placeholderText="Start Date"
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Start tomorrow
              dateFormat="yyyy/MM/dd"
              isClearable
              required
            />
            <br />
            {/* End Date Picker */}
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              placeholderText="End Date"
              minDate={
                startDate
                  ? new Date(
                      Math.max(
                        new Date().setDate(new Date().getDate() + 1), // Tomorrow
                        startDate.getTime() // Start date
                      )
                    )
                  : new Date(new Date().setDate(new Date().getDate() + 1)) // Default to tomorrow
              }
              dateFormat="yyyy/MM/dd"
              isClearable
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
