import { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'cikguai_user';

const MODE_CONTENT = {
  Topic: {
    promptLabel: 'What topic would you like to learn?',
    placeholder: "(e.g., 'Teach me about Kata Ganti Nama')",
    chips: [
      'Kata Ganti Nama',
      'Imbuhan Awalan & Akhiran',
      'Peribahasa & Simpulan Bahasa',
      'Ayat Aktif & Ayat Pasif',
      'Kata Sendi Nama',
    ],
  },
  'Exam Prep': {
    promptLabel: 'What topic would you like to review for your exam?',
    placeholder: 'You can upload notes, a study guide, or an exam outline.',
    chips: [
      'Latihan Tatabahasa',
      'Pemahaman Petikan Umum',
      'Latihan Penjodoh Bilangan',
      'Rumusan Bahasa Melayu',
    ],
  },
  Homework: {
    promptLabel: 'What homework problem would you like to help with?',
    placeholder: 'You can copy and paste it, or upload a photo or file.',
    chips: [
      'Semak Karangan Pendek',
      'Betulkan Kesalahan Ejaan & Imbuhan',
      'Bina Ayat daripada Peribahasa',
    ],
  },
};

export default function App() {
  const [step, setStep] = useState(1); // 1: Login, 2: Name, 3: Grade, 4: Language, 5: Pricing, 6: Topic, 7: Tutor, 8: Ready
  const [error, setError] = useState('');
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('FPX');
  const [isProcessing, setIsProcessing] = useState(false);

  // Page 6 & 7 State
  const [learningMode, setLearningMode] = useState('Topic');
  const [topicInput, setTopicInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedUrl, setAttachedUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState('Marcel');
  const [speakingTutor, setSpeakingTutor] = useState(null); // 'Marcel' | 'Ruby' | null
  // Page 6 Collapsible History Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentBoards, setRecentBoards] = useState([
    'Mastering Malay Affixes: Imbuhan',
    'Kata Ganti Nama Diri & Tunjuk',
  ]);

  // Page 9 Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState(null);

  const [userData, setUserData] = useState({
    email: '',
    username: '',
    grade_level: '',
    parent_email: '',
    preferred_language: 'English',
    subscription_plan: '',
    speech_speed: 1.0,
    mic_on_default: false,
    preferred_tutor: 'Marcel',
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserData((prev) => ({ ...prev, ...parsed }));
      if (parsed.preferred_tutor) setSelectedTutor(parsed.preferred_tutor);
      if (parsed.subscription_plan) {
        setStep(6);
      } else if (parsed.onboarding_complete) {
        setStep(5);
      }
    }
  }, []);

  const updateAndSave = (updates, nextStep) => {
    const updated = { ...userData, ...updates };
    setUserData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setError('');
    if (nextStep) setStep(nextStep);
  };

  // PAGE 1
  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!userData.email.trim() || !userData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    updateAndSave({ email: userData.email.trim() }, 2);
  };

  // PAGE 2
  const handleNameNext = (e) => {
    e.preventDefault();
    if (!userData.username.trim()) {
      setError('Please enter what we should call you.');
      return;
    }
    updateAndSave({ username: userData.username.trim() }, 3);
  };

  // PAGE 3
  const handleGradeNext = (e) => {
    e.preventDefault();
    if (!userData.grade_level) {
      setError('Please select your grade level.');
      return;
    }
    updateAndSave(
      {
        grade_level: userData.grade_level,
        parent_email: userData.parent_email.trim(),
      },
      4
    );
  };

  // PAGE 4
  const handleLanguageFinish = () => {
    updateAndSave(
      {
        preferred_language: userData.preferred_language,
        onboarding_complete: true,
      },
      5
    );
  };

  // PAGE 5
  const handleSelectFreePlan = () => {
    updateAndSave({ subscription_plan: 'Free' }, 6);
  };

  const handleConfirmDummyPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const selectedName = checkoutPlan.name;
      setCheckoutPlan(null);
      updateAndSave({ subscription_plan: selectedName }, 6);
    }, 600);
  };

  // PAGE 7 Voice Preview + Talking Animation
  const handlePreviewVoice = (e, tutorName) => {
    e.stopPropagation();
    setSelectedTutor(tutorName);

    if (speakingTutor === tutorName) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeakingTutor(null);
      return;
    }

    setSpeakingTutor(tutorName);

    if (!('speechSynthesis' in window)) {
      setTimeout(() => setSpeakingTutor(null), 2800);
      return;
    }

    window.speechSynthesis.cancel();
    const isBM = userData.preferred_language === 'Bahasa Melayu';
    const text =
      tutorName === 'Marcel'
        ? isBM
          ? `Hai ${userData.username || 'kawan'}! Saya Cikgu Marcel. Jom kita belajar bersama hari ini!`
          : `Hi ${userData.username || 'there'}! I'm Marcel. Let's break this down step by step!`
        : isBM
          ? `Helo ${userData.username || 'kawan'}! Saya Cikgu Ruby! Dah sedia nak kuasai topik hari ini?`
          : `Hey ${userData.username || 'there'}! I'm Ruby! Ready to ace this topic together?`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = userData.speech_speed || 1.0;
    utterance.pitch = tutorName === 'Ruby' ? 1.2 : 0.95;
    utterance.onend = () => setSpeakingTutor(null);
    utterance.onerror = () => setSpeakingTutor(null);
    window.speechSynthesis.speak(utterance);
  };

  // PAGE 9 Settings
  const openSettings = () => {
    setSettingsDraft({ ...userData });
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateAndSave(settingsDraft);
    setIsSettingsOpen(false);
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsSettingsOpen(false);
    setTopicInput('');
    setAttachedFileName('');
    setAttachedUrl('');
    setSelectedTutor('Marcel');
    setUserData({
      email: '',
      username: '',
      grade_level: '',
      parent_email: '',
      preferred_language: 'English',
      subscription_plan: '',
      speech_speed: 1.0,
      mic_on_default: false,
      preferred_tutor: 'Marcel',
    });
    setStep(1);
  };

  // Top Navbar for Pages 6, 7 & 8
  const renderNavbar = () => (
    <header className="app-navbar">
      <div
        className="brand-logo"
        style={{ marginBottom: 0, cursor: 'pointer' }}
        onClick={() => setStep(6)}
      >
        CikguAI
      </div>
      <div className="nav-actions">
        <button
          type="button"
          className="plan-pill-badge"
          onClick={() => setStep(5)}
          title="Change subscription plan"
        >
          {userData.subscription_plan || 'Free'} Plan
        </button>
        <button type="button" className="icon-btn" onClick={openSettings}>
          Settings
        </button>
      </div>
    </header>
  );

  // Page 9 Settings Modal
  const renderSettingsModal = () => {
    if (!isSettingsOpen || !settingsDraft) return null;
    return (
      <div className="modal-backdrop">
        <form className="settings-modal" onSubmit={handleSaveSettings}>
          <div className="settings-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h2>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem' }}
              onClick={() => setIsSettingsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Name</h4>
              <p>This is how we’ll call you</p>
            </div>
            <input
              type="text"
              className="input-field settings-control"
              value={settingsDraft.username}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, username: e.target.value })}
              required
            />
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Email</h4>
              <p>Your ID</p>
            </div>
            <input
              type="email"
              className="input-field settings-control"
              value={settingsDraft.email}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })}
              required
            />
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Grade Level</h4>
              <p>Used to navigate CikguAI</p>
            </div>
            <select
              className="input-field settings-control"
              value={settingsDraft.grade_level}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, grade_level: e.target.value })}
            >
              <option value="Primary Student">Primary Student</option>
              <option value="Secondary Student">Secondary Student</option>
              <option value="Not a student">Not a student</option>
            </select>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Preferred Language</h4>
              <p>You speak this language</p>
            </div>
            <select
              className="input-field settings-control"
              value={settingsDraft.preferred_language}
              onChange={(e) =>
                setSettingsDraft({ ...settingsDraft, preferred_language: e.target.value })
              }
            >
              <option value="Bahasa Melayu">Bahasa Melayu</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Speech Speed</h4>
              <p>Tutor voice rate ({settingsDraft.speech_speed}x)</p>
            </div>
            <div
              className="settings-control"
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
            >
              <input
                type="range"
                min="0.8"
                max="1.25"
                step="0.05"
                style={{ flex: 1, accentColor: '#2563eb' }}
                value={settingsDraft.speech_speed}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    speech_speed: parseFloat(e.target.value),
                  })
                }
              />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '38px' }}>
                {settingsDraft.speech_speed}x
              </span>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <h4>Mic On by Default</h4>
              <p>Auto-listen when tutor finishes speaking</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settingsDraft.mic_on_default}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, mic_on_default: e.target.checked })
                }
              />
              <span className="slider-round"></span>
            </label>
          </div>

          <div className="settings-row" style={{ borderBottom: 'none' }}>
            <div className="settings-row-info">
              <h4>Current Plan</h4>
              <p>{settingsDraft.subscription_plan || 'Free'} Plan</p>
            </div>
            <button
              type="button"
              className="free-plan-link"
              style={{ marginBottom: 0 }}
              onClick={() => {
                setIsSettingsOpen(false);
                setStep(5);
              }}
            >
              {settingsDraft.subscription_plan === 'Free' ? 'Subscribe' : 'Change Plan'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.75rem',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={handleResetDemo}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '0.75rem 1.2rem',
                borderRadius: '999px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>

            <div className="btn-row" style={{ width: 'auto', marginTop: 0 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // ==================== PAGE 1: LOGIN ====================
  if (step === 1) {
    return (
      <div className="split-container">
        <div className="left-panel">
          <div className="auth-box">
            <div className="brand-logo">CikguAI</div>
            <h1>Be a Top Student, today!</h1>
            <p className="subtitle">
              Join top Malaysian students using CikguAI to stress less and learn faster.
            </p>

            <button
              type="button"
              className="btn-google"
              onClick={() =>
                alert('Google OAuth will be connected in Week 5! Use Email below for now.')
              }
            >
              <span>G</span> Continue with Google
            </button>

            <div className="divider">OR</div>

            <form onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="student@example.com"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter password"
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="btn-primary">
                Continue with Email
              </button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <div className="feature-card">
            <h3>📚 Learn any topic</h3>
            <p>Use your own school notes or ask CikguAI to write step-by-step on the board.</p>
          </div>
          <div className="feature-card">
            <h3>📝 Prepare for exam</h3>
            <p>Review school syllabus topics and practice with interactive clue highlights.</p>
          </div>
          <div className="feature-card">
            <h3>💡 Help with homework</h3>
            <p>Snap a worksheet photo and learn how to solve it step by step.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PAGE 2: NAME ====================
  if (step === 2) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-topbar">
          <div className="brand-logo" style={{ marginBottom: 0 }}>
            CikguAI
          </div>
        </div>

        <div className="onboarding-center">
          <div className="step-indicator">Step 1 of 3</div>
          <h2>Welcome! What should we call you?</h2>
          <p className="helper">This is the name your AI tutor will use when talking to you.</p>

          <form className="onboarding-form" onSubmit={handleNameNext}>
            <div className="form-group">
              <input
                type="text"
                className="pill-input"
                placeholder="Type here"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                autoFocus
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="btn-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==================== PAGE 3: GRADE & PARENT EMAIL ====================
  if (step === 3) {
    const grades = ['Primary Student', 'Secondary Student', 'Not a student'];
    return (
      <div className="onboarding-page">
        <div className="onboarding-topbar">
          <div className="brand-logo" style={{ marginBottom: 0 }}>
            CikguAI
          </div>
        </div>

        <div className="onboarding-center">
          <div className="step-indicator">Step 2 of 3</div>
          <h2>{userData.username}, what grade are you in?</h2>
          <p className="helper">This helps us teach you relevant to your knowledge.</p>

          <form className="onboarding-form" onSubmit={handleGradeNext}>
            <div className="option-list">
              {grades.map((grade) => (
                <button
                  type="button"
                  key={grade}
                  className={`option-pill ${userData.grade_level === grade ? 'selected' : ''}`}
                  onClick={() => setUserData({ ...userData, grade_level: grade })}
                >
                  {grade}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label style={{ textAlign: 'center' }}>
                Parent Email (Optional — for 3-day study reminders)
              </label>
              <input
                type="email"
                className="pill-input"
                placeholder="parent@example.com"
                value={userData.parent_email}
                onChange={(e) => setUserData({ ...userData, parent_email: e.target.value })}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="btn-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==================== PAGE 4: LANGUAGE ====================
  if (step === 4) {
    const languages = ['Bahasa Melayu', 'English'];
    return (
      <div className="onboarding-page">
        <div className="onboarding-topbar">
          <div className="brand-logo" style={{ marginBottom: 0 }}>
            CikguAI
          </div>
        </div>

        <div className="onboarding-center">
          <div className="step-indicator">Step 3 of 3</div>
          <h2>What language would you speak in?</h2>
          <p className="helper">Pick the language you would like to speak to the whiteboard tutor.</p>

          <div className="option-list">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang}
                className={`option-pill ${userData.preferred_language === lang ? 'selected' : ''}`}
                onClick={() => setUserData({ ...userData, preferred_language: lang })}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="btn-row">
            <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn-primary" onClick={handleLanguageFinish}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PAGE 5: PRICING & DUMMY CHECKOUT ====================
  if (step === 5) {
    return (
      <div className="pricing-page">
        <div className="pricing-top-left">
          <button type="button" className="icon-btn" onClick={() => setStep(4)}>
            ← Back
          </button>
        </div>

        <div className="pricing-center-content">
          <div className="pricing-header">
            <h1>Let’s get those grades</h1>
            <p>A personal tutor, for less than what you spend on lunch</p>
          </div>

          <div className="pricing-grid">
            <div className="price-card">
              <div className="plan-title">Weekly</div>
              <div className="plan-price">
                MYR14.90 <span>/ week</span>
              </div>
              <span className="food-badge">🍱 Lunch set</span>
              <ul className="perk-list">
                <li>☑️ Unlimited Lessons</li>
                <li>☑️ No time limits</li>
                <li>☑️ All features</li>
              </ul>
              <div className="plan-billing-bottom">MYR14.90 billed weekly</div>
              <button
                type="button"
                className="btn-pill"
                onClick={() =>
                  setCheckoutPlan({
                    name: 'Weekly',
                    price: 'MYR 14.90',
                    billing: 'Billed weekly (Dummy)',
                  })
                }
              >
                Go Weekly
              </button>
            </div>

            <div className="price-card">
              <div className="plan-title">Monthly</div>
              <div className="plan-price">
                MYR9.98 <span>/ week</span>
              </div>
              <span className="food-badge">🧋 One boba milk</span>
              <ul className="perk-list">
                <li>☑️ Unlimited Lessons</li>
                <li>☑️ No time limits</li>
                <li>☑️ All features</li>
              </ul>
              <div className="plan-billing-bottom">MYR39.90 billed monthly</div>
              <button
                type="button"
                className="btn-pill"
                onClick={() =>
                  setCheckoutPlan({
                    name: 'Monthly',
                    price: 'MYR 39.90',
                    billing: 'Billed monthly (Dummy)',
                  })
                }
              >
                Go Monthly
              </button>
            </div>

            <div className="price-card best-deal">
              <div className="deal-badge">Best Deal</div>
              <div className="plan-title">Annual</div>
              <div className="plan-price">
                MYR2.88 <span>/ week</span>
              </div>
              <span className="food-badge">🍛 One nasi lemak</span>
              <ul className="perk-list">
                <li>☑️ Unlimited Lessons</li>
                <li>☑️ No time limits</li>
                <li>☑️ All features</li>
              </ul>
              <div className="plan-billing-bottom">
                <span className="save-tag">Save 81%</span>
                MYR150 billed annually
              </div>
              <button
                type="button"
                className="btn-pill"
                onClick={() =>
                  setCheckoutPlan({
                    name: 'Annual',
                    price: 'MYR 150.00',
                    billing: 'Billed annually (Dummy)',
                  })
                }
              >
                Go Annual
              </button>
            </div>

            <div className="price-card muted-card">
              <div className="plan-title">Human Tutor</div>
              <div className="plan-price strikethrough-main">
                MYR250.00 <span>/ month</span>
              </div>
              <ul className="perk-list">
                <li>❌ Awkward small talk</li>
                <li>❌ Scheduling nightmares</li>
                <li>❌ Can’t help at 2 am</li>
                <li>❌ Cancels on you</li>
              </ul>
              <button type="button" className="btn-pill-disabled" disabled>
                Don't do this
              </button>
            </div>
          </div>

          <button type="button" className="free-plan-link" onClick={handleSelectFreePlan}>
            Continue with Free Plan
          </button>
        </div>

        {checkoutPlan && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="step-indicator">Dummy Checkout</div>
              <h2 style={{ marginBottom: '0.25rem' }}>CikguAI {checkoutPlan.name} Plan</h2>
              <p className="helper" style={{ marginBottom: '1rem', color: '#64748b' }}>
                {checkoutPlan.price} — {checkoutPlan.billing}
              </p>

              <div className="payment-tabs">
                <button
                  type="button"
                  className={`payment-tab ${paymentMethod === 'FPX' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('FPX')}
                >
                  🏦 FPX Online Banking
                </button>
                <button
                  type="button"
                  className={`payment-tab ${paymentMethod === 'Card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  💳 Credit / Debit Card
                </button>
              </div>

              <form onSubmit={handleConfirmDummyPayment}>
                {paymentMethod === 'FPX' ? (
                  <div className="form-group">
                    <label>Select Malaysian Bank (Simulated)</label>
                    <select className="input-field">
                      <option>Maybank2u (Dummy)</option>
                      <option>CIMB Clicks (Dummy)</option>
                      <option>Public Bank (Dummy)</option>
                      <option>RHB Now (Dummy)</option>
                      <option>Bank Islam (Dummy)</option>
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Dummy Card Number</label>
                    <input
                      type="text"
                      className="input-field"
                      defaultValue="4242 •••• •••• 4242"
                      readOnly
                    />
                  </div>
                )}

                <div className="btn-row" style={{ marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCheckoutPlan(null)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={isProcessing}>
                    {isProcessing ? 'Confirming...' : `Pay ${checkoutPlan.price} (Dummy)`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== PAGE 6: TOPIC SELECTION ====================
  if (step === 6) {
    const activeModeData = MODE_CONTENT[learningMode];
    const handleStartTopic = (e) => {
      e.preventDefault();
      if (!topicInput.trim() && !attachedFileName && !attachedUrl.trim()) {
        setError('Please enter a topic, paste a question, or attach study material.');
        return;
      }
      const boardTitle = topicInput.trim() || attachedFileName || attachedUrl.trim();
      if (boardTitle && !recentBoards.includes(boardTitle)) {
        setRecentBoards([boardTitle, ...recentBoards]);
      }
      setError('');
      setStep(7);
    };
    const modeIcons = {
      Topic: '📖',
      'Exam Prep': '⚡',
      Homework: '✏️',
    };

    return (
      <div className="topic-workspace-page">
        {/* Collapsible Left Sidebar Drawer */}
        {isSidebarOpen && (
          <aside className="history-sidebar">
            <div className="sidebar-top-row">
              <span className="brand-logo" style={{ fontSize: '1.35rem', marginBottom: 0 }}>
                CikguAI
              </span>
              <button
                type="button"
                className="sidebar-close-btn"
                onClick={() => setIsSidebarOpen(false)}
                title="Close menu"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className="sidebar-nav-btn"
              onClick={() => {
                setTopicInput('');
                setAttachedFileName('');
                setAttachedUrl('');
                setLearningMode('Topic');
                setIsSidebarOpen(false);
              }}
            >
              <span>📝</span> New Board
            </button>

            <button
              type="button"
              className="sidebar-nav-btn"
              onClick={() => alert(`Total saved boards: ${recentBoards.length}`)}
            >
              <span>🕒</span> All History
            </button>

            <div className="sidebar-section-label">Recent Boards</div>
            {recentBoards.map((board, idx) => (
              <button
                type="button"
                key={idx}
                className="sidebar-recent-item"
                title={board}
                onClick={() => {
                  setTopicInput(board);
                  setIsSidebarOpen(false);
                }}
              >
                {board}
              </button>
            ))}
          </aside>
        )}

        {/* Top-Left Hamburger + CikguAI & Top-Right Get your plan + Settings */}
        <header className="topic-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              title="Open boards & history"
            >
              ☰
            </button>
            <div
              className="brand-logo"
              style={{ marginBottom: 0, cursor: 'pointer' }}
              onClick={() => setStep(6)}
            >
              CikguAI
            </div>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="plan-pill-badge"
              onClick={() => setStep(5)}
            >
              Get your plan
            </button>
            <button type="button" className="icon-btn" onClick={openSettings}>
              Settings
            </button>
          </div>
        </header>

        {/* Vertically & Horizontally Centered Prompt Section */}
        <div className="topic-center-wrapper">
          <h1 className="topic-heading">
            What do you want to <strong>learn, {userData.username}?</strong>
          </h1>

          {/* 3 Separate Floating Mode Cards */}
          <div className="floating-mode-grid">
            {['Topic', 'Exam Prep', 'Homework'].map((mode) => (
              <button
                type="button"
                key={mode}
                className={`floating-mode-card ${learningMode === mode ? 'active' : ''}`}
                onClick={() => {
                  setLearningMode(mode);
                  setError('');
                }}
              >
                <span className="mode-card-icon">{modeIcons[mode]}</span>
                <span>{mode}</span>
              </button>
            ))}
          </div>

          {/* Main Compact White Prompt Card */}
          <form className="cikgu-prompt-card" onSubmit={handleStartTopic}>
            <textarea
              className="cikgu-textarea"
              placeholder={`${activeModeData.promptLabel}\n${activeModeData.placeholder}`}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
            />

            {showUrlInput && (
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  className="input-field"
                  style={{ fontSize: '0.88rem', padding: '0.6rem 0.85rem' }}
                  placeholder="Paste YouTube or article link here..."
                  value={attachedUrl}
                  onChange={(e) => setAttachedUrl(e.target.value)}
                />
              </div>
            )}

            {attachedFileName && (
              <div
                style={{
                  marginBottom: '0.65rem',
                  fontSize: '0.82rem',
                  color: '#2563eb',
                  fontWeight: 600,
                }}
              >
                Attached: {attachedFileName}{' '}
                <button
                  type="button"
                  onClick={() => setAttachedFileName('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {error && (
              <p className="error-text" style={{ marginBottom: '0.65rem', fontSize: '0.82rem' }}>
                {error}
              </p>
            )}

            <div className="cikgu-card-footer">
              <div className="box-left-actions">
                <label className="cikgu-attach-pill">
                  📄 Add file
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="cikgu-attach-pill"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  🔗 Add URL
                </button>
              </div>

              <button
                type="submit"
                className={`cikgu-start-btn ${topicInput.trim() || attachedFileName || attachedUrl.trim() ? 'ready' : ''
                  }`}
              >
                Start
              </button>
            </div>
          </form>

          {/* Quick Bahasa Melayu Suggestions */}
          <div className="subject-chips-wrap" style={{ width: '100%' }}>
            <div className="subject-chips-title">Quick Bahasa Melayu Suggestions</div>
            <div className="subject-chips">
              {activeModeData.chips.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  className="subject-chip"
                  onClick={() => {
                    setTopicInput(chip);
                    setError('');
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {renderSettingsModal()}
      </div>
    );
  }

  // ==================== PAGE 7: CHOOSE TUTOR CHARACTER ====================
  if (step === 7) {
    return (
      <div className="topic-workspace-page">
        <header className="topic-topbar">
          <div
            className="brand-logo"
            style={{ marginBottom: 0, cursor: 'pointer' }}
            onClick={() => setStep(6)}
          >
            CikguAI
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="plan-pill-badge"
              onClick={() => setStep(5)}
              title="Change subscription plan"
            >
              {userData.subscription_plan || 'Free'} Plan
            </button>
            <button type="button" className="icon-btn" onClick={openSettings}>
              Settings
            </button>
          </div>
        </header>

        <div className="topic-center-wrapper" style={{ maxWidth: '640px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Pick your favorite tutor
          </h1>
          <p style={{ color: '#64748b', marginBottom: '1.75rem' }}>
            You can change this anytime during the lesson
          </p>

          <div className="tutor-grid" style={{ marginTop: 0 }}>
            {/* MARCEL CARD */}
            <div
              className={`tutor-card ${selectedTutor === 'Marcel' ? 'selected' : ''}`}
              onClick={() => setSelectedTutor('Marcel')}
            >
              <h3>Marcel</h3>
              <p>Warm and friendly</p>
              <div className="avatar-wrapper" style={{ width: '160px', height: '155px' }}>
                <svg
                  viewBox="0 0 160 155"
                  width="160"
                  height="155"
                  className={`tutor-avatar-svg ${speakingTutor === 'Marcel' ? 'is-talking' : ''}`}
                >
                  <circle cx="80" cy="82" r="64" fill="#eff6ff" />

                  <path
                    d="M36 146 C38 118, 56 112, 80 112 C104 112, 122 118, 124 146 Z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M64 113 Q80 124 96 113"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M62 114 L54 132 L66 135 L62 146"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M98 114 L106 132 L94 135 L98 146"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />

                  <g className="tutor-head-group">
                    <rect
                      x="71"
                      y="96"
                      width="18"
                      height="18"
                      rx="6"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="49"
                      cy="73"
                      r="6.5"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="111"
                      cy="73"
                      r="6.5"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <path
                      d="M51 62 C51 44, 109 44, 109 62 L109 76 C109 94, 95 103, 80 103 C65 103, 51 94, 51 76 Z"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <path
                      d="M49 64 C47 40, 66 28, 92 31 C111 33, 116 46, 111 63 C106 52, 92 50, 76 52 C62 54, 54 57, 49 64 Z"
                      fill="#0f172a"
                    />
                    <path
                      d="M61 61 Q67 58 72 61"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M88 61 Q93 58 99 61"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="67"
                      cy="71"
                      r="9.5"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="2.8"
                    />
                    <circle
                      cx="93"
                      cy="71"
                      r="9.5"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="2.8"
                    />
                    <line x1="76.5" y1="71" x2="83.5" y2="71" stroke="#0f172a" strokeWidth="2.8" />
                    <circle className="tutor-eye" cx="67" cy="71" r="2.5" fill="#0f172a" />
                    <circle className="tutor-eye" cx="93" cy="71" r="2.5" fill="#0f172a" />
                    <path
                      d="M80 73 L78 80 L82 81"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="tutor-mouth-closed"
                      d="M74 89 Q80 93 86 89"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <g className="tutor-mouth-open">
                      <path
                        d="M73 87 L87 87 C87 94, 73 94, 73 87 Z"
                        fill="#0f172a"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M76 91 Q80 89.5 84 91 C82 93, 78 93, 76 91 Z"
                        fill="#f472b6"
                      />
                    </g>
                  </g>
                </svg>

                <button
                  type="button"
                  className={`voice-play-btn ${speakingTutor === 'Marcel' ? 'is-talking' : ''}`}
                  title={speakingTutor === 'Marcel' ? 'Stop preview' : "Preview Marcel's voice"}
                  onClick={(e) => handlePreviewVoice(e, 'Marcel')}
                >
                  {speakingTutor === 'Marcel' ? '❚❚' : '▶'}
                </button>
              </div>
            </div>

            {/* RUBY CARD */}
            <div
              className={`tutor-card ${selectedTutor === 'Ruby' ? 'selected' : ''}`}
              onClick={() => setSelectedTutor('Ruby')}
            >
              <h3>Ruby</h3>
              <p>Energetic and fun</p>
              <div className="avatar-wrapper" style={{ width: '160px', height: '155px' }}>
                <svg
                  viewBox="0 0 160 155"
                  width="160"
                  height="155"
                  className={`tutor-avatar-svg ${speakingTutor === 'Ruby' ? 'is-talking' : ''}`}
                >
                  <circle cx="80" cy="82" r="64" fill="#eff6ff" />

                  <path
                    d="M42 66 C34 86, 30 112, 46 122 C56 128, 104 128, 114 122 C130 112, 126 86, 118 66 C115 36, 45 36, 42 66 Z"
                    fill="#0f172a"
                  />

                  <path
                    d="M40 146 C43 120, 60 113, 80 113 C100 113, 117 120, 120 146 Z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M64 114 L80 128 L96 114"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />

                  <g className="tutor-head-group">
                    <rect
                      x="71"
                      y="96"
                      width="18"
                      height="18"
                      rx="6"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="49"
                      cy="74"
                      r="6"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="111"
                      cy="74"
                      r="6"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <path
                      d="M52 62 C52 44, 108 44, 108 62 L108 77 C108 94, 94 103, 80 103 C66 103, 52 94, 52 77 Z"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <path
                      d="M50 68 C50 42, 72 34, 80 44 C73 54, 62 62, 50 68 Z"
                      fill="#0f172a"
                    />
                    <path
                      d="M110 68 C110 42, 88 34, 80 44 C87 54, 98 62, 110 68 Z"
                      fill="#0f172a"
                    />
                    <path
                      d="M61 61 Q66 58 71 61"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M89 61 Q94 58 99 61"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <ellipse className="tutor-eye-ruby" cx="66" cy="71" rx="2.8" ry="3.5" fill="#0f172a" />
                    <ellipse className="tutor-eye-ruby" cx="94" cy="71" rx="2.8" ry="3.5" fill="#0f172a" />
                    <path
                      d="M80 65 L80 78 Q83 80 85 77"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      className="tutor-mouth-closed"
                      d="M73 87 Q80 95 87 87"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <g className="tutor-mouth-open">
                      <path
                        d="M72 86 L88 86 C88 94.5, 72 94.5, 72 86 Z"
                        fill="#0f172a"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M75.5 90.5 Q80 89 84.5 90.5 C82.5 93, 77.5 93, 75.5 90.5 Z"
                        fill="#f472b6"
                      />
                    </g>
                  </g>
                </svg>

                <button
                  type="button"
                  className={`voice-play-btn ${speakingTutor === 'Ruby' ? 'is-talking' : ''}`}
                  title={speakingTutor === 'Ruby' ? 'Stop preview' : "Preview Ruby's voice"}
                  onClick={(e) => handlePreviewVoice(e, 'Ruby')}
                >
                  {speakingTutor === 'Ruby' ? '❚❚' : '▶'}
                </button>
              </div>
            </div>
          </div>

          <div
            className="btn-row"
            style={{ maxWidth: '420px', margin: '0 auto', justifyContent: 'center' }}
          >
            <button type="button" className="btn-secondary" onClick={() => setStep(6)}>
              ← Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setSpeakingTutor(null);
                updateAndSave({ preferred_tutor: selectedTutor }, 8);
              }}
            >
              Continue
            </button>
          </div>
        </div>

        {renderSettingsModal()}
      </div>
    );
  }
  // ==================== PAGE 8 PLACEHOLDER ====================
  return (
    <div className="workspace-page">
      {renderNavbar()}

      <div className="onboarding-center" style={{ maxWidth: '560px' }}>
        <div className="step-indicator">Day 5 Complete • Pages 1–9 Connected</div>
        <h2>Ready for Whiteboard Lesson!</h2>
        <p className="helper">
          Next up is embedding the interactive <strong>tldraw</strong> infinite whiteboard on Page 8.
        </p>

        <pre
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            padding: '1.1rem',
            borderRadius: '16px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            textAlign: 'left',
            width: '100%',
          }}
        >
          {JSON.stringify(
            {
              student: userData.username,
              grade: userData.grade_level,
              language: userData.preferred_language,
              plan: userData.subscription_plan,
              mode: learningMode,
              topic: topicInput || '(Attachment/URL provided)',
              attachment: attachedFileName || attachedUrl || 'None',
              tutor: selectedTutor,
              speech_speed: `${userData.speech_speed}x`,
              mic_on_default: userData.mic_on_default,
            },
            null,
            2
          )}
        </pre>

        <div className="btn-row">
          <button type="button" className="btn-secondary" onClick={() => setStep(6)}>
            Change Topic
          </button>
          <button type="button" className="btn-secondary" onClick={() => setStep(7)}>
            Change Tutor
          </button>
          <button type="button" className="btn-primary" onClick={openSettings}>
            Open Settings
          </button>
        </div>
      </div>

      {renderSettingsModal()}
    </div>
  );
}