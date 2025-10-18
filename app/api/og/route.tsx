import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    // Fetch Dr. Latek's photo
    const imageUrl = new URL('/Image from Photoroom.png', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thenycoptometrist.com').toString();
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#C0B4AB', // Beige background matching hero
            padding: '0 80px',
          }}
        >
          {/* Left Side - Dr. Latek's Photo */}
          <div
            style={{
              display: 'flex',
              height: '630px',
              width: '450px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={imageUrl}
              alt="Dr. Joanna Latek"
              width={450}
              height={630}
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Right Side - Text and Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              color: 'white',
              gap: '40px',
              marginLeft: '40px',
            }}
          >
            {/* Greeting Text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '500',
                  lineHeight: 1.2,
                }}
              >
                Hi,
              </div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '500',
                  lineHeight: 1.2,
                }}
              >
                I&apos;m Dr. Latek
              </div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '500',
                  lineHeight: 1.2,
                }}
              >
                The NYC Optometrist
              </div>
            </div>

            {/* Glass-morphic Cards */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
              }}
            >
              {/* NYC Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '40px 50px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  NYC
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Prime Location
                </div>
              </div>

              {/* Rating Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '40px 50px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '52px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  4.92★
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Patient Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

