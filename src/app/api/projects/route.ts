import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ projects: await getProjects() });
}
