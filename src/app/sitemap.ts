import { MetadataRoute } from 'next'
import { getSheetValues } from '@/lib/googleSheets'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rudrapratap-mohanty.vercel.app' 
  const currentDate = new Date()

  let projectPaths: MetadataRoute.Sitemap = []
  try {
    const data = await getSheetValues('Projects!A1:J');
    if (data && data.values && data.values.length > 1) {
      const rows = data.values.slice(1);
      projectPaths = rows.map((row: string[]) => ({
        url: `${baseUrl}/projects/${row[0]}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const, 
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const, 
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/particle`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...projectPaths,
  ]
}