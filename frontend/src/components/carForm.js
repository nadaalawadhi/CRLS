import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const CarForm = ({ carToEdit, onCarAdded, onCarUpdated }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: '',
    availability: true,
    color: '#ffffff', 
    imageUrl: '',
    description: '',
    category: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const categories = [
    'Economy', 'Compact', 'Mid-size', 'Full-size', 'Luxury',
    'SUV', 'Crossover', 'Convertible', 'Sports Car',
    'Van/Minivan', 'Pickup Truck', 'Electric', 'Hybrid',
    'Premium SUV', 'Sedan',
  ];

  useEffect(() => {
    if (carToEdit) {
      setFormData({
        ...carToEdit,
        availability: carToEdit.availability !== undefined ? carToEdit.availability : true,
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: '',
        pricePerDay: '',
        availability: true,
        color: '#ffffff',
        imageUrl: '',
        description: '',
        category: '',
      });
    }
    if (carToEdit && carToEdit.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = carToEdit.imageUrl;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [carToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     try {
  //       const formData = new FormData();
  //       formData.append('file', file);

  //       const response = await axios.post('/api/upload-image', formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });

  //       if (response.status === 200) {
  //         const imageUrl = response.data.url;
  //         setFormData((prevData) => ({ ...prevData, imageUrl }));

  //         // Load the image into the canvas for color picking
  //         const img = new Image();
  //         img.src = imageUrl;
  //         img.onload = () => {
  //           const canvas = canvasRef.current;
  //           const ctx = canvas.getContext('2d');
  //           canvas.width = img.naturalWidth; // Use the natural dimensions of the image
  //           canvas.height = img.naturalHeight;
  //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //         };          
  //       }
  //     } catch (err) {
  //       console.error('Error uploading image:', err);
  //       setError('Image upload failed');
  //     }
  //   }
  // };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post("/api/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (response.status === 200) {
          const imageUrl = response.data.url;
          setFormData((prevData) => ({ ...prevData, imageUrl }));
  
          // Load the image into the canvas for color picking
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        setError("Image upload failed. Please try again.");
      }
    }
  };
  

  const handleImageClick = (e) => {
    const canvas = canvasRef.current;
    const rect = e.target.getBoundingClientRect(); // Displayed image dimensions
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width; // Map to canvas
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
      .toString(16)
      .slice(1)}`;
    setFormData((prevData) => ({ ...prevData, color: hexColor }));
  };
  
  

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      availability: !prevData.availability,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  
  //   try {
  //     if (carToEdit) {
  //       const response = await axios.put(`/api/cars/${carToEdit._id}`, formData);
  //       if (response.status === 200) {
  //         onCarUpdated(response.data); // Trigger success modal with update message
  //       }
  //     } else {
  //       const response = await axios.post("/api/cars", formData);
  //       if (response.status === 201) {
  //         onCarAdded(response.data); // Trigger success modal with add message
  //         setFormData({
  //           make: "",
  //           model: "",
  //           year: "",
  //           pricePerDay: "",
  //           availability: true,
  //           color: "#ffffff",
  //           imageUrl: "",
  //           description: "",
  //           category: "",
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error saving car:", err);
  //     setError("Failed to save the car. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Validations
    // Make Validation
    if (!/^[a-zA-Z]{2,50}$/.test(formData.make)) {
      setError("Car make must be 2-50 alphabetic characters.");
      setLoading(false);
      return;
    }

    // Updated Model Validation
    if (!/^[a-zA-Z0-9\s\-]{2,50}$/.test(formData.model)) {
      setError("Car model must be 2-50 characters and can include letters, numbers, spaces, and hyphens.");
      setLoading(false);
      return;
    }
  
    if (!/^\d{4}$/.test(formData.year) || formData.year < 1886 || formData.year > new Date().getFullYear()) {
      setError(`Car year must be a valid 4-digit number between 1886 and ${new Date().getFullYear()}.`);
      setLoading(false);
      return;
    }
  
    // if (!categories.includes(formData.category)) {
    //   setError("Please select a valid car category.");
    //   setLoading(false);
    //   return;
    // }
  
    if (formData.pricePerDay <= 0) {
      setError("Price per day must be a positive number.");
      setLoading(false);
      return;
    }
  
    if (formData.description.length > 500) {
      setError("Description must be less than 500 characters.");
      setLoading(false);
      return;
    }
  
    // if (!/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
    //   setError("Invalid color format. Please select a valid hex color.");
    //   setLoading(false);
    //   return;
    // }
  
    try {
      if (carToEdit) {
        const response = await axios.put(`/api/cars/${carToEdit._id}`, formData);
        if (response.status === 200) {
          onCarUpdated(response.data);
        }
      } else {
        const response = await axios.post("/api/cars", formData);
        if (response.status === 201) {
          onCarAdded(response.data);
          setFormData({
            make: "",
            model: "",
            year: "",
            pricePerDay: "",
            availability: true,
            color: "#ffffff",
            imageUrl: "",
            description: "",
            category: "",
          });
        }
      }
    } catch (err) {
      console.error("Error saving car:", err);
      setError("Failed to save the car. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="car-form-container">
      <h2>{carToEdit ? 'Edit Car' : 'Add New Car'}</h2>
      {/* {error && <div className="error-message">{error}</div>} */}
      <form onSubmit={handleSubmit}>

        <div>
           <label>Manufacturer</label>
           <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            placeholder="Car Make"
            required
          />
        </div>

        <div>
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Car Model"
            required
          />
        </div>

        <div>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Year of Manufacture"
            required
          />
        </div>

        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Price per Day</label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleInputChange}
            placeholder="Price per Day"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Car Description"
            required
          />
        </div>

        <div>
          <label>Availability</label>
          <div className="availability-container">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleCheckboxChange}
          />
          <span>{formData.availability ? 'Available' : 'Not Available'}</span>
        </div>
        </div>

        <div>
          <label>Image</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Car"
              style={{ width: '100px', marginTop: '10px', cursor: 'crosshair' }}
              onClick={handleImageClick}
            />
          )}
        </div>
        <div>
          <label>Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            required
            className="color-picker"
          />
          {formData.imageUrl && (
            <p>Click on the image to pick a color.</p>
          )}
        </div>
        {/* <div>
          <label>Color</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              required
            />
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: formData.color,
                border: "1px solid #ccc",
              }}
            ></div>
          </div>
          {formData.imageUrl && <p>Click on the image to pick a color.</p>}
        </div> */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving Car...' : carToEdit ? 'Save Changes' : 'Add Car'}
        </button>
      </form>
    </div>
  );
};

export default CarForm;
