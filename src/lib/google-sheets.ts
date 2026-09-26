import { google } from 'googleapis';
import type { SheetAssessmentRow } from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getGoogleAuth() {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  };

  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
}

async function getSheetsClient() {
  const auth = getGoogleAuth();
  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// Sheet names
const SHEETS = {
  PROFILE: 'Profile',
  ASSESSMENTS: 'Assessments',
  RESPONSES: 'Responses',
};

/**
 * Initialize the spreadsheet with required sheets and headers
 */
export async function initializeSpreadsheet(): Promise<void> {
  const sheets = await getSheetsClient();

  // Get existing sheet names
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });
  const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) ?? [];

  const sheetsToCreate = Object.values(SHEETS).filter(
    (name) => !existingSheets.includes(name)
  );

  if (sheetsToCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: sheetsToCreate.map((title) => ({
          addSheet: { properties: { title } },
        })),
      },
    });
  }

  // Set headers
  const headerUpdates = [
    {
      range: `${SHEETS.PROFILE}!A1:F1`,
      values: [['id', 'name', 'birthdate', 'gender', 'parentEmail', 'createdAt']],
    },
    {
      range: `${SHEETS.ASSESSMENTS}!A1:L1`,
      values: [[
        'id', 'childId', 'assessmentDate', 'ageMonths', 'kdstPeriod',
        'grossMotor', 'fineMotor', 'cognition', 'language', 'socialEmotional',
        'selfHelp', 'overallLevel',
      ]],
    },
    {
      range: `${SHEETS.RESPONSES}!A1:C1`,
      values: [['assessmentId', 'questionId', 'score']],
    },
  ];

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: headerUpdates,
    },
  });
}

/**
 * Save or update child profile
 */
export async function saveProfile(profile: {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  parentEmail: string;
  createdAt: string;
}): Promise<void> {
  const sheets = await getSheetsClient();

  // Check if profile already exists
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEETS.PROFILE}!A2:F`,
  });

  const rows = existing.data.values ?? [];
  const existingRowIndex = rows.findIndex((row) => row[0] === profile.id);

  const values = [[
    profile.id,
    profile.name,
    profile.birthdate,
    profile.gender,
    profile.parentEmail,
    profile.createdAt,
  ]];

  if (existingRowIndex >= 0) {
    // Update existing row (offset by 2 for header)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.PROFILE}!A${existingRowIndex + 2}:F${existingRowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  } else {
    // Append new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.PROFILE}!A:F`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
}

/**
 * Get profile by ID
 */
export async function getProfile(profileId: string): Promise<{
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  parentEmail: string;
  createdAt: string;
} | null> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEETS.PROFILE}!A2:F`,
  });

  const rows = response.data.values ?? [];
  const row = rows.find((r) => r[0] === profileId);
  if (!row) return null;

  return {
    id: row[0],
    name: row[1],
    birthdate: row[2],
    gender: row[3],
    parentEmail: row[4],
    createdAt: row[5],
  };
}

/**
 * Save assessment result to Google Sheets
 */
export async function saveAssessment(
  result: import('@/types').AssessmentResult
): Promise<void> {
  const sheets = await getSheetsClient();

  const domainMap = new Map(result.domainScores.map((d) => [d.domain, d.score]));

  const assessmentRow = [[
    result.id,
    result.childId,
    result.assessmentDate,
    result.ageMonths,
    result.kdstPeriod,
    domainMap.get('grossMotor') ?? 0,
    domainMap.get('fineMotor') ?? 0,
    domainMap.get('cognition') ?? 0,
    domainMap.get('language') ?? 0,
    domainMap.get('socialEmotional') ?? 0,
    domainMap.get('selfHelp') ?? 0,
    result.overallLevel,
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEETS.ASSESSMENTS}!A:L`,
    valueInputOption: 'RAW',
    requestBody: { values: assessmentRow },
  });

  // Save individual question responses
  const responseRows = result.questionResponses.map((r) => [
    result.id,
    r.questionId,
    r.score,
  ]);

  if (responseRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.RESPONSES}!A:C`,
      valueInputOption: 'RAW',
      requestBody: { values: responseRows },
    });
  }
}

/**
 * Get all assessments for a child
 */
export async function getAssessmentHistory(
  childId: string
): Promise<SheetAssessmentRow[]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEETS.ASSESSMENTS}!A2:L`,
  });

  const rows = response.data.values ?? [];
  return rows
    .filter((row) => row[1] === childId)
    .map((row) => ({
      date: row[2],
      ageMonths: Number(row[3]),
      period: Number(row[4]),
      grossMotor: Number(row[5]),
      fineMotor: Number(row[6]),
      cognition: Number(row[7]),
      language: Number(row[8]),
      socialEmotional: Number(row[9]),
      selfHelp: Number(row[10]),
      totalScore: Number(row[5]) + Number(row[6]) + Number(row[7]) + Number(row[8]) + Number(row[9]) + Number(row[10]),
      overallLevel: row[11],
      notes: row[12] ?? '',
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
