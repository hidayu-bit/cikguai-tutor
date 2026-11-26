import { useState, useEffect } from 'react';
import './App.css';
import { Tldraw, toRichText, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';

const STORAGE_KEY = 'cikguai_user';

const MODE_CONTENT = {
  English: {
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
  },
  'Bahasa Melayu': {
    Topic: {
      promptLabel: 'Topik apa yang anda ingin pelajari?',
      placeholder: "(cth., 'Ajarkan saya tentang Kata Ganti Nama')",
      chips: [
        'Kata Ganti Nama',
        'Imbuhan Awalan & Akhiran',
        'Peribahasa & Simpulan Bahasa',
        'Ayat Aktif & Ayat Pasif',
        'Kata Sendi Nama',
      ],
    },
    'Exam Prep': {
      promptLabel: 'Topik apa yang anda mahu ulang kaji untuk peperiksaan?',
      placeholder: 'Anda boleh muat naik nota, panduan belajar, atau rangka peperiksaan.',
      chips: [
        'Latihan Tatabahasa',
        'Pemahaman Petikan Umum',
        'Latihan Penjodoh Bilangan',
        'Rumusan Bahasa Melayu',
      ],
    },
    Homework: {
      promptLabel: 'Soalan kerja rumah mana yang perlukan bantuan?',
      placeholder: 'Anda boleh salin dan tampal, serta muat naik gambar atau fail.',
      chips: [
        'Semak Karangan Pendek',
        'Betulkan Kesalahan Ejaan & Imbuhan',
        'Bina Ayat daripada Peribahasa',
      ],
    },
  },
};

// Switch UI Language
const UI_TEXT = {
  English: {
    getPlan: 'Get your plan',
    planSuffix: 'Plan',
    settings: 'Settings',
    back: '← Back',
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    pricingTitle: 'Let’s get those grades',
    pricingSub: 'A personal tutor, for less than what you spend on lunch',
    weekly: 'Weekly',
    monthly: 'Monthly',
    annual: 'Annual',
    humanTutor: 'Human Tutor',
    bestDeal: 'Best Deal',
    perWeek: '/ week',
    perMonth: '/ month',
    perYear: '/ year',
    billedWeekly: 'RM9.90 billed weekly',
    billedMonthly: 'RM29.90 billed monthly',
    billedAnnually: 'RM199.90 billed annually',
    save61: 'Save 61%',
    perks: ['☑️ Unlimited Lessons', '☑️ No time limits', '☑️ All features'],
    humanCons: ['❌ Awkward small talk', '❌ Scheduling nightmares', '❌ Can’t help at 2 am', '❌ Cancels on you'],
    goWeekly: 'Go Weekly',
    goMonthly: 'Go Monthly',
    goAnnual: 'Go Annual',
    dontDoThis: "Don't do this",
    continueFree: 'Continue with Free Plan',
    newBoard: 'New Board',
    allHistory: 'All History',
    recentBoards: 'Recent Boards',
    noBoards: 'No saved boards yet',
    learnHeading: 'What do you want to learn,',
    modes: { Topic: 'Topic', 'Exam Prep': 'Exam Prep', Homework: 'Homework' },
    urlPlaceholder: 'Paste YouTube or article link here...',
    attachedLabel: 'Attached:',
    addFile: '📄 Add file',
    addUrl: '🔗 Add URL',
    startBtn: 'Start',
    quickSuggestions: 'Quick Bahasa Melayu Suggestions',
    pickTutorTitle: 'Pick your favorite tutor',
    pickTutorSub: 'You can change this anytime during the lesson',
    marcelDesc: 'Warm and friendly',
    rubyDesc: 'Energetic and fun',
    settingsTitle: 'Settings',
    nameLabel: 'Name',
    nameSub: 'This is how we’ll call you',
    emailLabel: 'Email',
    emailSub: 'Your ID',
    gradeLabel: 'Grade Level',
    gradeSub: 'Used to navigate CikguAI',
    langLabel: 'Preferred Language',
    langSub: 'You speak this language',
    speedLabel: 'Speech Speed',
    speedSub: 'Tutor voice rate',
    micLabel: 'Mic On by Default',
    micSub: 'Auto-listen when tutor finishes speaking',
    currentPlanLabel: 'Current Plan',
    subscribe: 'Subscribe',
    changePlan: 'Change Plan',
    logOut: 'Log Out',
  },
  'Bahasa Melayu': {
    getPlan: 'Pilih pelan',
    planSuffix: 'Pelan',
    settings: 'Tetapan',
    back: '← Kembali',
    continue: 'Teruskan',
    cancel: 'Batal',
    save: 'Simpan',
    pricingTitle: 'Jom tingkatkan gred anda',
    pricingSub: 'Tutor peribadi, lebih murah daripada belanja makan tengah hari',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    annual: 'Tahunan',
    humanTutor: 'Tutor Manusia',
    bestDeal: 'Paling Berbaloi',
    perWeek: '/ minggu',
    perMonth: '/ bulan',
    perYear: '/ tahun',
    billedWeekly: 'RM9.90 dibilkan setiap minggu',
    billedMonthly: 'RM29.90 dibilkan setiap bulan',
    billedAnnually: 'RM199.90 dibilkan setiap tahun',
    save61: 'Jimat 61%',
    perks: ['☑️ Pelajaran Tanpa Had', '☑️ Tiada had masa', '☑️ Semua ciri dibuka'],
    humanCons: ['❌ Bual kosong yang kekok', '❌ Susah atur jadual', '❌ Tak boleh bantu jam 2 pagi', '❌ Batalkan kelas saat akhir'],
    goWeekly: 'Pilih Mingguan',
    goMonthly: 'Pilih Bulanan',
    goAnnual: 'Pilih Tahunan',
    dontDoThis: 'Jangan pilih ini',
    continueFree: 'Teruskan dengan Pelan Percuma',
    newBoard: 'Papan Baharu',
    allHistory: 'Semua Sejarah',
    recentBoards: 'Papan Terkini',
    noBoards: 'Tiada papan disimpan lagi',
    learnHeading: 'Apa yang anda mahu pelajari,',
    modes: { Topic: 'Topik', 'Exam Prep': 'Ulang Kaji', Homework: 'Kerja Rumah' },
    urlPlaceholder: 'Tampal pautan YouTube atau artikel di sini...',
    attachedLabel: 'Dilampirkan:',
    addFile: '📄 Tambah fail',
    addUrl: '🔗 Tambah pautan',
    startBtn: 'Mula',
    quickSuggestions: 'Cadangan Pantas Bahasa Melayu',
    pickTutorTitle: 'Pilih tutor kegemaran anda',
    pickTutorSub: 'Anda boleh tukar tutor bila-bila masa semasa belajar',
    marcelDesc: 'Mesra dan tenang',
    rubyDesc: 'Ceria dan bertenaga',
    settingsTitle: 'Tetapan',
    nameLabel: 'Nama',
    nameSub: 'Nama panggilan anda',
    emailLabel: 'E-mel',
    emailSub: 'ID akaun anda',
    gradeLabel: 'Tahap Pengajian',
    gradeSub: 'Digunakan untuk menyesuaikan CikguAI',
    langLabel: 'Bahasa Pilihan',
    langSub: 'Bahasa utama anda',
    speedLabel: 'Kelajuan Suara',
    speedSub: 'Kadar percakapan tutor',
    micLabel: 'Mikrofon Aktif Secara Lalai',
    micSub: 'Auto-dengar selepas tutor selesai bercakap',
    currentPlanLabel: 'Pelan Semasa',
    subscribe: 'Langgan',
    changePlan: 'Tukar Pelan',
    logOut: 'Log Keluar',
  },
};

export default function App() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('FPX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [subscribedSuccessPlan, setSubscribedSuccessPlan] = useState(null);

  // Page 6 & 7 State
  const [learningMode, setLearningMode] = useState('Topic');
  const [topicInput, setTopicInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedUrl, setAttachedUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState('Marcel');
  const [speakingTutor, setSpeakingTutor] = useState(null);
  const [lessonIntroPhase, setLessonIntroPhase] = useState('welcome');
  const [boardEditor, setBoardEditor] = useState(null);
  const [penPos, setPenPos] = useState(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [studentReply, setStudentReply] = useState('');
  const [hasStartedWriting, setHasStartedWriting] = useState(false);
  const [isFollowingTutor, setIsFollowingTutor] = useState(true);

  // Page 6 Collapsible History Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentBoards, setRecentBoards] = useState(() => {
    const saved = localStorage.getItem('cikgu_ai_recent_boards');
    return saved
      ? JSON.parse(saved)
      : [
        'Mastering Malay Affixes: Imbuhan',
        'Kata Ganti Nama Diri & Tunjuk',
      ];
  });

  useEffect(() => {
    localStorage.setItem('cikgu_ai_recent_boards', JSON.stringify(recentBoards));
  }, [recentBoards]);

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

  const lang = userData.preferred_language === 'Bahasa Melayu' ? 'Bahasa Melayu' : 'English';
  const t = UI_TEXT[lang];

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

  useEffect(() => {
    if (step !== 7) return;
    const isBM = userData.preferred_language === 'Bahasa Melayu';
    const studentName =
      userData.username && userData.username.trim().length > 1
        ? userData.username.trim()
        : isBM
          ? 'kawan'
          : 'there';

    ['Marcel', 'Ruby'].forEach((tutorName) => {
      const text =
        tutorName === 'Marcel'
          ? isBM
            ? `Hai ${studentName}! Saya Cikgu Marcel. Jom kita belajar bersama hari ini!`
            : `Hi ${studentName}! I'm Marcel. Let's break this down step by step!`
          : isBM
            ? `Helo ${studentName}! Saya Cikgu Ruby! Dah sedia nak kuasai topik hari ini?`
            : `Hey ${studentName}! I'm Ruby! Ready to ace this topic together?`;

      fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          tutor: tutorName,
          language: userData.preferred_language,
          speed: userData.speech_speed || 1.0,
        }),
      }).catch(() => { });
    });
  }, [step, userData.preferred_language, userData.speech_speed, userData.username]);

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
      setSubscribedSuccessPlan(selectedName);
      updateAndSave({ subscription_plan: selectedName }, 6);
    }, 600);
  };

  // PAGE 7 Voice Preview + Talking Animation
  const handlePreviewVoice = async (e, tutorName) => {
    e.stopPropagation();
    setSelectedTutor(tutorName);

    if (window.currentTutorAudio) {
      window.currentTutorAudio.pause();
      window.currentTutorAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (speakingTutor === tutorName) {
      setSpeakingTutor(null);
      return;
    }

    setSpeakingTutor(tutorName);
    const isBM = userData.preferred_language === 'Bahasa Melayu';
    const studentName =
      userData.username && userData.username.trim().length > 1
        ? userData.username.trim()
        : isBM
          ? 'kawan'
          : 'there';

    const text =
      tutorName === 'Marcel'
        ? isBM
          ? `Hai ${studentName}! Saya Cikgu Marcel. Jom kita belajar bersama hari ini!`
          : `Hi ${studentName}! I'm Marcel. Let's break this down step by step!`
        : isBM
          ? `Helo ${studentName}! Saya Cikgu Ruby! Dah sedia nak kuasai topik hari ini?`
          : `Hey ${studentName}! I'm Ruby! Ready to ace this topic together?`;

    try {
      const res = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          tutor: tutorName,
          language: userData.preferred_language,
          speed: userData.speech_speed || 1.0,
        }),
      });

      if (!res.ok) throw new Error('TTS server error');

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      window.currentTutorAudio = audio;

      audio.onended = () => {
        setSpeakingTutor(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setSpeakingTutor(null);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch {
      if (!('speechSynthesis' in window)) {
        setSpeakingTutor(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isBM ? 'ms-MY' : 'en-US';
      utterance.rate = userData.speech_speed || 1.0;
      utterance.pitch = tutorName === 'Ruby' ? 1.15 : 0.95;
      utterance.onend = () => setSpeakingTutor(null);
      utterance.onerror = () => setSpeakingTutor(null);
      window.speechSynthesis.speak(utterance);
    }
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

  // Page 9 Settings Modal
  const renderSettingsModal = () => {
    if (!isSettingsOpen || !settingsDraft) return null;
    return (
      <div className="modal-backdrop">
        <form className="settings-modal" onSubmit={handleSaveSettings}>
          <div className="settings-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.settingsTitle}</h2>
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
              <h4>{t.nameLabel}</h4>
              <p>{t.nameSub}</p>
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
              <h4>{t.emailLabel}</h4>
              <p>{t.emailSub}</p>
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
              <h4>{t.gradeLabel}</h4>
              <p>{t.gradeSub}</p>
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
              <h4>{t.langLabel}</h4>
              <p>{t.langSub}</p>
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
              <h4>{t.speedLabel}</h4>
              <p>
                {t.speedSub} ({settingsDraft.speech_speed}x)
              </p>
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
              <h4>{t.micLabel}</h4>
              <p>{t.micSub}</p>
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
              <h4>{t.currentPlanLabel}</h4>
              <p>
                {settingsDraft.subscription_plan || 'Free'} {t.planSuffix}
              </p>
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
              {settingsDraft.subscription_plan === 'Free' ? t.subscribe : t.changePlan}
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
              {t.logOut}
            </button>

            <div className="btn-row" style={{ width: 'auto', marginTop: 0 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsSettingsOpen(false)}
              >
                {t.cancel}
              </button>
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                {t.save}
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
            {languages.map((langOption) => (
              <button
                type="button"
                key={langOption}
                className={`option-pill ${userData.preferred_language === langOption ? 'selected' : ''}`}
                onClick={() => setUserData({ ...userData, preferred_language: langOption })}
              >
                {langOption}
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
            {t.back}
          </button>
        </div>

        <div className="pricing-center-content">
          <div className="pricing-header">
            <h1>{t.pricingTitle}</h1>
            <p>{t.pricingSub}</p>
          </div>

          <div className="pricing-grid">
            {/* WEEKLY */}
            <div className="price-card">
              <div className="plan-title">{t.weekly}</div>
              <div className="plan-price">
                RM9.90 <span>{t.perWeek}</span>
              </div>
              <span className="food-badge">🧋 One bubble tea</span>
              <ul className="perk-list">
                {t.perks.map((perk, idx) => (
                  <li key={idx}>{perk}</li>
                ))}
              </ul>
              <div className="plan-billing-bottom">{t.billedWeekly}</div>
              <button
                type="button"
                className="btn-pill"
                onClick={() => {
                  setCheckoutStep(1);
                  setCheckoutPlan({
                    name: 'Weekly',
                    price: 'RM 9.90',
                    period: lang === 'Bahasa Melayu' ? 'Setiap minggu' : 'Per week',
                    billing: lang === 'Bahasa Melayu' ? 'Dibilkan setiap minggu' : 'Billed weekly',
                  });
                }}
              >
                {t.goWeekly}
              </button>
            </div>

            {/* MONTHLY */}
            <div className="price-card">
              <div className="plan-title">{t.monthly}</div>
              <div className="plan-price">
                RM29.90 <span>{t.perMonth}</span>
              </div>
              <span className="food-badge">🍣 One sushi lunch sets</span>
              <ul className="perk-list">
                {t.perks.map((perk, idx) => (
                  <li key={idx}>{perk}</li>
                ))}
              </ul>
              <div className="plan-billing-bottom">{t.billedMonthly}</div>
              <button
                type="button"
                className="btn-pill"
                onClick={() => {
                  setCheckoutStep(1);
                  setCheckoutPlan({
                    name: 'Monthly',
                    price: 'RM 29.90',
                    period: lang === 'Bahasa Melayu' ? 'Setiap bulan' : 'Per month',
                    billing: lang === 'Bahasa Melayu' ? 'Dibilkan setiap bulan' : 'Billed monthly',
                  });
                }}
              >
                {t.goMonthly}
              </button>
            </div>

            {/* ANNUAL */}
            <div className="price-card best-deal">
              <div className="deal-badge">{t.bestDeal}</div>
              <div className="plan-title">{t.annual}</div>
              <div className="plan-price">
                RM199.90 <span>{t.perYear}</span>
              </div>
              <span className="food-badge">🍚 One lunch set per month</span>
              <ul className="perk-list">
                {t.perks.map((perk, idx) => (
                  <li key={idx}>{perk}</li>
                ))}
              </ul>
              <div className="plan-billing-bottom">
                <span className="save-tag">{t.save61}</span>
                {t.billedAnnually}
              </div>
              <button
                type="button"
                className="btn-pill"
                onClick={() => {
                  setCheckoutStep(1);
                  setCheckoutPlan({
                    name: 'Annual',
                    price: 'RM 199.90',
                    period: lang === 'Bahasa Melayu' ? 'Setiap tahun' : 'Per year',
                    billing: lang === 'Bahasa Melayu' ? 'Dibilkan setiap tahun' : 'Billed annually',
                  });
                }}
              >
                {t.goAnnual}
              </button>
            </div>

            {/* HUMAN TUTOR */}
            <div className="price-card muted-card">
              <div className="plan-title">{t.humanTutor}</div>
              <div className="plan-price strikethrough-main">RM250.00</div>
              <ul className="perk-list">
                {t.humanCons.map((con, idx) => (
                  <li key={idx}>{con}</li>
                ))}
              </ul>
              <button type="button" className="btn-pill-disabled" disabled>
                {t.dontDoThis}
              </button>
            </div>
          </div>

          <button type="button" className="free-plan-link" onClick={handleSelectFreePlan}>
            {t.continueFree}
          </button>
        </div>

        {/* PAPARAN CHECKOUT RESIT 2-LAJUR PENUH SKRIN */}
        {checkoutPlan && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
              display: 'flex',
              flexWrap: 'wrap',
              background: '#ffffff',
              overflowY: 'auto',
            }}
          >
            {/* PANEL KIRI: RESIT RINGKAS */}
            <div
              style={{
                flex: '1 1 380px',
                background: 'linear-gradient(180deg, #f5f3ff 0%, #eff6ff 100%)',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', maxWidth: '360px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '2.25rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (checkoutStep === 2) {
                        setCheckoutStep(1);
                      } else {
                        setCheckoutPlan(null);
                      }
                    }}
                    disabled={isProcessing}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.25rem',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px 8px',
                    }}
                  >
                    ←
                  </button>
                  <span className="brand-logo" style={{ marginBottom: 0, fontSize: '1.45rem' }}>
                    CikguAI
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  {lang === 'Bahasa Melayu' ? 'Yuran langganan' : 'Subscription fee'}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
                    {checkoutPlan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {checkoutPlan.period}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a', fontWeight: 600 }}>
                    <span>CikguAI {checkoutPlan.name}</span>
                    <span>{checkoutPlan.price}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>{lang === 'Bahasa Melayu' ? 'Cukai (0%)' : 'Tax (0%)'}</span>
                    <span>RM 0.00</span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid #cbd5e1',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#0f172a',
                    }}
                  >
                    <span>{lang === 'Bahasa Melayu' ? 'Jumlah' : 'Total'}</span>
                    <span>{checkoutPlan.price}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {checkoutPlan.billing}
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL KANAN: BORANG 2 LANGKAH */}
            <div
              style={{
                flex: '1 1 420px',
                background: '#ffffff',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', maxWidth: '380px' }}>
                {checkoutStep === 1 ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckoutStep(2);
                    }}
                  >
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                      {lang === 'Bahasa Melayu' ? 'Sila masukkan butiran anda' : 'Please enter your details'}
                    </h3>
                    <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.45 }}>
                      {lang === 'Bahasa Melayu'
                        ? 'Maklumat ini digunakan untuk menghantar resit dan mengaktifkan akaun pembelajaran anda.'
                        : 'We collect this information to issue your receipt and keep your account secure.'}
                    </p>

                    <div className="form-group">
                      <label>{lang === 'Bahasa Melayu' ? 'Alamat e-mel' : 'Email address'}</label>
                      <input
                        type="email"
                        className="input-field"
                        defaultValue={userData.email || 'pelajar@cikguai.my'}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{lang === 'Bahasa Melayu' ? 'Negara' : 'Country'}</label>
                      <select className="input-field" defaultValue="Malaysia">
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Brunei">Brunei</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-pill" style={{ marginTop: '0.75rem', padding: '0.9rem' }}>
                      {lang === 'Bahasa Melayu' ? 'Teruskan »' : 'Continue »'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmDummyPayment}>
                    <div className="payment-tabs" style={{ marginTop: 0 }}>
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

                    {paymentMethod === 'FPX' ? (
                      <div className="form-group">
                        <label>{lang === 'Bahasa Melayu' ? 'Pilih Bank' : 'Select Bank'}</label>
                        <select className="input-field">
                          <option>Maybank2u</option>
                          <option>CIMB Clicks</option>
                          <option>Public Bank</option>
                          <option>RHB Now</option>
                          <option>Bank Islam</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>{lang === 'Bahasa Melayu' ? 'Nombor kad' : 'Card number'}</label>
                          <input type="text" className="input-field" defaultValue="4242 •••• •••• 4242" required />
                        </div>
                        <div className="form-group">
                          <label>{lang === 'Bahasa Melayu' ? 'Nama pada kad' : 'Name on card'}</label>
                          <input
                            type="text"
                            className="input-field"
                            defaultValue={userData.username || 'Pelajar CikguAI'}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                              {lang === 'Bahasa Melayu' ? 'Tarikh luput' : 'Expiration date'}
                            </label>
                            <input type="text" className="input-field" defaultValue="08 / 29" required />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                              {lang === 'Bahasa Melayu' ? 'Kod keselamatan' : 'Security code'}
                            </label>
                            <input type="text" className="input-field" defaultValue="888" required />
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      className="btn-pill"
                      disabled={isProcessing}
                      style={{ marginTop: '0.75rem', padding: '0.9rem' }}
                    >
                      {isProcessing
                        ? lang === 'Bahasa Melayu'
                          ? 'Memproses...'
                          : 'Processing...'
                        : lang === 'Bahasa Melayu'
                          ? 'Langgan sekarang'
                          : 'Subscribe now'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== PAGE 6: TOPIC SELECTION ====================
  if (step === 6) {
    const activeModeData = MODE_CONTENT[lang][learningMode];
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
              <span>📝</span> {t.newBoard}
            </button>

            <button
              type="button"
              className="sidebar-nav-btn"
              onClick={() => alert(`${t.allHistory}: ${recentBoards.length}`)}
            >
              <span>🕒</span> {t.allHistory}
            </button>

            <div className="sidebar-section-label">{t.recentBoards}</div>
            {recentBoards.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '0.4rem 0.75rem' }}>
                {t.noBoards}
              </p>
            ) : (
              recentBoards.map((board, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.35rem',
                  }}
                >
                  <button
                    type="button"
                    className="sidebar-recent-item"
                    style={{ flex: 1, marginBottom: 0 }}
                    title={board}
                    onClick={() => {
                      setTopicInput(board);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {board}
                  </button>
                  <button
                    type="button"
                    title="Delete board"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentBoards((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </aside>
        )}

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
              {userData.subscription_plan && userData.subscription_plan !== 'Free'
                ? `${userData.subscription_plan} ${t.planSuffix}`
                : t.getPlan}
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Switch Language / Tukar Bahasa"
              onClick={() =>
                updateAndSave({
                  preferred_language:
                    lang === 'Bahasa Melayu' ? 'English' : 'Bahasa Melayu',
                })
              }
            >
              🌐 {lang === 'Bahasa Melayu' ? 'BM' : 'EN'}
            </button>
            <button type="button" className="icon-btn" onClick={openSettings}>
              {t.settings}
            </button>
          </div>
        </header>

        <div className="topic-center-wrapper">
          <h1 className="topic-heading">
            {t.learnHeading}{' '}
            <strong style={{ textTransform: 'capitalize' }}>
              {userData.username || 'Student'}?
            </strong>
          </h1>

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
                <span>{t.modes[mode]}</span>
              </button>
            ))}
          </div>

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
                  placeholder={t.urlPlaceholder}
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
                {t.attachedLabel} {attachedFileName}{' '}
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
                  {t.addFile}
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
                  {t.addUrl}
                </button>
              </div>

              <button
                type="submit"
                className={`cikgu-start-btn ${topicInput.trim() || attachedFileName || attachedUrl.trim() ? 'ready' : ''
                  }`}
              >
                {t.startBtn}
              </button>
            </div>
          </form>

          <div className="subject-chips-wrap" style={{ width: '100%' }}>
            <div className="subject-chips-title">{t.quickSuggestions}</div>
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

        {subscribedSuccessPlan && (
          <div className="modal-backdrop" style={{ zIndex: 950 }}>
            <div className="modal-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                ✓
              </div>
              <div className="step-indicator" style={{ color: '#16a34a' }}>
                {lang === 'Bahasa Melayu' ? 'Langganan Berjaya' : 'Subscription Confirmed'}
              </div>
              <h2 style={{ marginBottom: '0.45rem' }}>
                CikguAI {subscribedSuccessPlan} {t.planSuffix}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {lang === 'Bahasa Melayu'
                  ? 'Terima kasih! Pelan anda kini aktif dan semua ciri pembelajaran telah dibuka.'
                  : 'Thank you! Your plan is now active and all unlimited lessons are unlocked.'}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSubscribedSuccessPlan(null)}
              >
                {lang === 'Bahasa Melayu' ? 'Mula Belajar' : 'Start Learning'}
              </button>
            </div>
          </div>
        )}
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
              {userData.subscription_plan || 'Free'} {t.planSuffix}
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Switch Language / Tukar Bahasa"
              onClick={() =>
                updateAndSave({
                  preferred_language:
                    lang === 'Bahasa Melayu' ? 'English' : 'Bahasa Melayu',
                })
              }
            >
              🌐 {lang === 'Bahasa Melayu' ? 'BM' : 'EN'}
            </button>
            <button type="button" className="icon-btn" onClick={openSettings}>
              {t.settings}
            </button>
          </div>
        </header>

        <div className="topic-center-wrapper" style={{ maxWidth: '640px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            {t.pickTutorTitle}
          </h1>
          <p style={{ color: '#64748b', marginBottom: '1.75rem' }}>
            {t.pickTutorSub}
          </p>

          <div className="tutor-grid" style={{ marginTop: 0 }}>
            {/* MARCEL CARD */}
            <div
              className={`tutor-card ${selectedTutor === 'Marcel' ? 'selected' : ''}`}
              onClick={() => setSelectedTutor('Marcel')}
            >
              <h3>Marcel</h3>
              <p>{t.marcelDesc}</p>
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
                    <circle cx="49" cy="73" r="6.5" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                    <circle cx="111" cy="73" r="6.5" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
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
                    <circle cx="67" cy="71" r="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.8" />
                    <circle cx="93" cy="71" r="9.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.8" />
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
              <p>{t.rubyDesc}</p>
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
                    <circle cx="49" cy="74" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                    <circle cx="111" cy="74" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
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
              {t.back}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setSpeakingTutor(null);
                setLessonIntroPhase('welcome');
                updateAndSave({ preferred_tutor: selectedTutor }, 8);
              }}
            >
              {t.continue}
            </button>
          </div>
        </div>

        {renderSettingsModal()}
      </div>
    );
  }

  // ==================== PAGE 8: CIKGUAI LIVE LECTURE WHITEBOARD ====================
  const isBM = lang === 'Bahasa Melayu';
  const lessonTopic =
    topicInput.trim() ||
    attachedFileName ||
    attachedUrl.trim() ||
    (isBM ? 'Penjodoh Bilangan' : 'Penjodoh Bilangan');

  // FASA 1 (Wireframe Page 10): Welcome to your first CikguAI tutoring lesson!
  if (lessonIntroPhase === 'welcome') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            CikguAI
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.45rem', lineHeight: 1.3 }}>
            {isBM
              ? 'Selamat datang ke kelas pertama CikguAI anda!'
              : 'Welcome to your first CikguAI tutoring lesson!'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            {isBM ? 'Mari kita buat persediaan ringkas' : "Let's quickly set you up"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
                padding: '1rem 1.15rem',
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔊</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  {isBM ? 'Hidupkan bunyi anda' : 'Turn your volume on'}
                </div>
                <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                  {isBM
                    ? 'Nyahsenyap pembesar suara untuk mendengar suara cikgu'
                    : 'Unmute your speakers to hear the tutor'}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
                padding: '1rem 1.15rem',
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>💬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  {isBM ? 'Tanya soalan bila-bila masa' : 'Ask questions anytime'}
                </div>
                <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                  {isBM
                    ? 'Cikgu akan menyesuaikan cara mengajar mengikut gaya anda'
                    : 'The tutor adapts to your learning style'}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={() => setLessonIntroPhase('volume')}
          >
            {isBM ? 'Jom Mula' : "Let's Start"}
          </button>
        </div>
      </div>
    );
  }

  // FASA 2 (Wireframe Page 11): Turn your volume on -> Done
  if (lessonIntroPhase === 'volume') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '410px',
            background: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '28px',
            padding: '2rem 1.75rem',
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
            {isBM ? 'Hidupkan bunyi anda' : 'Turn your volume on'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.75rem' }}>
            {isBM
              ? 'Nyahsenyap pembesar suara untuk mendengar suara cikgu'
              : 'Unmute your speakers to hear the tutor'}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1.5px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#94a3b8',
              }}
            >
              🔇
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>→</span>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1.5px solid #0f172a',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🔊
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={() => {
              setHasStartedWriting(false);
              setLessonIntroPhase('board');
            }}
          >
            {isBM ? 'Selesai' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  // Penjana Skrip Kuliah Dinamik Mengikut Topik yang Dipilih Pengguna
  const getLectureSteps = (topic) => {
    const cleanTopic = topic.toLowerCase();

    if (cleanTopic.includes('ayat aktif') || cleanTopic.includes('ayat pasif')) {
      return isBM
        ? [
          {
            id: 'title',
            x: 90,
            y: 85,
            text: topic,
            size: 'l',
            color: 'black',
            highlight: true,
            speech: `Hai ${userData.username || 'kawan'}, hari ini kita kuasai ${topic}!`,
          },
          {
            id: 'big-idea',
            x: 90,
            y: 165,
            text: 'Ayat Aktif: Pelaku berada di hadapan ayat\n(menggunakan imbuhan meN-)',
            size: 'm',
            color: 'black',
            speech: 'Dalam Ayat Aktif, pelaku melakukan perbuatan di hadapan ayat, biasanya dengan kata kerja berimbuhan meN.',
          },
          {
            id: 'formula',
            x: 90,
            y: 265,
            text: 'Ali  +  membaca  +  buku itu.',
            size: 'm',
            color: 'blue',
            circleWord: true,
            circleOffset: { x: 48, w: 120 },
            speech: 'Contohnya: Ali membaca buku itu. Perkataan membaca menunjukkan perbuatan aktif.',
          },
          {
            id: 'example',
            x: 90,
            y: 345,
            text: 'Ayat Pasif: Objek dibawa ke hadapan ayat\n→ Buku itu dibaca oleh Ali.',
            size: 'm',
            color: 'black',
            speech: 'Bila ditukar ke Ayat Pasif, objek dibawa ke depan: Buku itu dibaca oleh Ali.',
          },
          {
            id: 'question',
            x: 90,
            y: 445,
            text: 'Soalan: Cuba tukarkan ayat ini kepada Ayat Pasif:\n"Ibu memasak nasi lemak."',
            size: 'm',
            color: 'violet',
            speech: 'Cuba uji kefahaman anda! Tukarkan ayat "Ibu memasak nasi lemak" kepada Ayat Pasif di kotak mesej bawah.',
          },
        ]
        : [
          {
            id: 'title',
            x: 90,
            y: 85,
            text: topic,
            size: 'l',
            color: 'black',
            highlight: true,
            speech: `Hey ${userData.username || 'there'}, let's master ${topic} today!`,
          },
          {
            id: 'big-idea',
            x: 90,
            y: 165,
            text: 'Active Voice (Ayat Aktif): Subject does the action\n(usually uses meN- prefix)',
            size: 'm',
            color: 'black',
            speech: 'In Ayat Aktif, the doer comes first in the sentence, usually using the meN- verb prefix.',
          },
          {
            id: 'formula',
            x: 90,
            y: 265,
            text: 'Ali  +  membaca  +  buku itu.',
            size: 'm',
            color: 'blue',
            circleWord: true,
            circleOffset: { x: 48, w: 120 },
            speech: 'For example: Ali membaca buku itu. Membaca is the active verb.',
          },
          {
            id: 'example',
            x: 90,
            y: 345,
            text: 'Passive Voice (Ayat Pasif): Object moves to the front\n→ Buku itu dibaca oleh Ali.',
            size: 'm',
            color: 'black',
            speech: 'When flipped to Ayat Pasif, the object moves to the front: Buku itu dibaca oleh Ali.',
          },
          {
            id: 'question',
            x: 90,
            y: 445,
            text: 'Question: Convert this sentence to Ayat Pasif:\n"Ibu memasak nasi lemak."',
            size: 'm',
            color: 'violet',
            speech: 'Quick check! Try converting "Ibu memasak nasi lemak" into Ayat Pasif in the message box below.',
          },
        ];
    }

    return isBM
      ? [
        {
          id: 'title',
          x: 90,
          y: 85,
          text: topic,
          size: 'l',
          color: 'black',
          highlight: true,
          speech: `Hai ${userData.username || 'kawan'}, jom kita pelajari topik ${topic} langkah demi langkah!`,
        },
        {
          id: 'big-idea',
          x: 90,
          y: 165,
          text: `Konsep Utama: Memahami fungsi dan penggunaan\n${topic} dalam pembinaan ayat yang tepat.`,
          size: 'm',
          color: 'black',
          speech: `Pertama sekali, kita fahami konsep utama ${topic} supaya mudah digunakan dalam penulisan.`,
        },
        {
          id: 'formula',
          x: 90,
          y: 265,
          text: `Struktur:  Subjek  +  ${topic}  +  Keterangan`,
          size: 'm',
          color: 'blue',
          circleWord: true,
          circleOffset: { x: 185, w: 145 },
          speech: `Perhatikan kedudukan ${topic} di bahagian tengah struktur ayat ini.`,
        },
        {
          id: 'example',
          x: 90,
          y: 345,
          text: `Tip Penting: Pastikan konteks ayat sesuai sebelum\nmemilih bentuk ${topic} yang betul.`,
          size: 'm',
          color: 'black',
          speech: `Tip penting: sentiasa semak konteks ayat sebelum memilih bentuk ${topic} yang sesuai.`,
        },
        {
          id: 'question',
          x: 90,
          y: 445,
          text: `Soalan: Pernahkah anda belajar ${topic} sebelum ini,\natau mahu kita mulakan dari contoh paling asas?`,
          size: 'm',
          color: 'violet',
          speech: `Sebelum kita teruskan, pernahkah anda belajar ${topic} sebelum ini, atau mahu mula dari asas?`,
        },
      ]
      : [
        {
          id: 'title',
          x: 90,
          y: 85,
          text: topic,
          size: 'l',
          color: 'black',
          highlight: true,
          speech: `Hey ${userData.username || 'there'}, let's break down ${topic} step by step!`,
        },
        {
          id: 'big-idea',
          x: 90,
          y: 165,
          text: `Big Idea: Understanding how ${topic} works\nto build clear and accurate sentences.`,
          size: 'm',
          color: 'black',
          speech: `First, let's look at the big idea behind ${topic} so you can use it naturally.`,
        },
        {
          id: 'formula',
          x: 90,
          y: 265,
          text: `Pattern:  Subject  +  ${topic}  +  Object`,
          size: 'm',
          color: 'blue',
          circleWord: true,
          circleOffset: { x: 175, w: 145 },
          speech: `Notice where ${topic} sits right in the middle of the sentence structure.`,
        },
        {
          id: 'example',
          x: 90,
          y: 345,
          text: `Key Tip: Always check the sentence context before\nchoosing the right form of ${topic}.`,
          size: 'm',
          color: 'black',
          speech: `Key tip: always check the context of the sentence before picking the exact form.`,
        },
        {
          id: 'question',
          x: 90,
          y: 445,
          text: `Question: Have you studied ${topic} in class yet,\nor should we start from the very basics?`,
          size: 'm',
          color: 'violet',
          speech: `Before we go deeper, quick check—have you learned ${topic} in class yet, or is this brand new for you?`,
        },
      ];
  };

  const lectureSteps = getLectureSteps(lessonTopic);

  const speakText = async (text) => {
    setCurrentSubtitle(text);
    if (isMuted) return;

    if (window.currentTutorAudio) {
      window.currentTutorAudio.pause();
      window.currentTutorAudio = null;
    }

    setSpeakingTutor(selectedTutor);
    try {
      const res = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          tutor: selectedTutor,
          language: userData.preferred_language,
          speed: userData.speech_speed || 1.0,
        }),
      });
      if (!res.ok) throw new Error('TTS error');
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      window.currentTutorAudio = audio;
      audio.onended = () => {
        setSpeakingTutor(null);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch {
      setSpeakingTutor(null);
    }
  };

  const writeAnimatedText = async (ed, { x, y, text, size = 'm', color = 'black' }) => {
    const textShapeId = createShapeId();
    ed.createShape({
      id: textShapeId,
      type: 'text',
      x,
      y,
      props: {
        richText: toRichText(''),
        font: 'draw',
        size,
        color,
      },
    });

    const lines = text.split('\n');
    let builtText = '';

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const words = lines[lineIdx].split(' ');
      if (lineIdx > 0) builtText += '\n';

      for (let wIdx = 0; wIdx < words.length; wIdx++) {
        builtText += (wIdx > 0 ? ' ' : '') + words[wIdx];

        ed.updateShape({
          id: textShapeId,
          type: 'text',
          props: {
            richText: toRichText(builtText),
          },
        });

        const currentLineStr = builtText.split('\n')[lineIdx] || '';
        const approxWidth = currentLineStr.length * (size === 'l' ? 13.5 : 10.5);
        const approxY = y + lineIdx * 34 + 14;
        const screenPt = ed.pageToScreen({
          x: x + approxWidth,
          y: approxY,
        });

        setPenPos({ x: screenPt.x, y: screenPt.y - 22 });
        await new Promise((r) => setTimeout(r, 150));
      }
    }
  };

  const runWhiteboardSequence = async (editorInstance) => {
    const ed = editorInstance || boardEditor;
    if (!ed) return;

    const existingIds = Array.from(ed.getCurrentPageShapeIds());
    if (existingIds.length > 0) ed.deleteShapes(existingIds);

    for (let i = 0; i < lectureSteps.length; i++) {
      const item = lectureSteps[i];

      if (isFollowingTutor) {
        ed.centerOnPoint(
          { x: item.x + 210, y: item.y + 45 },
          { animation: { duration: 400 } }
        );
        await new Promise((r) => setTimeout(r, 420));
      }

      speakText(item.speech);

      if (item.highlight) {
        ed.createShape({
          type: 'geo',
          x: item.x - 6,
          y: item.y + 4,
          props: {
            geo: 'rectangle',
            w: Math.max(190, item.text.length * 13.5),
            h: 34,
            color: 'yellow',
            fill: 'solid',
            dash: 'draw',
          },
        });
      }

      await writeAnimatedText(ed, {
        x: item.x,
        y: item.y,
        text: item.text,
        size: item.size,
        color: item.color,
      });

      if (item.circleWord) {
        await new Promise((r) => setTimeout(r, 300));
        const offset = item.circleOffset || { x: 92, w: 105 };
        const circleScreenPt = ed.pageToScreen({
          x: item.x + offset.x + offset.w,
          y: item.y + 18,
        });
        setPenPos({ x: circleScreenPt.x, y: circleScreenPt.y - 22 });

        ed.createShape({
          type: 'geo',
          x: item.x + offset.x,
          y: item.y - 4,
          props: {
            geo: 'ellipse',
            w: offset.w,
            h: 40,
            color: 'red',
            fill: 'none',
            dash: 'draw',
          },
        });
      }

      await new Promise((r) => setTimeout(r, 1400));
    }

    setPenPos(null);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentReply.trim() || !boardEditor) return;

    const reply = studentReply.trim();
    setStudentReply('');

    boardEditor.createShape({
      type: 'text',
      x: 90,
      y: 530,
      props: {
        richText: toRichText(isBM ? `Jawapan: ${reply}` : `Answer: ${reply}`),
        font: 'draw',
        size: 'm',
        color: 'blue',
      },
    });

    const nextSpeech = isBM
      ? `Bagus, "${reply}"! Mari kita lihat contoh langkah seterusnya di sebelah kanan papan putih.`
      : `Nice, ${reply}! Let's look at the next example on the right side of the board.`;

    speakText(nextSpeech);

    if (isFollowingTutor) {
      boardEditor.centerOnPoint({ x: 700, y: 130 }, { animation: { duration: 450 } });
      await new Promise((r) => setTimeout(r, 460));
    }

    await writeAnimatedText(boardEditor, {
      x: 560,
      y: 85,
      text: isBM
        ? `Langkah 1: Contoh "${lessonTopic}"\n• Perhatikan struktur ayat dengan teliti`
        : `Step 1: Example for "${lessonTopic}"\n• Notice how the sentence is structured`,
      size: 'm',
      color: 'black',
    });

    setPenPos(null);
  };

  // FASA 3 (Wireframe Page 12): Kanvas Papan Putih Utama CikguAI
  return (
    <div
      className="cikguai-board-wrapper"
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <Tldraw
        onMount={(editor) => {
          setBoardEditor(editor);
          if (!hasStartedWriting) {
            setHasStartedWriting(true);
            runWhiteboardSequence(editor);
          }
        }}
      />

      {penPos && (
        <div
          className="cikguai-writing-pen"
          style={{ left: `${penPos.x}px`, top: `${penPos.y}px` }}
        >
          ✏️
        </div>
      )}

      {/* Bucu Kiri Atas: Kembali ke Topik */}
      <div
        className="cikguai-icon-pill"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '4px 12px 4px 6px',
        }}
      >
        <button
          type="button"
          className="cikguai-circle-btn"
          title={isBM ? 'Tukar Topik' : 'Back to Topics'}
          onClick={() => {
            if (window.currentTutorAudio) window.currentTutorAudio.pause();
            setSpeakingTutor(null);
            setStep(6);
          }}
        >
          ←
        </button>
        <span className="brand-logo" style={{ marginBottom: 0, fontSize: '1.05rem' }}>
          CikguAI
        </span>
      </div>

      {/* Bucu Kanan Atas: Ulang Kuliah, Bahasa, Tetapan */}
      <div
        className="cikguai-icon-pill"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px 6px',
        }}
      >
        <button
          type="button"
          className="cikguai-circle-btn"
          title={isBM ? 'Ulang Kuliah' : 'Replay Lesson'}
          onClick={() => runWhiteboardSequence(boardEditor)}
        >
          ↻
        </button>
        <button
          type="button"
          className="cikguai-circle-btn"
          style={{ width: 'auto', padding: '0 8px', fontSize: '0.75rem', fontWeight: 700 }}
          onClick={() =>
            updateAndSave({
              preferred_language: isBM ? 'English' : 'Bahasa Melayu',
            })
          }
        >
          {isBM ? 'BM' : 'EN'}
        </button>
        <button
          type="button"
          className="cikguai-circle-btn"
          title={t.settings}
          onClick={openSettings}
        >
          ⚙️
        </button>
      </div>

      {/* Panel Transkrip Kuliah */}
      {showTranscript && (
        <div
          style={{
            position: 'absolute',
            bottom: '74px',
            left: '20px',
            zIndex: 550,
            width: '300px',
            maxHeight: '340px',
            overflowY: 'auto',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1rem',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
              {isBM ? 'Transkrip Cikgu' : 'Tutor Transcript'}
            </strong>
            <button
              type="button"
              onClick={() => setShowTranscript(false)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
          {lectureSteps.map((s) => (
            <p key={s.id} style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
              {s.speech}
            </p>
          ))}
        </div>
      )}

      {/* Tengah Bawah: Subtitle */}
      {currentSubtitle && (
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 480,
            maxWidth: '540px',
            width: '80%',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#0f172a',
              background: 'rgba(255, 255, 255, 0.88)',
              border: '1px solid #e2e8f0',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              lineHeight: 1.4,
            }}
          >
            {currentSubtitle}
          </span>
        </div>
      )}

      {/* Bar Bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '18px',
          right: '18px',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        {/* Kiri Bawah: Avatar Bulat + Kapsul Kawalan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            onClick={() => setStep(7)}
            title={isBM ? 'Tukar Tutor' : 'Switch Tutor'}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#ffffff',
              border: speakingTutor === selectedTutor ? '2.5px solid #2563eb' : '2px solid #0f172a',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {selectedTutor === 'Marcel' ? (
              <svg viewBox="40 35 80 75" width="40" height="40">
                <path d="M51 62 C51 44, 109 44, 109 62 L109 76 C109 94, 95 103, 80 103 C65 103, 51 94, 51 76 Z" fill="#fff" stroke="#0f172a" strokeWidth="4" />
                <path d="M49 64 C47 40, 66 28, 92 31 C111 33, 116 46, 111 63 C106 52, 92 50, 76 52 C62 54, 54 57, 49 64 Z" fill="#0f172a" />
                <circle cx="67" cy="71" r="9.5" fill="#fff" stroke="#0f172a" strokeWidth="3.5" />
                <circle cx="93" cy="71" r="9.5" fill="#fff" stroke="#0f172a" strokeWidth="3.5" />
                <line x1="76.5" y1="71" x2="83.5" y2="71" stroke="#0f172a" strokeWidth="3.5" />
                <circle cx="67" cy="71" r="3" fill="#0f172a" />
                <circle cx="93" cy="71" r="3" fill="#0f172a" />
                <path d="M74 89 Q80 94 86 89" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="40 35 80 75" width="40" height="40">
                <path d="M42 66 C34 86, 30 112, 46 122 L114 122 C130 112, 126 86, 118 66 C115 36, 45 36, 42 66 Z" fill="#0f172a" />
                <path d="M52 62 C52 44, 108 44, 108 62 L108 77 C108 94, 94 103, 80 103 C66 103, 52 94, 52 77 Z" fill="#fff" stroke="#0f172a" strokeWidth="4" />
                <path d="M50 68 C50 42, 72 34, 80 44 C73 54, 62 62, 50 68 Z" fill="#0f172a" />
                <path d="M110 68 C110 42, 88 34, 80 44 C87 54, 98 62, 110 68 Z" fill="#0f172a" />
                <circle cx="66" cy="71" r="3.5" fill="#0f172a" />
                <circle cx="94" cy="71" r="3.5" fill="#0f172a" />
                <path d="M73 87 Q80 95 87 87" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div
            className="cikguai-icon-pill"
            style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 6px' }}
          >
            {/* Butang Follow Me */}
            <button
              type="button"
              className="cikguai-circle-btn"
              title={
                isFollowingTutor
                  ? isBM ? 'Mengikuti cikgu (Aktif)' : 'Following tutor (On)'
                  : isBM ? 'Ikut tulisan cikgu' : 'Follow tutor'
              }
              onClick={() => {
                const nextState = !isFollowingTutor;
                setIsFollowingTutor(nextState);
                if (nextState && boardEditor && penPos) {
                  boardEditor.centerOnPoint(
                    { x: penPos.x, y: penPos.y },
                    { animation: { duration: 450 } }
                  );
                }
              }}
              style={{
                background: isFollowingTutor ? '#eff6ff' : 'transparent',
                color: isFollowingTutor ? '#2563eb' : '#475569',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="7" r="3.5" />
                <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
                <path d="M17.5 8.5a4.5 4.5 0 0 1 0 6" />
                <path d="M20 6a8 8 0 0 1 0 11" />
              </svg>
            </button>

            <button
              type="button"
              className="cikguai-circle-btn"
              title={isBM ? 'Transkrip' : 'Transcript'}
              style={{ fontWeight: 800 }}
              onClick={() => setShowTranscript((prev) => !prev)}
            >
              •••
            </button>
            <button
              type="button"
              className="cikguai-circle-btn"
              title={isBM ? 'Jeda / Main' : 'Pause / Play'}
              onClick={() => {
                if (window.currentTutorAudio) {
                  if (window.currentTutorAudio.paused) {
                    window.currentTutorAudio.play();
                    setSpeakingTutor(selectedTutor);
                  } else {
                    window.currentTutorAudio.pause();
                    setSpeakingTutor(null);
                  }
                }
              }}
            >
              {speakingTutor === selectedTutor ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              className="cikguai-circle-btn"
              title={isBM ? 'Bisu Suara' : 'Mute'}
              onClick={() => {
                setIsMuted((m) => !m);
                if (window.currentTutorAudio) window.currentTutorAudio.pause();
              }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Kanan Bawah: Mikrofon + Kotak Mesej */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <button
            type="button"
            className="cikguai-icon-pill"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.05rem',
            }}
            title={isBM ? 'Bercakap' : 'Microphone'}
          >
            🎙️
          </button>

          <form
            onSubmit={handleStudentSubmit}
            className="cikguai-icon-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 6px 4px 16px',
              gap: '0.4rem',
            }}
          >
            <input
              type="text"
              value={studentReply}
              onChange={(e) => setStudentReply(e.target.value)}
              placeholder={isBM ? 'Taip jawapan atau soalan...' : 'Type your answer or question...'}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.86rem',
                width: '210px',
                color: '#0f172a',
              }}
            />
            <button
              type="submit"
              className="cikguai-circle-btn"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                fontWeight: 700,
              }}
              title={isBM ? 'Hantar' : 'Send'}
            >
              →
            </button>
          </form>
        </div>
      </div>

      {renderSettingsModal()}
    </div>
  );
}