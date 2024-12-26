import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import CarForm from "../components/carForm";

Modal.setAppElement("#root");

const CarPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [carToMarkUnavailable, setCarToMarkUnavailable] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;  

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        setCars(response.data);
        setFilteredCars(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cars");
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Adds a smooth scrolling effect
    });
  };
  

  const filterCars = () => {
    let filtered = [...cars];
    if (searchKeyword) {
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          car.model.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          String(car.year).includes(searchKeyword)
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((car) => car.category === categoryFilter);
    }
    if (availabilityFilter) {
      const isAvailable = availabilityFilter === "true";
      filtered = filtered.filter((car) => car.availability === isAvailable);
    }
    setFilteredCars(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  };
  
  useEffect(() => {
    filterCars();
  }, [searchKeyword, categoryFilter, availabilityFilter, cars]);
  

  const handleCarDeleted = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    setSuccessMessage("Car deleted successfully!");
    setIsSuccessOpen(true);
  };

  const handleCarUpdated = (updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
    );
    setSuccessMessage("Car updated successfully!");
    setIsSuccessOpen(true);
    closePopup();
  };

  const openPopup = (car = null) => {
    setCarToEdit(car);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setCarToEdit(null);
    setIsPopupOpen(false);
  };

  const openConfirmationModal = async (car) => {
    try {
      // Check if the car has reservations
      const response = await axios.get(`/api/cars/${car._id}/reservations`);
      if (response.data.hasReservations) {
        setCarToMarkUnavailable(car);
        setIsUnavailableModalOpen(true);
      } else {
        // If no reservations, open the delete confirmation modal
        setCarToDelete(car);
        setIsConfirmationOpen(true);
      }
    } catch (err) {
      console.error("Error checking reservations:", err);
      alert("Failed to check reservations. Please try again.");
    }
  };
  const markCarUnavailableAndNotify = async () => {
    if (carToMarkUnavailable) {
      try {
        // Mark car as unavailable
        const updatedCar = { ...carToMarkUnavailable, availability: false };
        await axios.put(`/api/cars/${carToMarkUnavailable._id}`, updatedCar);
  
        // Notify customers
        await axios.post(`/api/reservations/notify`, { carId: carToMarkUnavailable._id });
  
        handleCarUpdated(updatedCar);
        alert('Car marked as unavailable. Customers have been notified.');
      } catch (err) {
        console.error('Error marking car unavailable:', err);
        alert('Failed to mark car unavailable and notify customers. Please try again.');
      }
    }
  };
  
  
  
  const confirmDeleteCar = async () => {
    try {
      const response = await axios.delete(`/api/cars/${carToDelete._id}`);
      if (response.status === 200) {
        handleCarDeleted(carToDelete._id);
        setCarToDelete(null);
        closeConfirmationModal();
      }
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Failed to delete car. Please try again.");
    }
  };  

  const closeConfirmationModal = () => {
    setCarToDelete(null);
    setIsConfirmationOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="car-page">
      {/* Admin Search Bar */}
      <div className="admin-search-bar">
        <h2>Manage Cars</h2>
        <div className="search-input">
          <input
            type="text"
            placeholder="Search by make, model, or year"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {Array.from(new Set(cars.map((car) => car.category))).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="">All Availability</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <div className="add-car-button-div">
          <button onClick={() => openPopup()} className="add-car-button">
            Add Car
          </button>
        </div>
      </div>

      {/* Car Listings */}
      <div className="cars">
        {currentCars.map((car) => (
          <div
            key={car._id}
            className="car-details-container"
            style={{ cursor: "pointer", backgroundColor: car.color }}
          >
            <img
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              className="car-image"
            />
            <h4>
              {car.make} {car.model} ({car.year})
            </h4>
            <p>
              <strong>Price:</strong> {car.pricePerDay} BHD / Day
            </p>
            <p>
              <strong>Category:</strong> {car.category}
            </p>
            <p>
              {/* <strong>Availability:</strong>{" "}
              {car.availability ? "Available" : "Unavailable"} */}
            </p>
            <div className="car-actions">
              <span 
              className="edit-action" 
              onClick={() => openPopup(car)}
              style={{ cursor: "pointer", color: "blue" }}
              >
                Edit
              </span>
              <span className="divider" style={{ color: "grey" }}>|</span>
              <span
                className="delete-action"
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirmationModal(car);
                }}
                style={{ cursor: "pointer", color: "red" }}
              >
                Delete
              </span>
            </div>
          </div>
        ))}
      </div>
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

      {/* Popup for Add/Edit Car */}
      {isPopupOpen && (
        <Modal
        isOpen={isPopupOpen}
        onRequestClose={closePopup}
        className="popup-content"
        overlayClassName="popup-overlay"
      >
        <CarForm
          carToEdit={carToEdit}
          onCarAdded={(newCar) => {
            setCars([...cars, newCar]);
            setSuccessMessage("Car added successfully!");
            setIsSuccessOpen(true);
            closePopup(); // Close the popup after adding a car
          }}
          onCarUpdated={handleCarUpdated}
        />
      </Modal>      
      )}

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <Modal
          isOpen={isConfirmationOpen}
          onRequestClose={closeConfirmationModal}
          className="confirmation-modal"
          overlayClassName="popup-overlay"
        >
          <h3>Are you sure you want to delete this car?</h3>
          <div className="confirmation-buttons">
            <button className="confirm-button" onClick={confirmDeleteCar} >
              Yes
            </button>
            <button className="cancel-button" onClick={closeConfirmationModal}>
              No
            </button>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {isSuccessOpen && (
        <Modal
          isOpen={isSuccessOpen}
          onRequestClose={closeSuccessModal}
          className="success-modal"
          overlayClassName="popup-overlay"
        >
          <h3>{successMessage}</h3>
          <button className="ok-button" onClick={closeSuccessModal}>
            OK
          </button>
        </Modal>
      )}

      {/* {isUnavailableModalOpen && (
        <Modal
          isOpen={isUnavailableModalOpen}
          onRequestClose={() => setIsUnavailableModalOpen(false)}
          className="confirmation-modal"
          overlayClassName="popup-overlay"
        >
          <h3>This car has reservations and cannot be deleted. Do you want to mark it as unavailable?</h3>
          <div className="confirmation-buttons">
            <button
              className="confirm-button"
              onClick={async () => {
                if (carToMarkUnavailable) {
                  const updatedCar = { ...carToMarkUnavailable, availability: false };
                  await axios.put(`/api/cars/${carToMarkUnavailable._id}`, updatedCar);
                  handleCarUpdated(updatedCar);
                }
                setIsUnavailableModalOpen(false);
              }}
            >
              Yes
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsUnavailableModalOpen(false)}
            >
              No
            </button>
          </div>
        </Modal>
      )} */}
      {isUnavailableModalOpen && (
        <Modal
          isOpen={isUnavailableModalOpen}
          onRequestClose={() => setIsUnavailableModalOpen(false)}
          className="confirmation-modal"
          overlayClassName="popup-overlay"
        >
          <h3>
            This car have reservations and cannot be deleted. Do you want to mark it<br/>
            as unavailable? Customers with ongoing or upcoming reservations will be notified.
          </h3>
          <div className="confirmation-buttons">
            <button
              className="confirm-button"
              onClick={async () => {
                await markCarUnavailableAndNotify();
                setIsUnavailableModalOpen(false);
              }}
            >
              Yes
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsUnavailableModalOpen(false)}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarPage;
