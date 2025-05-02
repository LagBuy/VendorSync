import { useEffect, useState } from "react";
import { FcIdea } from "react-icons/fc";
const ideasAndQuotes = [
  "Online Estate Auction Platform",
  "Vertical Farming",
  "Eco-Friendly Packaging Solutions",
  "Indoor Air Purification Services",
  "Bespoke Furniture Design",
  "Mobile Health Clinics",
  "Elderly Care Tech",
  "Pet DNA Testing",
  "Aquaponics Farming",
  "Nutraceuticals",
  "Personalized Nutrition",
  "Hyperlocal Online Grocery Delivery",
  "Drone Photography Services",
  "Niche Subscription Boxes",
  "Urban Rooftop Gardens",
  "Recycling Vending Machines",
  "Niche Online Marketplaces",
  "Waste-to-Energy Solutions",
  "Personalized Art Services",
  "Gourmet Ice Cream Truck",
  "Home Energy Audits",
  "Vintage Car Restoration",
  "Luxury Car Rental",
  "3D Printing Services",
  "Mobile Car Wash & Detailing",
  "Digital Estate Planning",
  "Microbrewery",
  "Personal Concierge Services",
  "Bicycle-Sharing Service",
  "Mobile Pet Grooming",
  "Luxury Picnic Service",
  "Pop-Up Shops",
  "Pop-Up Hotel Rooms",
  "Blockchain Solutions",
  "Personalized Clothing Line",
  "Exotic Pet Breeding",
  "Immersive Virtual Travel Experiences",
  "Tech-Enabled Recycling Bin",
  "Hyper-Personalized Fitness Plans",
  "Online Vintage and Thrift Shop",
  "Pet-Friendly Cafes",
  "Corporate Wellness Programs",
  "Home-Based Wellness Retreats",
  "Cultural Cuisine Food Truck",
  "Electric Vehicle Charging Stations",
  "Smart Mirror Fitness System",
  "Customized Gifts for Businesses",
  "Sustainable Fashion Line",
];

export default function NigerianBusinessIdeasAndQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 7000); // Every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ideasAndQuotes.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ideasAndQuotes.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-10">
      <div className="flex items-center mb-6 text-center">
        <FcIdea className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white text-center justify-center">
          Some Business Ideas
        </h2>
      </div>

      <p className="text-gray-100 text-lg italic mb-6">
        {ideasAndQuotes[currentIndex]}
      </p>

      <div className="flex gap-8">
        <button
          onClick={goToPrevious}
          className="text-3xl text-yellow-700 hover:text-yellow-900"
          title="Previous"
        >
          ◀️
        </button>
        <button
          onClick={goToNext}
          className="text-3xl text-yellow-700 hover:text-yellow-900"
          title="Next"
        >
          ▶️
        </button>
      </div>
    </div>
  );
}
