import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const FarmerContext = createContext(null);

export function FarmerProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    phone: '',
    otpVerified: false,
    name: ''
  });

  const [farmerType, setFarmerType] = useState(null); // 'landowner' | 'landless'
  const [serverMatchedSchemes, setServerMatchedSchemes] = useState([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const [landownerDetails, setLandownerDetails] = useState({
    name: '',
    age: '42',
    state: 'Maharashtra',
    district: 'Pune',
    landSize: '3.5',
    crops: ['Soybean', 'Cotton'],
    incomeRange: 'income2',
    category: 'OBC'
  });

  const [landownerDetective, setLandownerDetective] = useState({
    kcc: 'no',
    aadhaar: 'yes',
    landPapers: 'yes',
    loan: 'no',
    pmKisan: 'yes',
    insurance: 'no'
  });

  const [landlessDetails, setLandlessDetails] = useState({
    name: '',
    age: '35',
    state: 'Maharashtra',
    district: 'Amravati',
    workType: 'workFarmLabor',
    incomeRange: 'income1',
    category: 'SC'
  });

  const [landlessDetective, setLandlessDetective] = useState({
    eshram: 'no',
    mgnrega: 'yes',
    aadhaar: 'yes',
    sharecropper: 'no',
    ownBank: 'yes'
  });

  const [bookmarkedSchemes, setBookmarkedSchemes] = useState(['pm-kisan', 'pmfby']);

  // Sync user name to forms when user sets name
  useEffect(() => {
    if (user.name) {
      setLandownerDetails(prev => ({ ...prev, name: user.name }));
      setLandlessDetails(prev => ({ ...prev, name: user.name }));
    }
  }, [user.name]);

  const toggleBookmark = (schemeId) => {
    setBookmarkedSchemes(prev => {
      if (prev.includes(schemeId)) {
        return prev.filter(id => id !== schemeId);
      } else {
        return [...prev, schemeId];
      }
    });
  };

  const isBookmarked = (schemeId) => bookmarkedSchemes.includes(schemeId);

  // Load returning user profile from backend
  const loadUserProfile = async (userId) => {
    if (!userId) return null;
    try {
      const res = await api.getUserProfile(userId);
      if (res && res.success) {
        if (res.user) {
          setUser(prev => ({
            ...prev,
            id: res.user.id,
            name: res.user.name || prev.name,
            phone: res.user.phone_number || prev.phone,
            otpVerified: true
          }));
          if (res.user.farmer_type) {
            setFarmerType(res.user.farmer_type);
          }
        }
        if (res.matchedSchemes && res.matchedSchemes.length > 0) {
          setServerMatchedSchemes(res.matchedSchemes);
        }
        if (res.answers) {
          if (res.user?.farmer_type === 'landowner' || !res.user?.farmer_type) {
            setLandownerDetails(prev => ({ ...prev, ...res.answers }));
            setLandownerDetective(prev => ({ ...prev, ...res.answers }));
          } else {
            setLandlessDetails(prev => ({ ...prev, ...res.answers }));
            setLandlessDetective(prev => ({ ...prev, ...res.answers }));
          }
        }
        return res;
      }
    } catch (err) {
      console.warn('Error loading user profile:', err);
    }
    return null;
  };

  // Reset only current in-progress form session, NOT the saved user profile
  const resetAll = () => {
    setFarmerType(null);
    setServerMatchedSchemes([]);
    // Do not clear user.id or user.name from database
  };

  return (
    <FarmerContext.Provider
      value={{
        user,
        setUser,
        farmerType,
        setFarmerType,
        landownerDetails,
        setLandownerDetails,
        landownerDetective,
        setLandownerDetective,
        landlessDetails,
        setLandlessDetails,
        landlessDetective,
        setLandlessDetective,
        bookmarkedSchemes,
        toggleBookmark,
        isBookmarked,
        resetAll,
        serverMatchedSchemes,
        setServerMatchedSchemes,
        isMatchingLoading,
        setIsMatchingLoading,
        loadUserProfile
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const ctx = useContext(FarmerContext);
  if (!ctx) {
    throw new Error('useFarmer must be used within FarmerProvider');
  }
  return ctx;
}
