interface FingerprintResult {
  id: string;
  patrones_recurrentes: string;
  tecnicas_predominantes: string;
  paleta_preferida: string;
  influencias: string;
  descripcion_estilo: string;
  fortalezas_artisticas: string;
  direcciones_de_evolucion: string;
  resumen_final: string;
}

interface Props {
  fingerprint: FingerprintResult;
}

export default function FingerprintResult({ fingerprint }: Props) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Your Artistic Fingerprint</h2>
      
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Style Summary</h3>
        <p className="text-gray-700 dark:text-gray-300">{fingerprint.descripcion_estilo}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Recurring Patterns</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.patrones_recurrentes}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Predominant Techniques</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.tecnicas_predominantes}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Preferred Palette</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.paleta_preferida}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Influences</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.influencias}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Artistic Strengths</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.fortalezas_artisticas}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Evolution Directions</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.direcciones_de_evolucion}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">Your Artistic DNA</h3>
          <p className="text-gray-700 dark:text-gray-300">{fingerprint.resumen_final}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fingerprint ID: {fingerprint.id}
          </p>
        </div>
      </div>
    </div>
  );
}
