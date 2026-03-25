import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Function to fetch the Google Authed Client
export const getAuthClient = () => {
  // If the private key contains literal '\n', replace them with true newlines
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  return auth;
};

// Function to get values from a specific sheet range
export const getSheetValues = async (range: string) => {
  try {
    const auth = getAuthClient();
    const client = await auth.getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheets = google.sheets({ version: 'v4', auth: client as any });

    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing.');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching sheet values:', error);
    throw error;
  }
};

// Function to append a row to a specific sheet range
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appendSheetRow = async (range: string, values: any[][]) => {
  try {
    const auth = getAuthClient();
    const client = await auth.getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheets = google.sheets({ version: 'v4', auth: client as any });

    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing.');
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending sheet row:', error);
    throw error;
  }
};
