import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThermometerSnowflake, Battery, Map, Clock, Calendar, ArrowRight, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import StatusBadge from '../components/ui/StatusBadge';
import { mockCoolers, mockDailyTemperatures, mockBatteryLevels, translations } from '../data/mockData';

const CoolerMonitoringPage: React.FC = () => {
  const { user } = useUser();
  const currentLanguage = user?.language || 'en';
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  
  const [selectedCooler, setSelectedCooler] = useState(mockCoolers[0]);
  const [activeTab, setActiveTab] = useState<'temperature' | 'battery' | 'location'>('temperature');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTemperatureColor = (temp: number): string => {
    if (temp < 0) return 'text-blue-600';
    if (temp <= 2) return 'text-green-600';
    if (temp <= 4) return 'text-green-500';
    if (temp <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getBatteryColor = (level: number): string => {
    if (level >= 80) return 'text-green-600';
    if (level >= 50) return 'text-yellow-500';
    if (level >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.coolers}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {mockCoolers.map(cooler => (
            <div 
              key={cooler.id}
              className={`card p-4 mb-4 cursor-pointer transition-all hover:shadow-md ${selectedCooler.id === cooler.id ? 'border-primary-500 dark:border-primary-400' : ''}`}
              onClick={() => setSelectedCooler(cooler)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{cooler.model}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SN: {cooler.serialNumber}</p>
                </div>
                <StatusBadge status={cooler.status} />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <ThermometerSnowflake className={`h-5 w-5 mr-2 ${getTemperatureColor(cooler.temperature)}`} />
                  <span>{cooler.temperature}°C</span>
                </div>
                <div className="flex items-center">
                  <Battery className={`h-5 w-5 mr-2 ${getBatteryColor(cooler.batteryLevel)}`} />
                  <span>{cooler.batteryLevel}%</span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated: {formatDate(cooler.lastUpdated)}</span>
              </div>
            </div>
          ))}
          
          <div className="card p-4 mt-6">
            <h3 className="font-medium mb-3">Cooler Specifications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Model:</span>
                <span>{selectedCooler.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
                <span>{selectedCooler.capacityLiters} liters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Solar Panel:</span>
                <span>{selectedCooler.solarPanelWatts}W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Battery:</span>
                <span>{selectedCooler.batteryCapacityAh}Ah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Purchase Date:</span>
                <span>{formatDate(selectedCooler.purchaseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Warranty Until:</span>
                <span>{formatDate(selectedCooler.warrantyEnd)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('temperature')}
                  className={`py-4 px-6 flex items-center text-sm font-medium focus:outline-none ${
                    activeTab === 'temperature'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <ThermometerSnowflake className="h-5 w-5 mr-2" />
                  {t.temperature}
                </button>
                <button
                  onClick={() => setActiveTab('battery')}
                  className={`py-4 px-6 flex items-center text-sm font-medium focus:outline-none ${
                    activeTab === 'battery'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Battery className="h-5 w-5 mr-2" />
                  {t.battery}
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`py-4 px-6 flex items-center text-sm font-medium focus:outline-none ${
                    activeTab === 'location'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Map className="h-5 w-5 mr-2" />
                  Location
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'temperature' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">Temperature History (24 hours)</h3>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedCooler.temperature <= 4 && selectedCooler.temperature >= 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        Current: {selectedCooler.temperature}°C
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-64 relative">
                    {/* Temperature Chart Visualization */}
                    <div className="absolute inset-0 flex items-end">
                      {mockDailyTemperatures.map((reading, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full mx-0.5 rounded-t ${
                              reading.temperature <= 4 && reading.temperature >= 0
                                ? 'bg-green-500'
                                : reading.temperature < 0
                                  ? 'bg-blue-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ height: `${(reading.temperature / 8) * 100}%` }}
                          ></div>
                          <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {reading.time}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Temperature Guide Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-dashed border-gray-300 dark:border-gray-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-gray-500 dark:text-gray-400">8°C</span>
                      </div>
                      <div className="border-b border-dashed border-gray-300 dark:border-gray-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-gray-500 dark:text-gray-400">6°C</span>
                      </div>
                      <div className="border-b border-dashed border-red-300 dark:border-red-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-red-500">4°C</span>
                      </div>
                      <div className="border-b border-dashed border-green-300 dark:border-green-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-green-500">2°C</span>
                      </div>
                      <div className="border-b border-dashed border-green-300 dark:border-green-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-green-500">0°C</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Temperature Insights</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Your cooler temperature has remained within the optimal range (0-4°C) for the past 24 hours,
                      ensuring maximum freshness of your fish. The slight temperature fluctuation during midday is normal
                      due to higher ambient temperatures.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'battery' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">Battery Level History (24 hours)</h3>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedCooler.batteryLevel >= 50
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : selectedCooler.batteryLevel >= 20
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        Current: {selectedCooler.batteryLevel}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-64 relative">
                    {/* Battery Chart Visualization */}
                    <div className="absolute inset-0 flex items-end">
                      {mockBatteryLevels.map((reading, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full mx-0.5 rounded-t ${
                              reading.level >= 80 
                                ? 'bg-green-500' 
                                : reading.level >= 50 
                                  ? 'bg-green-400' 
                                  : reading.level >= 20 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                            }`}
                            style={{ height: `${reading.level}%` }}
                          ></div>
                          <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {reading.time}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Battery Guide Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-dashed border-gray-300 dark:border-gray-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-gray-500 dark:text-gray-400">100%</span>
                      </div>
                      <div className="border-b border-dashed border-green-300 dark:border-green-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-green-500">80%</span>
                      </div>
                      <div className="border-b border-dashed border-yellow-300 dark:border-yellow-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-yellow-500">50%</span>
                      </div>
                      <div className="border-b border-dashed border-red-300 dark:border-red-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-red-500">20%</span>
                      </div>
                      <div className="border-b border-dashed border-gray-300 dark:border-gray-700 h-0 relative">
                        <span className="absolute -top-2 right-0 text-xs text-gray-500 dark:text-gray-400">0%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Battery Insights</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Your cooler's battery is maintaining a healthy charge cycle, with solar charging during daylight hours
                      and gradual discharge at night. The current charge of {selectedCooler.batteryLevel}% is sufficient for
                      approximately 30 hours of cooling without additional solar input.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'location' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">Cooler Location</h3>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Last Updated: {formatDate(selectedCooler.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md relative overflow-hidden">
                    {/* Map Placeholder - In real app would use actual map component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Map showing cooler location at coordinates:
                        </p>
                        <p className="font-medium">
                          {selectedCooler.location.latitude}, {selectedCooler.location.longitude}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          (Dunga Beach, Kisumu)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Location History</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Your cooler has been at the current location for the past 8 hours. The built-in GPS tracking
                      helps prevent theft and unauthorize movement of your cooling asset.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <Link 
              to="/app/impact" 
              className="flex items-center text-primary-600 text-sm font-medium"
            >
              View impact metrics <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            
            <button className="btn-outline flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Cooler Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoolerMonitoringPage;