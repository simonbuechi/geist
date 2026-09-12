import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { Resend } from 'resend';
import { renderSundayReminderEmail, renderMondayReminderEmail } from './emailTemplates';

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

const APP_URL = process.env.APP_URL || 'https://geist.simibu.ch';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Körper Geist Seele <noreply@geist.simibu.ch>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Derives ISO Week identifier: "YYYY-Www" (e.g. "2026-W35")
 */
function getIsoWeekId(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

/**
 * Gets the ISO week ID for the week that just ended (Sunday before Monday)
 */
function getPreviousIsoWeekId(d: Date = new Date()): string {
  const yesterday = new Date(d.getTime() - 24 * 60 * 60 * 1000);
  return getIsoWeekId(yesterday);
}

interface NotificationPrefs {
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  emailAddress?: string;
  reminderTimeSunday?: string;
  reminderTimeMonday?: string;
}

/**
 * Helper to dispatch push notifications to a user's registered FCM tokens
 */
async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  url: string = '/?action=review'
): Promise<{ successCount: number; failureCount: number }> {
  const tokensSnap = await db.collection('users').doc(userId).collection('fcmTokens').get();
  if (tokensSnap.empty) {
    return { successCount: 0, failureCount: 0 };
  }

  const tokens = tokensSnap.docs.map((doc) => doc.id);
  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title,
      body
    },
    data: {
      url,
      title,
      body,
      tag: 'kgs-review-reminder'
    },
    webpush: {
      fcmOptions: {
        link: `${APP_URL.replace(/\/$/, '')}${url}`
      },
      notification: {
        icon: '/pwa-192x192.png',
        badge: '/favicon-32x32.png',
        tag: 'kgs-review-reminder',
        actions: [
          {
            action: 'review',
            title: 'Jetzt reflektieren'
          }
        ]
      }
    }
  });

  // Clean up stale / invalid tokens
  const staleTokens: Promise<FirebaseFirestore.WriteResult>[] = [];
  response.responses.forEach((res, idx) => {
    if (!res.success && res.error) {
      const code = res.error.code;
      if (
        code === 'messaging/invalid-registration-token' ||
        code === 'messaging/registration-token-not-registered'
      ) {
        const badToken = tokens[idx];
        staleTokens.push(db.collection('users').doc(userId).collection('fcmTokens').doc(badToken).delete());
      }
    }
  });

  if (staleTokens.length > 0) {
    await Promise.allSettled(staleTokens);
  }

  return {
    successCount: response.successCount,
    failureCount: response.failureCount
  };
}

/**
 * Helper to send email notification via Resend
 */
async function sendEmailToUser(
  email: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not configured. Email skipped:', { to: email, subject });
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject,
      html,
      text
    });
    if (result.error) {
      console.error('[Resend] Error delivering email:', result.error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Resend] Unexpected error:', err);
    return false;
  }
}

/**
 * Sunday Reminder: Runs every Sunday at 17:00 Europe/Berlin
 * Nudges user: "Zeit für deinen Wochenrückblick"
 */
export const sundayReminder = onSchedule(
  {
    schedule: '0 17 * * 0',
    timeZone: 'Europe/Berlin',
    memory: '256MiB'
  },
  async () => {
    const currentWeekId = getIsoWeekId(new Date());
    console.log(`[sundayReminder] Running for ISO week ${currentWeekId}...`);

    // Find all users (including those with only subcollections like settings/notifications)
    const userRefs = await db.collection('users').listDocuments();

    let pushSent = 0;
    let emailSent = 0;

    for (const userRef of userRefs) {
      const userId = userRef.id;

      // Read user's notification preferences
      const prefSnap = await userRef.collection('settings').doc('notifications').get();
      if (!prefSnap.exists) continue;

      const prefs = prefSnap.data() as NotificationPrefs;
      if (!prefs.pushEnabled && !prefs.emailEnabled) continue;

      // Check if current week has already been reviewed
      const planSnap = await userRef.collection('weekPlans').doc(currentWeekId).get();
      const planData = planSnap.exists ? planSnap.data() : null;

      if (planData && planData.reviewedAt) {
        console.log(`[sundayReminder] User ${userId} already completed review for ${currentWeekId}. Skipping.`);
        continue;
      }

      // Read user document for display name if available
      const userSnap = await userRef.get();
      const userData = userSnap.exists ? userSnap.data() : null;
      const displayName = userData?.displayName || undefined;

      // Send Push if enabled
      if (prefs.pushEnabled) {
        const { successCount } = await sendPushToUser(
          userId,
          'Körper · Geist · Seele',
          'Zeit für deinen Wochenrückblick! Nimm dir einen Moment für deine Reflexion.',
          '/?action=review'
        );
        pushSent += successCount;
      }

      // Send Email if enabled
      if (prefs.emailEnabled && prefs.emailAddress) {
        const template = renderSundayReminderEmail({
          appUrl: APP_URL,
          userName: displayName
        });
        const ok = await sendEmailToUser(prefs.emailAddress, template.subject, template.html, template.text);
        if (ok) emailSent++;
      }
    }

    console.log(`[sundayReminder] Completed. Push notifications sent: ${pushSent}, Emails sent: ${emailSent}`);
  }
);

/**
 * Monday Reminder: Runs every Monday at 17:00 Europe/Berlin
 * Conditional follow-up: ONLY sends if previous week's review is not yet done!
 */
export const mondayReminder = onSchedule(
  {
    schedule: '0 17 * * 1',
    timeZone: 'Europe/Berlin',
    memory: '256MiB'
  },
  async () => {
    const previousWeekId = getPreviousIsoWeekId(new Date());
    console.log(`[mondayReminder] Checking completion for previous ISO week ${previousWeekId}...`);

    const userRefs = await db.collection('users').listDocuments();

    let pushSent = 0;
    let emailSent = 0;

    for (const userRef of userRefs) {
      const userId = userRef.id;

      const prefSnap = await userRef.collection('settings').doc('notifications').get();
      if (!prefSnap.exists) continue;

      const prefs = prefSnap.data() as NotificationPrefs;
      if (!prefs.pushEnabled && !prefs.emailEnabled) continue;

      // Check if previous week was already reviewed
      const planSnap = await userRef.collection('weekPlans').doc(previousWeekId).get();
      const planData = planSnap.exists ? planSnap.data() : null;

      // CONDITIONAL LOGIC: If reviewedAt exists, do NOT send reminder!
      if (planData && planData.reviewedAt) {
        console.log(`[mondayReminder] User ${userId} already completed review for ${previousWeekId}. Skipping.`);
        continue;
      }

      // Read user document for display name if available
      const userSnap = await userRef.get();
      const userData = userSnap.exists ? userSnap.data() : null;
      const displayName = userData?.displayName || undefined;

      // Otherwise send follow-up nudge!
      if (prefs.pushEnabled) {
        const { successCount } = await sendPushToUser(
          userId,
          'Wochenrückblick noch offen? · KGS',
          'Hast du etwas vergessen? Reflektiere deine vergangene Woche für einen klaren Start.',
          '/?action=review'
        );
        pushSent += successCount;
      }

      if (prefs.emailEnabled && prefs.emailAddress) {
        const template = renderMondayReminderEmail({
          appUrl: APP_URL,
          userName: displayName
        });
        const ok = await sendEmailToUser(prefs.emailAddress, template.subject, template.html, template.text);
        if (ok) emailSent++;
      }
    }

    console.log(`[mondayReminder] Completed. Follow-up push sent: ${pushSent}, Emails sent: ${emailSent}`);
  }
);

/**
 * Callable function to send an instant test push and/or email to the caller
 */
export const sendTestReminder = onCall(async (request: CallableRequest) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to send a test notification.');
  }

  const userId = request.auth.uid;
  const userEmail = request.auth.token.email || null;

  const pushResult = await sendPushToUser(
    userId,
    'Körper Geist Seele (Test)',
    'Deine Benachrichtigungen funktionieren einwandfrei!',
    '/?action=review'
  );

  let emailOk = false;
  if (userEmail && resend) {
    const template = renderSundayReminderEmail({
      appUrl: APP_URL,
      userName: request.auth.token.name || 'Test User'
    });
    emailOk = await sendEmailToUser(userEmail, `[Test] ${template.subject}`, template.html, template.text);
  }

  return {
    pushResult,
    emailSent: emailOk,
    userEmail
  };
});
