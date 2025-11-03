import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Snowscope - Reliable snow forecasting';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          fontFamily: 'system-ui',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Snow emoji */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 30,
            }}
          >
            ❄️
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            Snowscope
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 36,
              color: '#5eead4',
              fontWeight: 600,
            }}
          >
            Reliable snow forecasting
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
