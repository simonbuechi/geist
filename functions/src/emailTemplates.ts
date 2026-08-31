export interface EmailTemplateOptions {
  appUrl: string;
  userName?: string;
  lang?: 'de' | 'en';
}

export function renderSundayReminderEmail({
  appUrl,
  userName = '',
  lang = 'de'
}: EmailTemplateOptions): { subject: string; html: string; text: string } {
  const reviewUrl = `${appUrl.replace(/\/$/, '')}/?action=review`;
  const greeting = userName ? (lang === 'de' ? `Liebe/r ${userName},` : `Dear ${userName},`) : (lang === 'de' ? 'Hallo,' : 'Hello,');

  if (lang === 'en') {
    const subject = 'Time for your weekly review · Body Mind Soul';
    const text = `${greeting}\n\nThe week is coming to a close. Take a calm, mindful moment to reflect on your intentions for Body, Mind, and Soul.\n\nReview your week now: ${reviewUrl}\n\nWith mindfulness,\nBody Mind Soul`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: linear-gradient(135deg, #9123A6 0%, #D7195F 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Body · Mind · Soul</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Weekly reflection & holistic alignment</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">${greeting}</p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
                The week is coming to a close. Take a calm, mindful moment to reflect on your intentions for <strong>Body</strong>, <strong>Mind</strong>, and <strong>Soul</strong>.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #9123A6 0%, #D7195F 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(145,35,166,0.25);">
                  Review Your Week Now →
                </a>
              </div>
              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #78716c;">
                A few mindful minutes today bring clarity and ease to the week ahead.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 18px 24px; text-align: center; font-size: 11px; color: #a8a29e;">
              Body Mind Soul · Holistic Weekly Planning PWA<br>
              You received this email because reminders are enabled in your account settings.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    return { subject, html, text };
  }

  const subject = 'Zeit für deinen Wochenrückblick · Körper Geist Seele';
  const text = `${greeting}\n\nDie Woche neigt sich dem Ende zu. Schenke dir einen Moment der Ruhe, um innezuhalten und deine Absichten für Körper, Geist und Seele zu reflektieren.\n\nJetzt reflektieren: ${reviewUrl}\n\nMit Achtsamkeit,\nKörper Geist Seele`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: linear-gradient(135deg, #9123A6 0%, #D7195F 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Körper · Geist · Seele</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Wöchentliche Ausrichtung & Rückblick</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">${greeting}</p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
                Die Woche neigt sich dem Ende zu. Schenke dir einen achtsamen Moment der Ruhe, um deine Ziele für <strong>Körper</strong>, <strong>Geist</strong> und <strong>Seele</strong> zu reflektieren.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #9123A6 0%, #D7195F 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(145,35,166,0.25);">
                  Wochenrückblick starten →
                </a>
              </div>
              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #78716c;">
                Ein paar achtsame Minuten schenken dir Gelassenheit und klare Ausrichtung für die neue Woche.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 18px 24px; text-align: center; font-size: 11px; color: #a8a29e;">
              Körper Geist Seele · Achtsame Wochenplanung PWA<br>
              Du erhältst diese Erinnerung, weil sie in deinen Einstellungen aktiviert ist.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

export function renderMondayReminderEmail({
  appUrl,
  userName = '',
  lang = 'de'
}: EmailTemplateOptions): { subject: string; html: string; text: string } {
  const reviewUrl = `${appUrl.replace(/\/$/, '')}/?action=review`;
  const greeting = userName ? (lang === 'de' ? `Liebe/r ${userName},` : `Dear ${userName},`) : (lang === 'de' ? 'Hallo,' : 'Hello,');

  if (lang === 'en') {
    const subject = 'Missed your weekly review? · Body Mind Soul';
    const text = `${greeting}\n\nThe new week has begun – have you completed your review for last week yet?\n\nTaking a moment to conclude the previous week helps start the new week with focus and clarity.\n\nCatch up on your review: ${reviewUrl}\n\nWith mindfulness,\nBody Mind Soul`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #9123A6 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Body · Mind · Soul</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">A gentle reminder</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">${greeting}</p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
                The new week has started – did you finish reflecting on last week? Concluding the previous week gives you a clean slate and clarity for what lies ahead.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #9123A6 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79,70,229,0.25);">
                  Catch Up on Review Now →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 18px 24px; text-align: center; font-size: 11px; color: #a8a29e;">
              Body Mind Soul · Holistic Weekly Planning PWA<br>
              You received this email because reminders are enabled in your account settings.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    return { subject, html, text };
  }

  const subject = 'Wochenrückblick noch offen? · Körper Geist Seele';
  const text = `${greeting}\n\nDie neue Woche hat begonnen – hast du deinen Wochenrückblick für die vergangene Woche schon abgeschlossen?\n\nEin kurzer Abschluss der vergangenen Tage schenkt dir Klarheit und frische Energie für die neue Woche.\n\nRückblick jetzt nachholen: ${reviewUrl}\n\nMit Achtsamkeit,\nKörper Geist Seele`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f4; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #9123A6 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Körper · Geist · Seele</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Eine kurze Erinnerung</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">${greeting}</p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
                Die neue Woche hat begonnen – hast du deinen Rückblick für die vergangene Woche schon abgeschlossen? Ein bewusster Abschluss schenkt dir Klarheit und Gelassenheit für alles, was vor dir liegt.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #9123A6 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79,70,229,0.25);">
                  Rückblick nachholen →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 18px 24px; text-align: center; font-size: 11px; color: #a8a29e;">
              Körper Geist Seele · Achtsame Wochenplanung PWA<br>
              Du erhältst diese Erinnerung, weil sie in deinen Einstellungen aktiviert ist.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
