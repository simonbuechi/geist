export const translations = {
  de: {
    appTitle: 'Körper Geist Seele',
    appShort: 'KGS',
    tagline: 'Wöchentliche Ausrichtung für ein harmonisches Leben',
    currentWeek: 'Aktuelle Woche',
    calendarWeek: 'Woche',
    week: 'Woche',
    history: 'Verlauf',
    historyTitle: 'Vergangene Wochen',
    backToCurrentWeek: 'Zur aktuellen Woche',
    reviewAndPlan: 'Woche abschliessen',
    reviewAndPlanShort: 'Woche abschliessen',
    viewReview: 'Wochenrückblick ansehen',
    editReview: 'Rückblick bearbeiten',
    reviewCompletedTitle: 'Wochenrückblick abgeschlossen',
    reviewOutcomes: {
      green: [
        'Stark gemacht! Du hast den Großteil deiner Wochenziele erreicht.',
        'Wunderbare Woche! Deine Achtsamkeit und dein Fokus zahlen sich aus.',
        'Richtig gut! Du bist diese Woche toll in deiner Kraft geblieben.'
      ],
      yellow: [
        'Schritt für Schritt! Jede kleine Umsetzung bringt dich weiter.',
        'Eine solide Woche in Bewegung – nimm den Schwung mit in die nächste Woche.',
        'Dranbleiben lohnt sich! Auch Teil-Erfolge sind wertvolle Fortschritte.'
      ],
      red: [
        'Sei nachsichtig mit dir – die neue Woche ist ein frischer Anfang.',
        'Manche Wochen sind herausfordernd. Atme durch und richte dich neu aus.',
        'Kein Druck: Ehrliche Reflexion ist der beste Start für nächste Woche.'
      ]
    },
    pendingReviewBannerTitle: 'Wochenrückblick ausstehend',
    pendingReviewBannerDesc: 'Schließe diese Woche ab, um zur neuen Woche zu gelangen.',
    unlockNextWeek: 'Woche abschließen, um nächste Woche freizuschalten',
    completeWeekFirst: 'Bitte schließe zuerst diese Woche ab',
    reviewed: 'Reflektiert',
    reviewWeek: 'Wochenrückblick',
    planWeek: 'Woche planen',
    allCategories: 'Alle Bereiche',
    all: 'Alle',
    status: {
      pending: 'Offen',
      good: 'Erreicht',
      partly: 'Teilweise',
      poor: 'Nicht erreicht'
    },
    categories: {
      body: {
        title: 'Körper',
        subtitle: 'Gesundheit, Bewegung, Ernährung, Erholung',
        placeholder: 'z.B. 3x 30 Min joggen, 2L Wasser täglich trinken...'
      },
      mind: {
        title: 'Geist',
        subtitle: 'Fokus, Lernen, Intellekt, Klarheit',
        placeholder: 'z.B. Buchkapitel lesen, 1 Stunde tiefes Lernen...'
      },
      soul: {
        title: 'Seele',
        subtitle: 'Innere Ruhe, Achtsamkeit, Verbindung, Freude',
        placeholder: 'z.B. 10 Min Meditation täglich, Zeit mit Freunden...'
      }
    },
    actions: {
      addGoal: 'Ziel hinzufügen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      saveGoal: 'Ziel sichern',
      completeReview: 'Rückblick abschließen',
      startNextWeek: 'Nächste Woche starten',
      carryOver: 'In nächste Woche übernehmen',
      carriedOver: 'Übernommen',
      exportData: 'Daten exportieren',
      importData: 'Daten importieren',
      signInWithGoogle: 'Mit Google anmelden',
      signOut: 'Abmelden',
      settings: 'Einstellungen',
      installPwa: 'App installieren',
      close: 'Schließen',
      addReflection: 'Wochen-Fazit (optional)',
      addComment: 'Notiz / Reflexion',
      deleteConfirm: 'Möchtest du dieses Ziel wirklich löschen?',
      skip: 'Überspringen'
    },
    reviewModal: {
      title: 'Woche abschliessen',
      description: 'Nimm dir einen achtsamen Moment, um deine Woche zu reflektieren. Wie liefen deine Ziele?',
      step1Title: '1. Ziele bewerten & kommentieren',
      step2Title: '2. Ziele für die nächste Woche übernehmen',
      step2Desc: 'Wähle Ziele aus, an denen du in der kommenden Woche weiterarbeiten möchtest:',
      generalReflectionPlaceholder: 'Was hat diese Woche besonders gut getan? Was nimmst du mit?',
      finishButton: 'Speichern',
      successMessage: 'Wunderbar! Dein Wochenrückblick wurde festgehalten.'
    },
    historyView: {
      noHistoryYet: 'Noch keine vergangenen Wochen vorhanden.',
      noHistorySub: 'Sobald du eine Woche abschließt, erscheint sie hier im Rückblick.',
      filterAll: 'Alle Wochen',
      totalGoals: 'Ziele gesamt',
      balanceScore: 'Harmonie-Index',
      goodRate: 'Erfolgsquote',
      reflection: 'Wochen-Fazit'
    },
    auth: {
      guestMode: 'Gast-Modus (Lokal)',
      guestDesc: 'Deine Daten werden sicher im Browser gespeichert.',
      cloudSyncTitle: 'Cloud-Synchronisierung',
      cloudSyncDesc: 'Melde dich mit Google an, um deine Ziele auf allen Geräten synchron zu halten.',
      firebaseConfigTitle: 'Firebase Verbindung',
      firebaseConfigDesc: 'Standardmäßig sofort lokal nutzbar oder mit Firebase Cloud verknüpfbar.',
      signedInAs: 'Angemeldet als',
      offlineActive: 'Offline-Speicher aktiv'
    },
    settings: {
      title: 'Einstellungen',
      account: 'Konto & Synchronisierung',
      appearance: 'Erscheinungsbild & Sprache',
      notifications: 'Benachrichtigungen',
      data: 'Daten & Sicherung',
      theme: 'Farbschema',
      light: 'Hell',
      dark: 'Dunkel',
      language: 'Sprache',
      german: 'Deutsch',
      english: 'English'
    },
    pwa: {
      installTitle: 'KGS als App installieren',
      installDesc: 'Nutze Körper Geist Seele direkt auf deinem Home-Bildschirm – schnell, offline-fähig & ablenkungsfrei.',
      installButton: 'Jetzt installieren',
      dismissButton: 'Später'
    },
    stats: {
      goalsCompleted: 'Erreicht',
      partlyCompleted: 'Teilweise',
      notCompleted: 'Nicht erreicht',
      balance: 'Balance'
    },
    emptyCategory: 'Noch keine Ziele für diesen Bereich festgelegt. Klicke auf "+", um ein neues Ziel hinzuzufügen.',
    notifications: {
      title: 'Erinnerungen & Benachrichtigungen',
      subtitle: 'Lass dich sonntags und montags an deinen Wochenrückblick erinnern.',
      pushTitle: 'Push-Benachrichtigungen',
      pushDesc: 'Browser- & Smartphone-Mitteilungen auf deinem Sperrbildschirm.',
      emailTitle: 'E-Mail-Erinnerungen',
      emailDesc: 'Erinnerungen per E-Mail an:',
      scheduleInfo: 'Sonntag 17:00 Uhr (Wochenrückblick) & Montag 17:00 Uhr (Follow-up, falls noch offen).',
      iosNotice: 'iPhone / iPad Hinweis: Öffne das Teilen-Menü in Safari und wähle "Zum Home-Bildschirm", um Benachrichtigungen zu aktivieren.',
      permissionDenied: 'Benachrichtigungen sind blockiert. Bitte erlaube sie in deinen Browser-Einstellungen.',
      notSupported: 'Push-Benachrichtigungen werden von diesem Browser leider nicht unterstützt.',
      sendTestPush: 'Test-Benachrichtigung senden',
      testPushSent: 'Test-Mitteilung gesendet!',
      statusEnabled: 'Aktiviert',
      statusDisabled: 'Deaktiviert',
      loginRequired: 'Melde dich an, um automatische Erinnerungen zu aktivieren.',
      deviceActive: 'Dieses Gerät ist aktiv',
      deviceNotRegistered: 'Dieses Gerät empfängt noch keine Mitteilungen',
      enableCurrentDevice: 'Für dieses Gerät aktivieren',
      devicesRegistered: 'Gerät(e) registriert'
    }
  },
  en: {
    appTitle: 'Body Mind Soul',
    appShort: 'BMS',
    tagline: 'Weekly alignment for a harmonious life',
    currentWeek: 'Current Week',
    calendarWeek: 'Week',
    week: 'Week',
    history: 'History',
    historyTitle: 'Past Weeks',
    backToCurrentWeek: 'Back to Current Week',
    reviewAndPlan: 'Complete Week',
    reviewAndPlanShort: 'Complete Week',
    viewReview: 'View Weekly Review',
    editReview: 'Edit Review',
    reviewCompletedTitle: 'Weekly Review Completed',
    reviewOutcomes: {
      green: [
        'Well done! You achieved the majority of your goals this week.',
        'Great week! Your mindfulness and focus are paying off.',
        'Fantastic job! You stayed aligned with your intentions this week.'
      ],
      yellow: [
        'Step by step! Every small effort moves you forward.',
        'A solid week in motion — carry the good momentum into next week.',
        'Keep going! Partial progress is still meaningful growth.'
      ],
      red: [
        'Be gentle with yourself — next week is a fresh start.',
        'Some weeks are challenging. Take a breath and realign for next week.',
        'No pressure: honest reflection is the best start for the week ahead.'
      ]
    },
    pendingReviewBannerTitle: 'Weekly Review Pending',
    pendingReviewBannerDesc: 'Complete this week to proceed to the new week.',
    unlockNextWeek: 'Complete week to unlock next week',
    completeWeekFirst: 'Please complete this week first',
    reviewed: 'Reviewed',
    reviewWeek: 'Weekly Review',
    planWeek: 'Plan Week',
    allCategories: 'All Dimensions',
    all: 'All',
    status: {
      pending: 'Pending',
      good: 'Achieved',
      partly: 'Partly',
      poor: 'Not achieved'
    },
    categories: {
      body: {
        title: 'Body',
        subtitle: 'Health, movement, nutrition, recovery',
        placeholder: 'e.g. 3x 30 min jog, drink 2L water daily...'
      },
      mind: {
        title: 'Mind',
        subtitle: 'Focus, learning, intellect, clarity',
        placeholder: 'e.g. Read 2 chapters, 1 hour deep learning...'
      },
      soul: {
        title: 'Soul',
        subtitle: 'Inner peace, mindfulness, connection, joy',
        placeholder: 'e.g. 10 min daily meditation, quality time with friends...'
      }
    },
    actions: {
      addGoal: 'Add Goal',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      saveGoal: 'Save Goal',
      completeReview: 'Complete Review',
      startNextWeek: 'Start Next Week',
      carryOver: 'Carry over to next week',
      carriedOver: 'Carried over',
      exportData: 'Export Data',
      importData: 'Import Data',
      signInWithGoogle: 'Sign in with Google',
      signOut: 'Sign Out',
      settings: 'Settings',
      installPwa: 'Install App',
      close: 'Close',
      addReflection: 'Weekly Reflection (optional)',
      addComment: 'Note / Reflection',
      deleteConfirm: 'Are you sure you want to delete this goal?',
      skip: 'Skip'
    },
    reviewModal: {
      title: 'Complete Week',
      description: 'Take a mindful moment to reflect on your week. How did your intentions go?',
      step1Title: '1. Rate & Comment Goals',
      step2Title: '2. Carry Over to Next Week',
      step2Desc: 'Select any goals you want to continue in the upcoming week:',
      generalReflectionPlaceholder: 'What felt especially nourishing this week? What did you learn?',
      finishButton: 'Save',
      successMessage: 'Wonderful! Your weekly review has been saved.'
    },
    historyView: {
      noHistoryYet: 'No past weeks yet.',
      noHistorySub: 'Once you complete a week review, it will show up here.',
      filterAll: 'All Weeks',
      totalGoals: 'Total Goals',
      balanceScore: 'Harmony Score',
      goodRate: 'Success Rate',
      reflection: 'Weekly Reflection'
    },
    auth: {
      guestMode: 'Guest Mode (Local)',
      guestDesc: 'Your goals are stored securely in your local browser.',
      cloudSyncTitle: 'Cloud Synchronization',
      cloudSyncDesc: 'Sign in with Google to sync your goals seamlessly across all devices.',
      firebaseConfigTitle: 'Firebase Connection',
      firebaseConfigDesc: 'Ready to use locally out-of-the-box or connect your Firebase Cloud.',
      signedInAs: 'Signed in as',
      offlineActive: 'Offline Storage Active'
    },
    settings: {
      title: 'Settings',
      account: 'Account & Cloud Sync',
      appearance: 'Appearance & Language',
      notifications: 'Notifications',
      data: 'Data & Backup',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      german: 'Deutsch',
      english: 'English'
    },
    pwa: {
      installTitle: 'Install KGS as an App',
      installDesc: 'Add Body Mind Soul to your home screen for quick, offline-ready and distraction-free access.',
      installButton: 'Install App',
      dismissButton: 'Later'
    },
    stats: {
      goalsCompleted: 'Achieved',
      partlyCompleted: 'Partly',
      notCompleted: 'Not achieved',
      balance: 'Balance'
    },
    emptyCategory: 'No goals set for this dimension yet. Click "+" to set your first goal.',
    notifications: {
      title: 'Reminders & Notifications',
      subtitle: 'Receive mindful nudges on Sunday & Monday to review your week.',
      pushTitle: 'Push Notifications',
      pushDesc: 'Browser and smartphone alerts on your lock screen.',
      emailTitle: 'Email Reminders',
      emailDesc: 'Email reminders sent to:',
      scheduleInfo: 'Sunday 17:00 (Weekly Review) & Monday 17:00 (Follow-up if review is still pending).',
      iosNotice: 'iPhone / iPad note: In Safari, tap Share and select "Add to Home Screen" to enable push notifications.',
      permissionDenied: 'Notifications are blocked. Please allow them in your browser settings.',
      notSupported: 'Push notifications are unfortunately not supported in this browser.',
      sendTestPush: 'Send Test Notification',
      testPushSent: 'Test notification sent!',
      statusEnabled: 'Enabled',
      statusDisabled: 'Disabled',
      loginRequired: 'Sign in to enable automatic reminders across your devices.',
      deviceActive: 'This device is active',
      deviceNotRegistered: 'This device is not receiving notifications yet',
      enableCurrentDevice: 'Enable on this device',
      devicesRegistered: 'device(s) registered'
    }
  }
};
