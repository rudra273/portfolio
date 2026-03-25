import { NextResponse } from 'next/server';
import { appendSheetRow } from '@/lib/googleSheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Append a row to the 'Contacts' sheet: timestamp, name, email, message
    await appendSheetRow('Contacts!A:D', [[timestamp, name, email, message]]);

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error: unknown) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
