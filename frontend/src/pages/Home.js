import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const checkLoginAndRedirect = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/BookCar');
    } else {
      setMessage('You must be logged in to book a car. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const testimonials = [
    {
      text: "Great service and amazing cars! I rented a car for a week, and the experience was flawless. The car was clean, well-maintained, and ready on time. I highly recommend this company for anyone traveling in Bahrain.",
      author: "John Doe",
    },
    {
      text: "The booking process was so easy, and there were no hidden fees. The staff was professional and friendly, making the entire experience stress-free. I’ll definitely use this service again for my future trips.",
      author: "Jane Smith",
    },
    {
      text: "I needed a car urgently for a family trip, and they delivered. The 24/7 support team was very responsive and helped me choose the perfect vehicle. Truly outstanding service!",
      author: "Michael Lee",
    },
    {
      text: "Affordable prices, excellent customer care, and a wide range of vehicles to choose from. This company stands out among other rental services in Bahrain. Highly recommended!",
      author: "Sara Ali",
    },
    {
      text: "The convenience of picking up and dropping off the car at different locations made my trip much easier. The vehicle was in perfect condition, and the staff ensured everything was seamless.",
      author: "Ahmed Salman",
    },
    {
      text: "Rented a luxury car for a special occasion, and it was worth every penny. The car was spotless, and the rental process was quick and smooth. Five stars for an amazing experience!",
      author: "Nora Hassan",
    },
    {
      text: "Convenient locations, flexible rental options, and excellent customer service. I’ve rented from them multiple times and have never been disappointed. Keep up the great work!",
      author: "Omar Yusuf",
    },
    {
      text: "I was impressed by how well-maintained the cars are. The process was hassle-free, and I could pick up the car at the Muharraq branch within minutes. Thank you for the exceptional service!",
      author: "Layla Kareem",
    },
    {
      text: "Professional, reliable, and affordable. They made my trip stress-free by providing a dependable car and excellent support. I’ll recommend this company to everyone I know.",
      author: "Hassan Ibrahim",
    },
    {
      text: "I’ve tried many car rental services, but this one stands out. The attention to detail and customer-first attitude make them the best in Bahrain. Thank you for making my journey memorable!",
      author: "Fatima Zain",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show three cards at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Your Next Adventure Starts Here</h1>
        <p>Find the perfect car for your next trip with ease.</p>
        {/* <button className="cta-btn" onClick={checkLoginAndRedirect}>Browse Cars</button> */}

        {
          (() => {
            const user = JSON.parse(localStorage.getItem('user'));

            if (user && user.role === 'customer') {
              // Customer can see the button
              return (
                <button className="cta-btn" onClick={checkLoginAndRedirect}>
                  Browse Cars
                </button>
              );
            } else if (!user) {
              // Not logged-in users see a login prompt button
              return (
                <button
                  className="cta-btn"
                  onClick={() => navigate('/login')}
                >
                  Login to Browse Cars
                </button>
              );
            }
            // Admins or other roles won't see the button
            return null;
          })()
        }
        
        {message && <p className="redirect-info">{message}</p>}
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>
          Welcome to our premier car rental company in Bahrain! With three
          convenient branches in Muharraq, Manama, and Riffa, we strive to make
          your journey seamless. Whether you’re looking for an economy vehicle,
          a luxury ride, or something in between, we’ve got you covered.
        </p>
        <p>
          Our mission is to provide reliable, affordable, and high-quality
          vehicles for locals and visitors alike. We pride ourselves on
          exceptional customer service, a diverse fleet of vehicles, and
          flexible rental options to suit your needs. From daily rentals to
          long-term leasing, we’re here to help you make the most of your travels.
        </p>
        <p>
          At the core of our company is a commitment to sustainability and
          innovation. We actively work to reduce our environmental footprint by
          maintaining a fleet of fuel-efficient and hybrid vehicles. By choosing
          us, you’re contributing to a greener and more sustainable future.
        </p>
        <p>
          Whether you’re exploring Bahrain for business or leisure, we ensure
          every journey is comfortable, convenient, and worry-free. Our dedicated
          team is available around the clock to assist you, making your rental
          experience as smooth and enjoyable as possible.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Customers Are Saying</h2>
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p>"{testimonial.text}"</p>
              <h4>- {testimonial.author}</h4>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
};

export default LandingPage;
