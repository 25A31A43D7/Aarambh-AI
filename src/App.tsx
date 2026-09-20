import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  GPSLocation,
  BusinessIdea,
  CapitalState,
  SavedPlan,
  Language,
} from './types';
import { BUSINESS_KB } from './data/knowledge';
import { calculateLoanWithMoratorium, calculateBankReadiness } from './utils/calculator';
import { getReverseGeocode, requestLiveLocation } from './utils/location';
import { speakText } from './utils/voice';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AuthView } from './components/AuthView';
import { SourceModal } from './components/SourceModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProfileView } from './components/views/ProfileView';
import { ModeAView } from './components/views/ModeAView';
import { ModeBView } from './components/views/ModeBView';
import { CapitalView } from './components/views/CapitalView';
import { LocalDataView } from './components/views/LocalDataView';
import { AdvisorView } from './components/views/AdvisorView';
import { CalcView } from './components/views/CalcView';
import { SimulatorView } from './components/views/SimulatorView';
import { SchemesView } from './components/views/SchemesView';
import { ReportsView } from './components/views/ReportsView';
import { SourcesView } from './components/views/SourcesView';

export const App: React.FC = () => {
  // Session State — Login page opens first
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [modalSourceId, setModalSourceId] = useState<string | null>(null);

  // Localization Language State
  const [lang, setLang] = useState<Language>('en');

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Ramesh Kumar',
    phone: '9848012345',
    gender: 'female', // Female for higher PMEGP 35% & Stand-Up India eligibility
    age: 32,
    category: 'special', // SC / ST / OBC / Women (35% Rural Subsidy, 5% margin)
    education: '10th',
    landAcres: 0.5,
    hasShed: true,
    creditBand: 'good',
    existingDebt: 0,
    hasJanDhan: true,
  });

  // Capital State
  const [capital, setCapital] = useState<CapitalState>({
    ownSavings: 65000,
    softLoans: 25000,
    targetCapex: 220000,
    landValue: 150000,
    maxEmi: 8000,
  });

  // Location State
  const [location, setLocation] = useState<GPSLocation>({
    lat: 17.9784,
    lng: 79.5941,
    village: 'Geesukonda Village',
    district: 'Warangal',
    state: 'Telangana',
    classification: 'rural',
  });
  const [isTracking, setIsTracking] = useState<boolean>(true);

  // Active Business Idea
  const [activeIdea, setActiveIdea] = useState<BusinessIdea>(BUSINESS_KB[0]);

  // Saved Plans
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([
    {
      id: 'plan_seed_1',
      ideaId: BUSINESS_KB[0].id,
      title: 'Mustard & Groundnut Cold-Press Oil Mill',
      capex: 220000,
      subsidy: 77000,
      emi: 3506,
      date: '12 Sep 2026',
      readiness: 94,
    },
  ]);

  // Derived Calculations
  const isSpecial = user.category === 'special' || user.gender === 'female';
  const isRural = location.classification === 'rural';

  const loanCalc = calculateLoanWithMoratorium(
    activeIdea.fixedCapex,
    isSpecial,
    isRural,
    9.5, // 9.5% p.a.
    60, // 60 months
    6, // 6 months grace period
    false
  );

  const readinessScore = calculateBankReadiness(user, capital);

  // Geolocation detector with browser permissions
  const handleDetectLocation = async () => {
    setIsTracking(true);
    const live = await requestLiveLocation();
    if (live) {
      setLocation(live);
    }
    setIsTracking(false);
  };

  // Attempt non-blocking location detection on mount
  useEffect(() => {
    handleDetectLocation();
  }, []);

  const handleReadAloudCurrent = () => {
    let summaryText = `You are on the ${currentView} section of Aarambh AI. Active proposal is ${activeIdea.name.en}. Total project cost is rupees ${loanCalc.capex}. Government subsidy entitlement is rupees ${loanCalc.subsidyAmount}. Net bank loan is rupees ${loanCalc.netLoan}.`;
    if (currentView === 'dashboard') {
      summaryText = `Welcome ${user.name} to Aarambh AI. Your village is ${location.village}, ${location.district}. Your bank readiness score is ${readinessScore} percent. You are pre-qualified for thirty-five percent PMEGP rural subsidy.`;
    }
    speakText(summaryText, lang);
  };

  if (!isLoggedIn) {
    return (
      <AuthView
        lang={lang}
        onSelectLang={setLang}
        location={location}
        onLoginSuccess={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#231F18] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        lang={lang}
        onSelectLang={setLang}
        user={user}
        location={location}
        readinessScore={readinessScore}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentView={currentView}
          lang={lang}
          location={location}
          isTracking={isTracking}
          onToggleTracking={() => {
            setIsTracking(!isTracking);
            if (!isTracking) handleDetectLocation();
          }}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onReadAloud={handleReadAloudCurrent}
        />

        <main className="flex-1 pb-16">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              location={location}
              readinessScore={readinessScore}
              activeIdea={activeIdea}
              loanCalc={loanCalc}
              savedPlans={savedPlans}
              reportsCount={savedPlans.length}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              user={user}
              capital={capital}
              lang={lang}
              onUpdateUser={setUser}
            />
          )}

          {currentView === 'modeA' && (
            <ModeAView
              lang={lang}
              location={location}
              selectedIdea={activeIdea}
              onSelectIdea={setActiveIdea}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'modeB' && (
            <ModeBView
              user={user}
              location={location}
              lang={lang}
              onSetCustomIdea={(idea) => {
                setActiveIdea(idea);
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'capital' && (
            <CapitalView
              capital={capital}
              user={user}
              lang={lang}
              onUpdateCapital={setCapital}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'local' && (
            <LocalDataView
              location={location}
              lang={lang}
              onRefreshLocation={handleDetectLocation}
              onOpenSourceModal={(id) => setModalSourceId(id)}
            />
          )}

          {currentView === 'advisor' && (
            <AdvisorView
              lang={lang}
              user={user}
              location={location}
              onOpenSourceModal={(id) => setModalSourceId(id)}
            />
          )}

          {currentView === 'calc' && (
            <CalcView
              user={user}
              location={location}
              activeIdea={activeIdea}
              lang={lang}
            />
          )}

          {currentView === 'sim' && (
            <SimulatorView
              activeIdea={activeIdea}
              loanCalc={loanCalc}
              lang={lang}
            />
          )}

          {currentView === 'schemes' && (
            <SchemesView
              user={user}
              location={location}
              activeIdea={activeIdea}
              lang={lang}
              onOpenSourceModal={(id) => setModalSourceId(id)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              user={user}
              location={location}
              activeIdea={activeIdea}
              loanCalc={loanCalc}
              lang={lang}
              onSavePlan={(plan) => setSavedPlans((prev) => [plan, ...prev])}
            />
          )}

          {currentView === 'sources' && (
            <SourcesView
              lang={lang}
              onOpenSourceModal={(id) => setModalSourceId(id)}
            />
          )}
        </main>
      </div>

      {/* Global Regulatory Source Inspector Modal */}
      <SourceModal
        sourceId={modalSourceId}
        onClose={() => setModalSourceId(null)}
      />
    </div>
  );
};

export default App;
