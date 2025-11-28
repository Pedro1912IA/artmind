"use client";

import { useState } from 'react';
import Image from 'next/image';
import FingerprintResult from './components/FingerprintResult';
import ArtAnalysisResult from './components/ArtAnalysisResult';
import CollectionResult from './components/CollectionResult';
import VariationResult from './components/VariationResult';

interface AnalysisTecnico {
  estilo: string;
  tecnicas: string;
  tipo_de_pincelada: string;
  uso_de_luz: string;
  composicion: string;
  paleta: string;
}

interface Analysis {
  emociones: string;
  analisis_tecnico: AnalysisTecnico;
  influencias: string[];
  descr_conceptual: string;
  oportunidades_creativas: string;
  posibles_variaciones: string[];
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fingerprint, setFingerprint] = useState<any>(null);
  const [collection, setCollection] = useState<any>(null);
  const [variations, setVariations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://artmind.us-east-2.elasticbeanstalk.com/api/analyze-art', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze artwork. Please try again.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <Image
              src="/logoartmind.png"
              alt="Art Mind Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Art Mind</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Creative Art Intelligence Platform</p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Artwork</label>
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSingleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Multiple Artworks (2-10) for Fingerprint Analysis
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Choose Files
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No files chosen'}
                  </span>
                </div>
              </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Artwork'}
              </button>
              <button
                className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                disabled={selectedFiles.length < 2 || selectedFiles.length > 10 || loading}
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  selectedFiles.forEach((file) => {
                    formData.append('images', file);
                  });

                  try {
                    const response = await fetch('http://artmind.us-east-2.elasticbeanstalk.com/api/fingerprint', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await response.json();
                    setFingerprint(data);
                    setError(null);
                  } catch (error) {
                    console.error('Error:', error);
                    setError('Failed to generate fingerprint. Please try again.');
                    setFingerprint(null);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Analyzing...' : 'Build Artistic Profile'}
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!fingerprint || loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const response = await fetch('http://artmind.us-east-2.elasticbeanstalk.com/api/create-collection', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        fingerprintId: fingerprint.id,
                        quantity: 6
                      }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setCollection(data);
                      setError(null);
                    } else {
                      throw new Error(data.error || 'Error creating collection');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    setError(error instanceof Error ? error.message : 'Error creating collection');
                    setCollection(null);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
              <button
                className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50"
                disabled={(!selectedFile && !fingerprint) || loading}
                onClick={async () => {
                  setLoading(true);
                  const formData = new FormData();
                  
                  if (selectedFile) {
                    formData.append('image', selectedFile);
                  }
                  if (fingerprint) {
                    formData.append('fingerprintId', fingerprint.id);
                  }
                  
                  try {
                    const response = await fetch('http://artmind.us-east-2.elasticbeanstalk.com/api/variations', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setVariations(data);
                      setError(null);
                    } else {
                      throw new Error(data.error || 'Error generating variations');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    setError(error instanceof Error ? error.message : 'Error generating variations');
                    setVariations(null);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Generating...' : 'Generate Variations'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/50 dark:text-red-200">
              {error}
            </div>
          )}

          {fingerprint && <FingerprintResult fingerprint={fingerprint} />}

          {analysis && <ArtAnalysisResult analysis={analysis} />}
          
          {collection && <CollectionResult collection={collection} />}
          
          {variations && <VariationResult result={variations} />}
        </div>
      </main>
    </div>
  );
}
