import React, { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useFarmer } from './context/FarmerContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Screens
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import PhoneLoginScreen from './screens/PhoneLoginScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import NameEntryScreen from './screens/NameEntryScreen';
import FarmerTypeScreen from './screens/FarmerTypeScreen';
import LandownerDetailsScreen from './screens/LandownerDetailsScreen';
import LandownerDetectiveScreen from './screens/LandownerDetectiveScreen';
import LandlessDetailsScreen from './screens/LandlessDetailsScreen';
import LandlessDetectiveScreen from './screens/LandlessDetectiveScreen';
import ResultsScreen from './screens/ResultsScreen';
import SavedSchemesScreen from './screens/SavedSchemesScreen';
import ProfileSummaryScreen from './screens/ProfileSummaryScreen';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App Screen Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-4 max-w-md mx-auto mt-12 bg-white rounded-3xl shadow-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-700">Something went wrong</h2>
          <p className="text-sm text-gray-600">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-800 transition"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('langSelect');
  const { farmerType, setFarmerType, resetAll } = useFarmer();
  const { t } = useLanguage();

  const handleBack = () => {
    switch (currentScreen) {
      case 'phoneLogin':
        setCurrentScreen('langSelect');
        break;
      case 'otp':
        setCurrentScreen('phoneLogin');
        break;
      case 'nameEntry':
        setCurrentScreen('otp');
        break;
      case 'farmerType':
        setCurrentScreen('nameEntry');
        break;
      case 'landownerDetails':
        setCurrentScreen('farmerType');
        break;
      case 'landownerDetective':
        setCurrentScreen('landownerDetails');
        break;
      case 'landlessDetails':
        setCurrentScreen('farmerType');
        break;
      case 'landlessDetective':
        setCurrentScreen('landlessDetails');
        break;
      case 'results':
        if (farmerType === 'landowner') {
          setCurrentScreen('landownerDetective');
        } else {
          setCurrentScreen('landlessDetective');
        }
        break;
      case 'saved':
        setCurrentScreen('results');
        break;
      case 'profile':
        setCurrentScreen('results');
        break;
      default:
        setCurrentScreen('langSelect');
    }
  };

  const handleEditAnswers = () => {
    if (farmerType === 'landowner') {
      setCurrentScreen('landownerDetails');
    } else {
      setCurrentScreen('landlessDetails');
    }
  };

  const handleReset = () => {
    resetAll();
    setCurrentScreen('langSelect');
  };

  // Conditionals for Header and BottomNav
  const showHeader = currentScreen !== 'langSelect';
  const showBackInHeader = [
    'phoneLogin',
    'otp',
    'nameEntry',
    'farmerType',
    'landownerDetails',
    'landownerDetective',
    'landlessDetails',
    'landlessDetective',
    'results',
    'saved',
    'profile'
  ].includes(currentScreen);

  const showBottomNav = [
    'farmerType',
    'landownerDetails',
    'landownerDetective',
    'landlessDetails',
    'landlessDetective',
    'results',
    'saved',
    'profile'
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-gray-900 flex flex-col font-sans selection:bg-green-200">
      {showHeader && (
        <Header
          currentScreen={currentScreen}
          showBack={showBackInHeader}
          onNavigateBack={handleBack}
        />
      )}

      <ErrorBoundary>
        <main className="flex-1 w-full max-w-md mx-auto relative">
          {currentScreen === 'langSelect' && (
            <LanguageSelectScreen onNext={() => setCurrentScreen('phoneLogin')} />
          )}

          {currentScreen === 'phoneLogin' && (
            <PhoneLoginScreen onNext={() => setCurrentScreen('otp')} />
          )}

          {currentScreen === 'otp' && (
            <OtpVerificationScreen
              onNext={() => setCurrentScreen('nameEntry')}
              onBack={() => setCurrentScreen('phoneLogin')}
            />
          )}

          {currentScreen === 'nameEntry' && (
            <NameEntryScreen onNext={() => setCurrentScreen('farmerType')} />
          )}

          {currentScreen === 'farmerType' && (
            <FarmerTypeScreen
              onSelectType={(type) => {
                if (type === 'landowner') {
                  setCurrentScreen('landownerDetails');
                } else {
                  setCurrentScreen('landlessDetails');
                }
              }}
            />
          )}

          {currentScreen === 'landownerDetails' && (
            <LandownerDetailsScreen
              onNext={() => setCurrentScreen('landownerDetective')}
              onBack={() => setCurrentScreen('farmerType')}
            />
          )}

          {currentScreen === 'landownerDetective' && (
            <LandownerDetectiveScreen
              onNext={() => setCurrentScreen('results')}
              onBack={() => setCurrentScreen('landownerDetails')}
            />
          )}

          {currentScreen === 'landlessDetails' && (
            <LandlessDetailsScreen
              onNext={() => setCurrentScreen('landlessDetective')}
              onBack={() => setCurrentScreen('farmerType')}
            />
          )}

          {currentScreen === 'landlessDetective' && (
            <LandlessDetectiveScreen
              onNext={() => setCurrentScreen('results')}
              onBack={() => setCurrentScreen('landlessDetails')}
            />
          )}

          {currentScreen === 'results' && (
            <ResultsScreen
              onNavigateProfile={() => setCurrentScreen('profile')}
              onEditAnswers={handleEditAnswers}
            />
          )}

          {currentScreen === 'saved' && (
            <SavedSchemesScreen
              onNavigateResults={() => setCurrentScreen('results')}
              onNavigateProfile={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileSummaryScreen
              onEditAnswers={handleEditAnswers}
              onReset={handleReset}
            />
          )}
        </main>
      </ErrorBoundary>

      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}
    </div>
  );
}
