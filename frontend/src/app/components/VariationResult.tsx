import Image from 'next/image';

interface VariationResult {
  variations: string[];
  prompts: string[];
  baseStyle: string;
}

interface Props {
  result: VariationResult;
}

export default function VariationResult({ result }: Props) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Artistic Variations
      </h2>

      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Base Style
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {result.baseStyle}
            </p>
          </div>
          <button
            onClick={async () => {
              for (let index = 0; index < result.variations.length; index++) {
                const variation = result.variations[index];
                if (variation && variation.startsWith('/')) {
                  try {
                    // Fetch the image
                    const response = await fetch(`https://artmind.us-east-2.elasticbeanstalk.com${variation}`);
                    const blob = await response.blob();
                    
                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `art-mind-variation-${index + 1}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    // Small delay between downloads to avoid browser blocking
                    if (index < result.variations.length - 1) {
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }
                  } catch (error) {
                    console.error(`Error descargando variación ${index + 1}:`, error);
                  }
                }
              }
            }}
            className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm hover:shadow"
            title="Download all variations"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Download All
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {result.variations.map((variation, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-700">
              {variation && variation.startsWith('/') ? (
                <Image
                  src={`https://artmind.us-east-2.elasticbeanstalk.com${variation}`}
                  alt={`Variación ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    console.error('Error cargando imagen:', variation);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <span className="text-sm">
                    {variation ? 'Loading image...' : 'Generating...'}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Variation {index + 1}
                </span>
                {variation && variation.startsWith('/') && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://artmind.us-east-2.elasticbeanstalk.com${variation}`);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `art-mind-variation-${index + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Error descargando imagen:', error);
                        alert('Error downloading image');
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                    title="Download image"
                  >
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                    Download
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {result.prompts[index]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
