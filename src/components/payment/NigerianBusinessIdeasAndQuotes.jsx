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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 7000); // Every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ideasAndQuotes.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? ideasAndQuotes.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#000000] shadow-xl rounded-xl p-6 border border-[#1F2937] mb-10 backdrop-blur-lg">
      <div className="flex items-center mb-6">
        <div className="bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20 mr-4">
          <FcIdea size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Business Ideas & Inspiration
        </h2>
      </div>

      <div className="relative min-h-[80px] flex items-center justify-center">
        <p 
          className={`text-white text-lg italic text-center transition-all duration-300 transform ${
            isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {ideasAndQuotes[currentIndex]}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#1F2937]">
        <div className="text-gray-400 text-sm">
          {currentIndex + 1} / {ideasAndQuotes.length}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={goToPrevious}
            className="p-3 rounded-lg bg-[#1F2937] hover:bg-yellow-500/20 border border-[#374151] hover:border-yellow-500/50 transition-all duration-200 group"
            title="Previous"
          >
            <span className="text-xl text-gray-400 group-hover:text-yellow-500 transition-colors">
              ◀
            </span>
          </button>
          
          <button
            onClick={goToNext}
            className="p-3 rounded-lg bg-[#1F2937] hover:bg-yellow-500/20 border border-[#374151] hover:border-yellow-500/50 transition-all duration-200 group"
            title="Next"
          >
            <span className="text-xl text-gray-400 group-hover:text-yellow-500 transition-colors">
              ▶
            </span>
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-[#1F2937] rounded-full h-1">
          <div 
            className="bg-yellow-500 h-1 rounded-full transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / ideasAndQuotes.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}