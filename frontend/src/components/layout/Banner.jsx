import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Banner = () => {
  const [topOffer, setTopOffer] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        const res = await api.get('/coupons/public');
        if (isMounted && res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setTopOffer(res.data.data[0]);
        }
      } catch (err) {
        // Silently fallback to default platform message
      }
    };
    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white text-xs md:text-sm py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse">
            {topOffer ? 'Special Offer' : 'Online CBT'}
          </span>
          <span className="font-medium truncate">
            {topOffer ? (
              <>
                🎯 {topOffer.displayLabel ? `${topOffer.displayLabel} • ` : 'All Pharmacist Test Series Live! '}
                Use code <strong className="text-yellow-300 font-bold tracking-wide">{topOffer.code}</strong> for {topOffer.discountPercent}% OFF.
              </>
            ) : (
              '🎯 RRB, ESIC, OSSSC, GSSSB, AIIMS & UPSSSC Pharmacist Mock Test Series & Study Notes Live!'
            )}
          </span>
        </div>
        <Link
          to="/test-series"
          className="hidden md:inline-flex items-center space-x-1 text-white hover:text-yellow-200 font-semibold transition ml-4 whitespace-nowrap"
        >
          <span>Explore Papers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
