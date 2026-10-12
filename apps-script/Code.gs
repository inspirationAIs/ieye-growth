/**
 * 아이아이(iEye Growth) - 회원/기록 저장용 Google Apps Script
 *
 * [시트 구조] 'Users' 시트가 자동으로 만들어집니다.
 *  A: userId | B: email | C: salt | D: passHash | E: token | F: createdAt | G: updatedAt | H: data(JSON)
 *
 * 배포: 배포 > 새 배포 (또는 배포 관리 > 연필 > 새 버전) / 실행: 나 / 액세스: 모든 사용자
 */
const USERS_SHEET = 'Users';
const HEADERS = ['userId', 'email', 'salt', 'passHash', 'token', 'createdAt', 'updatedAt', 'data'];

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(USERS_SHEET);
  if (!sh) sh = ss.insertSheet(USERS_SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function sha256_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

// 1-based row index of the user (matching id or email), or -1
function findRow_(sh, identifier) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const vals = sh.getRange(2, 1, last - 1, 2).getValues();
  const key = String(identifier).toLowerCase();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).toLowerCase() === key || String(vals[i][1]).toLowerCase() === key) return i + 2;
  }
  return -1;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const req = JSON.parse(e.postData.contents);
    const sh = sheet_();

    if (req.action === 'signup') {
      if (!/^[a-z0-9_]{4,20}$/.test(req.userId || '')) return out_({ ok: false, error: 'BAD_ID' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.email || '')) return out_({ ok: false, error: 'BAD_EMAIL' });
      if (!req.passHash) return out_({ ok: false, error: 'BAD_PASSWORD' });
      if (findRow_(sh, req.userId) > 0) return out_({ ok: false, error: 'ID_EXISTS' });
      if (findRow_(sh, req.email) > 0) return out_({ ok: false, error: 'EMAIL_EXISTS' });

      const salt = Utilities.getUuid();
      const token = Utilities.getUuid();
      const now = new Date().toISOString();
      sh.appendRow([req.userId, req.email, salt, sha256_(salt + req.passHash), token, now, now, '']);
      return out_({ ok: true, userId: req.userId, email: req.email, token: token });
    }

    if (req.action === 'login') {
      const row = findRow_(sh, req.identifier);
      if (row < 0) return out_({ ok: false, error: 'INVALID_LOGIN' });
      const r = sh.getRange(row, 1, 1, 8).getValues()[0];
      if (sha256_(r[2] + req.passHash) !== r[3]) return out_({ ok: false, error: 'INVALID_LOGIN' });
      const token = Utilities.getUuid();
      sh.getRange(row, 5).setValue(token);
      return out_({ ok: true, userId: r[0], email: r[1], token: token, data: r[7] || null });
    }

    if (req.action === 'save') {
      const row = findRow_(sh, req.userId);
      if (row < 0) return out_({ ok: false, error: 'INVALID_SESSION' });
      const token = sh.getRange(row, 5).getValue();
      if (!req.token || token !== req.token) return out_({ ok: false, error: 'INVALID_SESSION' });
      if (String(req.data).length > 49000) return out_({ ok: false, error: 'DATA_TOO_LARGE' });
      sh.getRange(row, 7).setValue(new Date().toISOString());
      sh.getRange(row, 8).setValue(req.data);
      return out_({ ok: true });
    }

    if (req.action === 'changePassword') {
      const row = findRow_(sh, req.userId);
      if (row < 0) return out_({ ok: false, error: 'USER_NOT_FOUND' });
      const r = sh.getRange(row, 1, 1, 8).getValues()[0];
      if (req.token && r[4] !== req.token) return out_({ ok: false, error: 'INVALID_SESSION' });
      if (req.oldPassHash && sha256_(r[2] + req.oldPassHash) !== r[3]) return out_({ ok: false, error: 'INVALID_PASSWORD' });
      if (!req.newPassHash) return out_({ ok: false, error: 'BAD_PASSWORD' });

      const newSalt = Utilities.getUuid();
      const newToken = Utilities.getUuid();
      sh.getRange(row, 3).setValue(newSalt);
      sh.getRange(row, 4).setValue(sha256_(newSalt + req.newPassHash));
      sh.getRange(row, 5).setValue(newToken);
      sh.getRange(row, 7).setValue(new Date().toISOString());
      return out_({ ok: true, token: newToken });
    }

    if (req.action === 'resetPassword') {
      const row = findRow_(sh, req.userId);
      if (row < 0) return out_({ ok: false, error: 'USER_NOT_FOUND' });
      const r = sh.getRange(row, 1, 1, 8).getValues()[0];
      if (String(r[1]).toLowerCase() !== String(req.email || '').toLowerCase()) {
        return out_({ ok: false, error: 'EMAIL_MISMATCH' });
      }
      if (!req.newPassHash) return out_({ ok: false, error: 'BAD_PASSWORD' });

      const newSalt = Utilities.getUuid();
      const newToken = Utilities.getUuid();
      sh.getRange(row, 3).setValue(newSalt);
      sh.getRange(row, 4).setValue(sha256_(newSalt + req.newPassHash));
      sh.getRange(row, 5).setValue(newToken);
      sh.getRange(row, 7).setValue(new Date().toISOString());
      return out_({ ok: true });
    }

    return out_({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('iEye GAS OK').setMimeType(ContentService.MimeType.TEXT);
}
