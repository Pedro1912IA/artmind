interface Collection {
  titulo_coleccion: string;
  concepto_general: string;
  narrativa_curatorial: string;
  orden_de_obras: number[];
  prompts_para_cada_obra: string[];
}

interface Props {
  collection: Collection;
}

export default function CollectionResult({ collection }: Props) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {collection.titulo_coleccion}
      </h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
            General Concept
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {collection.concepto_general}
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
            Curatorial Narrative
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {collection.narrativa_curatorial}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-blue-600 dark:text-blue-400">
            Proposed Artworks
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {collection.prompts_para_cada_obra.map((prompt, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Artwork {collection.orden_de_obras[index]}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {index + 1} / {collection.prompts_para_cada_obra.length}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
