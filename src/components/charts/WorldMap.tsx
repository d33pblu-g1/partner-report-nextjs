/**
 * World Map Component
 * Interactive world map using react-simple-maps that highlights countries with client data
 */

'use client';

import { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

interface CountryData {
  country: string;
  count: number;
  percentage: number;
}

interface WorldMapProps {
  countryData: CountryData[];
  isLoading?: boolean;
}

// Country code mapping (country name to ISO Alpha-3 for react-simple-maps)
const COUNTRY_CODE_MAP: Record<string, string> = {
  // North America
  'United States': 'USA',
  'USA': 'USA',
  'US': 'USA',
  'Canada': 'CAN',
  'Mexico': 'MEX',
  
  // Central America & Caribbean
  'Guatemala': 'GTM',
  'Honduras': 'HND',
  'El Salvador': 'SLV',
  'Nicaragua': 'NIC',
  'Costa Rica': 'CRI',
  'Panama': 'PAN',
  'Cuba': 'CUB',
  'Jamaica': 'JAM',
  'Dominican Republic': 'DOM',
  'Haiti': 'HTI',
  'Trinidad and Tobago': 'TTO',
  
  // South America
  'Brazil': 'BRA',
  'Argentina': 'ARG',
  'Chile': 'CHL',
  'Colombia': 'COL',
  'Peru': 'PER',
  'Venezuela': 'VEN',
  'Ecuador': 'ECU',
  'Bolivia': 'BOL',
  'Paraguay': 'PRY',
  'Uruguay': 'URY',
  'Guyana': 'GUY',
  'Suriname': 'SUR',
  
  // Western Europe
  'United Kingdom': 'GBR',
  'UK': 'GBR',
  'Great Britain': 'GBR',
  'England': 'GBR',
  'Germany': 'DEU',
  'France': 'FRA',
  'Spain': 'ESP',
  'Italy': 'ITA',
  'Netherlands': 'NLD',
  'Belgium': 'BEL',
  'Switzerland': 'CHE',
  'Austria': 'AUT',
  'Portugal': 'PRT',
  'Ireland': 'IRL',
  'Luxembourg': 'LUX',
  'Monaco': 'MCO',
  
  // Northern Europe
  'Sweden': 'SWE',
  'Norway': 'NOR',
  'Denmark': 'DNK',
  'Finland': 'FIN',
  'Iceland': 'ISL',
  
  // Eastern Europe
  'Poland': 'POL',
  'Czech Republic': 'CZE',
  'Czechia': 'CZE',
  'Hungary': 'HUN',
  'Romania': 'ROU',
  'Bulgaria': 'BGR',
  'Croatia': 'HRV',
  'Slovakia': 'SVK',
  'Slovenia': 'SVN',
  'Serbia': 'SRB',
  'Bosnia and Herzegovina': 'BIH',
  'Montenegro': 'MNE',
  'North Macedonia': 'MKD',
  'Albania': 'ALB',
  'Kosovo': 'XKX',
  'Estonia': 'EST',
  'Latvia': 'LVA',
  'Lithuania': 'LTU',
  'Belarus': 'BLR',
  'Ukraine': 'UKR',
  'Moldova': 'MDA',
  
  // Southern Europe
  'Greece': 'GRC',
  'Cyprus': 'CYP',
  'Malta': 'MLT',
  
  // Russia & Central Asia
  'Russia': 'RUS',
  'Russian Federation': 'RUS',
  'Kazakhstan': 'KAZ',
  'Uzbekistan': 'UZB',
  'Turkmenistan': 'TKM',
  'Kyrgyzstan': 'KGZ',
  'Tajikistan': 'TJK',
  
  // Middle East
  'Turkey': 'TUR',
  'Saudi Arabia': 'SAU',
  'UAE': 'ARE',
  'United Arab Emirates': 'ARE',
  'Israel': 'ISR',
  'Iran': 'IRN',
  'Iraq': 'IRQ',
  'Kuwait': 'KWT',
  'Qatar': 'QAT',
  'Bahrain': 'BHR',
  'Oman': 'OMN',
  'Jordan': 'JOR',
  'Lebanon': 'LBN',
  'Syria': 'SYR',
  'Yemen': 'YEM',
  'Palestine': 'PSE',
  'Georgia': 'GEO',
  'Armenia': 'ARM',
  'Azerbaijan': 'AZE',
  
  // East Asia
  'China': 'CHN',
  'Japan': 'JPN',
  'South Korea': 'KOR',
  'Korea': 'KOR',
  'North Korea': 'PRK',
  'Mongolia': 'MNG',
  'Taiwan': 'TWN',
  'Hong Kong': 'HKG',
  'Macau': 'MAC',
  
  // Southeast Asia
  'Indonesia': 'IDN',
  'Thailand': 'THA',
  'Malaysia': 'MYS',
  'Singapore': 'SGP',
  'Philippines': 'PHL',
  'Vietnam': 'VNM',
  'Myanmar': 'MMR',
  'Burma': 'MMR',
  'Cambodia': 'KHM',
  'Laos': 'LAO',
  'Brunei': 'BRN',
  'Timor-Leste': 'TLS',
  'East Timor': 'TLS',
  
  // South Asia
  'India': 'IND',
  'Pakistan': 'PAK',
  'Bangladesh': 'BGD',
  'Sri Lanka': 'LKA',
  'Nepal': 'NPL',
  'Bhutan': 'BTN',
  'Afghanistan': 'AFG',
  'Maldives': 'MDV',
  
  // Oceania
  'Australia': 'AUS',
  'New Zealand': 'NZL',
  'Papua New Guinea': 'PNG',
  'Fiji': 'FJI',
  'Solomon Islands': 'SLB',
  'Vanuatu': 'VUT',
  'Samoa': 'WSM',
  'Tonga': 'TON',
  
  // Africa - North
  'Egypt': 'EGY',
  'Morocco': 'MAR',
  'Algeria': 'DZA',
  'Tunisia': 'TUN',
  'Libya': 'LBY',
  'Sudan': 'SDN',
  'South Sudan': 'SSD',
  
  // Africa - West
  'Nigeria': 'NGA',
  'Ghana': 'GHA',
  'Ivory Coast': 'CIV',
  "Côte d'Ivoire": 'CIV',
  'Senegal': 'SEN',
  'Mali': 'MLI',
  'Burkina Faso': 'BFA',
  'Niger': 'NER',
  'Guinea': 'GIN',
  'Benin': 'BEN',
  'Togo': 'TGO',
  'Sierra Leone': 'SLE',
  'Liberia': 'LBR',
  'Mauritania': 'MRT',
  'Gambia': 'GMB',
  'Guinea-Bissau': 'GNB',
  'Cape Verde': 'CPV',
  
  // Africa - East
  'Kenya': 'KEN',
  'Ethiopia': 'ETH',
  'Tanzania': 'TZA',
  'Uganda': 'UGA',
  'Somalia': 'SOM',
  'Rwanda': 'RWA',
  'Burundi': 'BDI',
  'Eritrea': 'ERI',
  'Djibouti': 'DJI',
  
  // Africa - Southern
  'South Africa': 'ZAF',
  'Zimbabwe': 'ZWE',
  'Mozambique': 'MOZ',
  'Zambia': 'ZMB',
  'Angola': 'AGO',
  'Namibia': 'NAM',
  'Botswana': 'BWA',
  'Malawi': 'MWI',
  'Lesotho': 'LSO',
  'Eswatini': 'SWZ',
  'Swaziland': 'SWZ',
  'Madagascar': 'MDG',
  'Mauritius': 'MUS',
  
  // Africa - Central
  'Democratic Republic of the Congo': 'COD',
  'DRC': 'COD',
  'Congo': 'COG',
  'Republic of the Congo': 'COG',
  'Cameroon': 'CMR',
  'Chad': 'TCD',
  'Central African Republic': 'CAF',
  'Gabon': 'GAB',
  'Equatorial Guinea': 'GNQ',
};

// TopoJSON URL for world map data
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function WorldMap({ countryData, isLoading }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Create a map of ISO codes to country data for quick lookup
  const countryDataMap = new Map<string, CountryData>();
  countryData.forEach(data => {
    const isoCode = COUNTRY_CODE_MAP[data.country];
    if (isoCode) {
      countryDataMap.set(isoCode, data);
    }
  });

  // Get the country with data for tooltip
  const hoveredData = hoveredCountry ? countryDataMap.get(hoveredCountry) : null;

  // Calculate max count for color scaling
  const maxCount = Math.max(...countryData.map(d => d.count), 1);

  // Get color intensity based on client count
  const getCountryColor = (isoCode: string, isDarkMode: boolean): string => {
    const data = countryDataMap.get(isoCode);
    
    if (!data) {
      // Gray for countries with no data - darker for dark mode
      return isDarkMode ? '#374151' : '#e5e7eb';
    }
    
    // Color intensity based on percentage of max
    const intensity = data.count / maxCount;
    
    if (intensity >= 0.8) return '#ef4444'; // Red (high)
    if (intensity >= 0.6) return '#f97316'; // Orange
    if (intensity >= 0.4) return '#f59e0b'; // Amber
    if (intensity >= 0.2) return '#3b82f6'; // Blue
    return '#60a5fa'; // Light blue (low)
  };

  const handleMouseMove = (e: React.MouseEvent, isoCode: string) => {
    const container = e.currentTarget.closest('.map-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHoveredCountry(isoCode);
  };

  // Detect dark mode from document class
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode on mount
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Optional: Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center" style={{ height: '500px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4">
      {/* Legend */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Global Client Distribution
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">No clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" style={{ height: '500px' }}>
        <ComposableMap
          projectionConfig={{
            scale: 147,
          }}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }: any) =>
                geographies.map((geo: any) => {
                  const isoCode = geo.id;
                  const hasData = countryDataMap.has(isoCode);
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryColor(isoCode, isDarkMode)}
                      stroke={isDarkMode ? '#1f2937' : '#ffffff'}
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                        },
                        hover: {
                          fill: hasData ? getCountryColor(isoCode, isDarkMode) : (isDarkMode ? '#4b5563' : '#d1d5db'),
                          outline: 'none',
                          opacity: 0.8,
                          cursor: hasData ? 'pointer' : 'default',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={(e: any) => {
                        if (hasData) {
                          handleMouseMove(e, isoCode);
                        }
                      }}
                      onMouseMove={(e: any) => {
                        if (hasData) {
                          handleMouseMove(e, isoCode);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {hoveredCountry && hoveredData && (
          <div
            className="absolute z-10 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${tooltipPos.x + 10}px`,
              top: `${tooltipPos.y - 40}px`,
            }}
          >
            <div className="font-semibold">{hoveredData.country}</div>
            <div className="text-sm">
              {hoveredData.count} clients ({hoveredData.percentage.toFixed(1)}%)
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {countryData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Countries
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {countryData.reduce((sum, c) => sum + c.count, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Clients
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {countryData[0]?.country || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Top Country
          </div>
        </div>
      </div>
    </div>
  );
}

