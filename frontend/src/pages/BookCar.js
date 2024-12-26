import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal'; // Keep the Modal component
import { useNavigate } from 'react-router-dom'; 

const BookCar = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    carMake: '',
    category: '',
    priceRange: [0, 1000],
    sortBy: ''
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // To track the selected car for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchCars = async () => {
  //     setLoading(true); // Ensure loading state is set to true during fetch
  //     try {
  //       const response = await axios.get('http://localhost:4000/api/cars/available', {
  //         params: {
  //           startDate: filters.startDate || null, // Pass startDate if available
  //           endDate: filters.endDate || null,   // Pass endDate if available
  //         },
  //       });
  
  //       setCars(response.data);
  //       setFilteredCars(response.data);
  
  //       const uniqueBrands = [...new Set(response.data.map(car => car.make))];
  //       setBrands(uniqueBrands);
  
  //       const uniqueCategories = [...new Set(response.data.map(car => car.category))];
  //       setCategories(uniqueCategories);
  //     } catch (err) {
  //       console.error('Error fetching cars:', err);
  //     } finally {
  //       setLoading(false); // Ensure loading is set to false after fetch
  //     }
  //   };
  
  //   fetchCars(); // Fetch cars regardless of the date filters
  // }, [filters.startDate, filters.endDate]); // Re-run when rental dates change
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true); // Ensure loading state is set to true during fetch
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cars/available`, {
          params: {
            startDate: filters.startDate || null, // Pass startDate if available
            endDate: filters.endDate || null,   // Pass endDate if available
          },
        });
  
        setCars(response.data);
        setFilteredCars(response.data);
  
        const uniqueBrands = [...new Set(response.data.map(car => car.make))];
        setBrands(uniqueBrands);
  
        const uniqueCategories = [...new Set(response.data.map(car => car.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };
  
    fetchCars(); // Fetch cars regardless of the date filters
  }, [filters.startDate, filters.endDate]); // Re-run when rental dates change
  
  

  const handleSearch = (keyword) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, keyword: keyword || '' };
      filterCars(updatedFilters);
      return updatedFilters;
    });
  };

  // const handleFilterChange = (newFilters) => {
  //   setFilters(prev => {
  //     const updatedFilters = { ...prev, ...newFilters };
  //     return updatedFilters; // Filters will include startDate and endDate
  //   });
  // };
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };
      filterCars(updatedFilters); // Call filterCars with the updated filters
      return updatedFilters;
    });
  };
  
  

  // const filterCars = async ({ keyword, carMake, category, priceRange }) => {
  //   const filtered = cars.filter(car => {
  //     const matchesKeyword = keyword
  //       ? car.make.toLowerCase().includes(keyword.toLowerCase()) ||
  //         car.model.toLowerCase().includes(keyword.toLowerCase())
  //       : true;
  //     const matchesMake = carMake ? car.make === carMake : true;
  //     const matchesCategory = category ? car.category === category : true;
  //     const matchesPrice = car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1];
  //     return matchesKeyword && matchesMake && matchesCategory && matchesPrice;
  //   });

  //   setFilteredCars(filtered);
  //   setCurrentPage(1);
  // };
  const filterCars = ({ keyword, carMake, category, priceRange, startDate, endDate }) => {
    const filtered = cars.filter((car) => {
      const matchesKeyword = keyword
        ? car.make.toLowerCase().includes(keyword.toLowerCase()) ||
          car.model.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchesMake = carMake ? car.make === carMake : true;
      const matchesCategory = category ? car.category === category : true;
      const matchesPrice = car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1];
      const matchesStartDate = startDate ? new Date(car.availableFrom) <= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(car.availableTo) >= new Date(endDate) : true;
  
      return (
        matchesKeyword &&
        matchesMake &&
        matchesCategory &&
        matchesPrice &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  
    setFilteredCars(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  };
  

  const openModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCar(null);
    setIsModalOpen(false);
  };

  const handleBookNow = (car) => {
    console.log('Booking car:', car);
    // Add navigation logic or API calls for booking here
    navigate(`/book/${car._id}`);
    closeModal();
  };
  
  
  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="book-a-car-page">
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        // onSortChange={handleSortChange}
        brands={brands}
        categories={categories}
      />

      <br /><br />

      <div className="car-listings">
        {loading ? (
          <p>Loading cars...</p>
        ) : (
          currentCars.map(car => (
            <div
              key={car._id}
              className="car-details"
              onClick={() => openModal(car)}
              style={{cursor: 'pointer', backgroundColor: car.color,}}
            >
              <img src={car.imageUrl} alt={car.make} width="200" height="150" />
              {/* <p>{car.year}</p> */}
              <h3>{car.make} {car.model}</h3>
              <p>{car.pricePerDay} BHD / Day</p>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredCars.length / carsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for selected car */}
      {isModalOpen && selectedCar && (
        <Modal
          car={selectedCar}
          onClose={closeModal}
          onBookNow={handleBookNow}
        />
      )}
    </div>
  );
};

export default BookCar;
