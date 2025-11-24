import { getExposedProperty } from '@/lib/actions'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export async function generateImageMetadata({ params }) {
  const domain = decodeURIComponent(params.domain).split('.')
  const result = await getExposedProperty({ perma_link: domain[0], aName: '' })
  const title = result?.name ? `${result.name} – Book direct` : 'igloorooms'

  return [
    {
      id: 0,
      alt: title,
      size,
      contentType,
    },
  ]
}

export default async function OGImage({ params }) {
  const domain = decodeURIComponent(params.domain).split('.')
  const result = await getExposedProperty({ perma_link: domain[0], aName: '' })
  const title = result?.name ? `${result.name} – Book direct` : 'igloorooms'
  const coverImage = result?.images?.[0]?.url

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          color: '#0f172a',
          backgroundColor: '#f8fafc',
          backgroundImage: coverImage ? `linear-gradient(rgba(15,23,42,.7), rgba(15,23,42,.7)), url(${coverImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
        }}
      >
        <span style={{ fontSize: 32, textTransform: 'uppercase', letterSpacing: 8, color: '#e2e8f0' }}>
          Igloorooms
        </span>
        <strong style={{ color: '#f8fafc' }}>{title}</strong>
      </div>
    ),
    {
      ...size,
      alt: title,
    }
  )
}
