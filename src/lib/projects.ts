import { getSheetValues } from '@/lib/googleSheets';
import { projects as backupProjects } from '@/projects';

export async function getProjects() {
  if (process.env.PROJECT_DATA_SOURCE?.toLowerCase() === 'local') {
    return backupProjects;
  }

  try {
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return backupProjects;
    }
    // The range A1:J matches the headers: id, title, description, image, images, features, techStack, categories, githubUrl, liveUrl
    const data = await getSheetValues('Projects!A1:J');

    if (!data.values || data.values.length === 0) {
      return [];
    }

    // First row is headers
    const rows = data.values.slice(1);

    const projects = rows.map((row: string[]) => {
      return {
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        image: row[3] || '',
        images: row[4] ? row[4].split(',').map((u: string) => u.trim()) : [],
        features: row[5] ? row[5].split('|').map((f: string) => f.trim()) : [],
        techStack: row[6] ? row[6].split(',').map((t: string) => t.trim()) : [],
        categories: row[7] ? row[7].split(',').map((c: string) => c.trim()) : [],
        githubUrl: row[8] || '',
        liveUrl: row[9] || '',
      };
    });

    return projects;
  } catch (error: unknown) {
    console.error('Error fetching projects; using local backup:', error);
    return backupProjects;
  }
}
