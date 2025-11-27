interface AnalysisTecnico {
  estilo: string;
  tecnicas: string;
  tipo_de_pincelada: string;
  uso_de_luz: string;
  composicion: string;
  paleta: string;
}

interface ArtAnalysis {
  emociones: string;
  analisis_tecnico: AnalysisTecnico;
  influencias: string[];
  descr_conceptual: string;
  oportunidades_creativas: string;
  posibles_variaciones: string[];
}

interface Props {
  analysis: ArtAnalysis;
}

export default function ArtAnalysisResult({ analysis }: Props) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Artwork Analysis</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Emotions</h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.emociones}</p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Technical Analysis</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Style</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.estilo}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Techniques</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.tecnicas}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Brushwork Type</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.tipo_de_pincelada}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Light Usage</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.uso_de_luz}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Composition</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.composicion}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Palette</h4>
              <p className="text-gray-700 dark:text-gray-300">{analysis.analisis_tecnico.paleta}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Influences</h3>
          <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
            {analysis.influencias.map((influencia, index) => (
              <li key={index}>{influencia}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Possible Variations</h3>
          <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
            {analysis.posibles_variaciones.map((variacion, index) => (
              <li key={index}>{variacion}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Conceptual Description</h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.descr_conceptual}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Creative Opportunities</h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.oportunidades_creativas}</p>
        </div>
      </div>
    </div>
  );
}
