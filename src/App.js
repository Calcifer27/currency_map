import React, { useState, useEffect } from 'react';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

const App = () => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [pigPosition, setPigPosition] = useState({ x: 0, y: 0 });
  const [isHitting, setIsHitting] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currentTime, setCurrentTime] = useState('');
  
  // List of currencies with their symbols, colors, denominations, capitals, timezones, and backgrounds
  const currencies = [
    { 
      code: 'USD', 
      symbol: '$', 
      color: '#85bb65', 
      denominations: [1, 5, 10, 20, 50, 100],
      capital: 'Washington D.C.',
      timezone: 'America/New_York',
      bgColor: '#e6f7ff'
    },
    { 
      code: 'EUR', 
      symbol: '€', 
      color: '#0a328c', 
      denominations: [5, 10, 20, 50, 100, 200],
      capital: 'Brussels',
      timezone: 'Europe/Brussels',
      bgColor: '#e6ffe6'
    },
    { 
      code: 'GBP', 
      symbol: '£', 
      color: '#9c27b0', 
      denominations: [5, 10, 20, 50],
      capital: 'London',
      timezone: 'Europe/London',
      bgColor: '#ffe6e6'
    },
    { 
      code: 'JPY', 
      symbol: '¥', 
      color: '#e91e63', 
      denominations: [1000, 2000, 5000, 10000],
      capital: 'Tokyo',
      timezone: 'Asia/Tokyo',
      bgColor: '#fff0e6'
    },
    { 
      code: 'CNY', 
      symbol: '¥', 
      color: '#f44336', 
      denominations: [1, 5, 10, 20, 50, 100],
      capital: 'Beijing',
      timezone: 'Asia/Shanghai',
      bgColor: '#ffffe6'
    },
    { 
      code: 'INR', 
      symbol: '₹', 
      color: '#ff9800', 
      denominations: [10, 20, 50, 100, 200, 500, 2000],
      capital: 'New Delhi',
      timezone: 'Asia/Kolkata',
      bgColor: '#f5e6ff'
    },
    { 
      code: 'AUD', 
      symbol: 'A$', 
      color: '#4caf50', 
      denominations: [5, 10, 20, 50, 100],
      capital: 'Canberra',
      timezone: 'Australia/Sydney',
      bgColor: '#e6fff2'
    },
  ];

  // Current bill denomination
  const [currentDenomination, setCurrentDenomination] = useState(null);

  // Get a random currency different from the current one
  const getRandomCurrency = () => {
    const filteredCurrencies = currencies.filter(c => c.code !== currentCurrency);
    const randomIndex = Math.floor(Math.random() * filteredCurrencies.length);
    return filteredCurrencies[randomIndex];
  };

  // Get a random denomination for the given currency
  const getRandomDenomination = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return 100;
    
    const denominations = currency.denominations;
    const randomIndex = Math.floor(Math.random() * denominations.length);
    return denominations[randomIndex];
  };

  // Move the bill to a random position
  const moveToRandomPosition = () => {
    const x = Math.floor(Math.random() * 80) + 10; // Keep away from edges
    const y = Math.floor(Math.random() * 70) + 15; // Keep away from edges
    setPosition({ x, y });
  };

  // Update local time for the current currency
  const updateLocalTime = () => {
    const currency = currencies.find(c => c.code === currentCurrency);
    if (!currency) return;
    
    try {
      const options = {
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: currency.timezone
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setCurrentTime(formatter.format(new Date()));
    } catch (error) {
      setCurrentTime('12:00 PM'); // Fallback
    }
  };

  // Handle mouse move to control the pig
  const handleMouseMove = (e) => {
    const container = document.getElementById('game-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPigPosition({ x, y });
  };

  // Handle click to hit the bill
  const handleClick = () => {
    // Check if pig is close enough to the bill
    const distance = Math.sqrt(
      Math.pow(pigPosition.x - position.x, 2) + 
      Math.pow(pigPosition.y - position.y, 2)
    );
    
    if (distance < 15) { // If close enough to hit
      setIsHitting(true);
      setTimeout(() => {
        setIsHitting(false);
        const newCurrency = getRandomCurrency();
        setCurrentCurrency(newCurrency.code);
        setCurrentDenomination(getRandomDenomination(newCurrency.code));
        moveToRandomPosition();
        setScore(score + 10);
      }, 300);
    }
  };

  // Initialize the game
  useEffect(() => {
    moveToRandomPosition();
    // Set current currency to a random one at start
    const randomIndex = Math.floor(Math.random() * currencies.length);
    const initialCurrency = currencies[randomIndex].code;
    setCurrentCurrency(initialCurrency);
    setCurrentDenomination(getRandomDenomination(initialCurrency));
  }, []);

  // Update the time every second
  useEffect(() => {
    updateLocalTime();
    const timer = setInterval(updateLocalTime, 1000);
    return () => clearInterval(timer);
  }, [currentCurrency]);

  // Find the current currency object
  const currencyObj = currencies.find(c => c.code === currentCurrency) || currencies[0];

  const getCityBackground = () => {
    switch(currencyObj.code) {
      case 'USD':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-700"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-16 h-64 bg-gray-200 rounded-t-lg border border-gray-300"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 translate-y-8 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute left-1/4 bottom-1/3 w-20 h-40 bg-white rounded-t-lg"></div>
            <div className="absolute right-1/4 bottom-1/3 w-20 h-40 bg-white rounded-t-lg"></div>
          </div>
        );
      case 'EUR':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-500"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-24 h-48 bg-blue-200 rounded-t-lg"></div>
            <div className="absolute left-1/3 bottom-1/3 w-16 h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute right-1/3 bottom-1/3 w-16 h-32 bg-gray-300 rounded-t-lg"></div>
          </div>
        );
      case 'GBP':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-600"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-12 h-56 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300"></div>
            <div className="absolute left-1/4 bottom-1/3 w-16 h-40 bg-gray-400 rounded-t-lg"></div>
            <div className="absolute right-1/4 bottom-1/3 w-16 h-40 bg-gray-400 rounded-t-lg"></div>
            <div className="absolute left-10 bottom-1/3 w-10 h-32 bg-red-500 rounded-t-lg"></div>
          </div>
        );
      case 'JPY':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-700"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-20 h-48 bg-red-200 rounded-t-lg"></div>
            <div className="absolute left-1/4 bottom-1/3 w-12 h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute right-1/4 bottom-1/3 w-12 h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute left-10 top-10 w-12 h-12 rounded-full bg-red-500"></div>
          </div>
        );
      case 'CNY':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-700"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-32 h-48 bg-red-500 rounded-t-lg"></div>
            <div className="absolute left-1/3 bottom-1/3 w-12 h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute right-1/3 bottom-1/3 w-12 h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="absolute left-1/4 bottom-1/3 w-8 h-24 bg-yellow-500 rounded-t-lg"></div>
            <div className="absolute right-1/4 bottom-1/3 w-8 h-24 bg-yellow-500 rounded-t-lg"></div>
          </div>
        );
      case 'INR':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-500"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-24 h-48 bg-orange-100 rounded-t-lg"></div>
            <div className="absolute left-1/3 bottom-1/3 w-16 h-32 bg-white rounded-t-lg"></div>
            <div className="absolute right-1/3 bottom-1/3 w-16 h-32 bg-white rounded-t-lg"></div>
            <div className="absolute left-1/2 top-10 transform -translate-x-1/2 w-16 h-16 bg-blue-500 rounded-full"></div>
          </div>
        );
      case 'AUD':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute bottom-0 w-full h-1/3 bg-gray-600"></div>
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 w-32 h-40 bg-white rounded-t-lg"></div>
            <div className="absolute left-1/4 bottom-1/3 w-16 h-32 bg-gray-200 rounded-t-lg"></div>
            <div className="absolute right-1/4 bottom-1/3 w-16 h-32 bg-gray-200 rounded-t-lg"></div>
            <div className="absolute right-10 top-10 w-12 h-8 bg-blue-500"></div>
            <div className="absolute right-14 top-10 w-4 h-8 bg-white"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      id="game-container"
      className="relative w-full h-96 rounded-lg overflow-hidden cursor-none"
      style={{ backgroundColor: currencyObj.bgColor }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* City Background */}
      {getCityBackground()}
      
      <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full shadow-md z-10">
        Score: {score}
      </div>
      
      <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-md flex items-center z-10">
        <div className="mr-2">{currencyObj.capital}</div>
        <div>{currentTime}</div>
      </div>
      
      {/* Currency Bill */}
      <div 
        className="absolute flex flex-col items-center justify-center rounded-md shadow-lg transition-all duration-300 z-20"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '60px',
          backgroundColor: currencyObj.color,
          opacity: isHitting ? 0.7 : 1,
          scale: isHitting ? '0.8' : '1'
        }}
      >
        <div className="bg-white/20 rounded w-full text-center mb-1">
          <span className="text-white text-xs font-bold">{currencyObj.code}</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {currencyObj.symbol}
          </span>
          <span className="text-white text-xl font-bold ml-1">
            {currentDenomination}
          </span>
        </div>
      </div>
      
      {/* Peppa Pig Style Cursor */}
      <div 
        className="absolute pointer-events-none transition-all duration-100 z-30"
        style={{
          left: `${pigPosition.x}%`,
          top: `${pigPosition.y}%`,
          transform: `translate(-50%, -50%) ${isHitting ? 'scale(1.1) rotate(5deg)' : ''}`,
        }}
      >
        {/* Peppa Pig Style Character */}
        <div className="relative" style={{ width: '50px', height: '60px' }}>
          {/* Head (larger oval in Peppa style) */}
          <div className="absolute bg-pink-300 rounded-full w-16 h-14" 
               style={{ top: '-10px', left: '-8px' }}></div>
          
          {/* Snout */}
          <div className="absolute bg-pink-300 rounded-full w-10 h-8" 
               style={{ top: '0px', left: '2px' }}></div>
          
          {/* Nostrils */}
          <div className="absolute bg-pink-900 rounded-full w-1 h-1" 
               style={{ top: '4px', left: '10px' }}></div>
          <div className="absolute bg-pink-900 rounded-full w-1 h-1" 
               style={{ top: '4px', left: '7px' }}></div>
          
          {/* Ears (triangular in Peppa style) */}
          <div className="absolute bg-pink-300 w-5 h-8" 
               style={{ 
                 top: '-18px', 
                 left: '-5px',
                 borderRadius: '50% 50% 0 0'
               }}></div>
          <div className="absolute bg-pink-300 w-5 h-8" 
               style={{ 
                 top: '-18px', 
                 left: '5px',
                 borderRadius: '50% 50% 0 0'
               }}></div>
          
          {/* Eyes (circles with black pupils) */}
          <div className="absolute bg-white rounded-full w-5 h-5" 
               style={{ top: '-5px', left: '-5px' }}></div>
          <div className="absolute bg-white rounded-full w-5 h-5" 
               style={{ top: '-5px', left: '4px' }}></div>
          
          {/* Pupils */}
          <div className="absolute bg-black rounded-full w-2 h-2" 
               style={{ top: '-3px', left: '-3px' }}></div>
          <div className="absolute bg-black rounded-full w-2 h-2" 
               style={{ top: '-3px', left: '6px' }}></div>
          
          {/* Smile (simple curved line) */}
          <div className="absolute bg-pink-900 h-1 w-6 rounded-full" 
               style={{ 
                 top: '7px', 
                 left: '3px',
                 transform: 'rotate(10deg)'
               }}></div>
          
          {/* Body (small oval beneath head) */}
          <div className="absolute bg-pink-300 rounded-full w-12 h-10" 
               style={{ top: '12px', left: '-2px' }}></div>
          
          {/* Dress (in Peppa style) */}
          <div className="absolute bg-red-500 w-14 h-10 rounded-t-full" 
               style={{ top: '12px', left: '-4px' }}></div>
          
          {/* Arms */}
          <div className="absolute bg-pink-300 w-2 h-6 rounded-full" 
               style={{ 
                 top: '15px', 
                 left: '-6px',
                 transform: 'rotate(-20deg)'
               }}></div>
          <div className="absolute bg-pink-300 w-2 h-6 rounded-full" 
               style={{ 
                 top: '15px', 
                 left: '10px',
                 transform: 'rotate(20deg)'
               }}></div>
          
          {/* Legs */}
          <div className="absolute bg-pink-300 w-2 h-8 rounded-full" 
               style={{ top: '22px', left: '0px' }}></div>
          <div className="absolute bg-pink-300 w-2 h-8 rounded-full" 
               style={{ top: '22px', left: '6px' }}></div>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 text-center bg-white/70 py-1 z-10">
        Move your mouse to control Peppa. Click to hit the currency!
      </div>
    </div>
  );
};

export default App;
