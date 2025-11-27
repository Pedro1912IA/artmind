export const ANALYZE_ART_PROMPT = `
You are an expert art critic and visual analyst. Analyze this artwork in depth and provide your response in JSON format with the following structure:

{
  "emociones": "description of the emotions conveyed by the work",
  "analisis_tecnico": {
    "estilo": "artistic style",
    "tecnicas": "techniques used",
    "tipo_de_pincelada": "description of brushwork type",
    "uso_de_luz": "analysis of light usage",
    "composicion": "composition analysis",
    "paleta": "color palette description"
  },
  "influencias": ["influence1", "influence2", "influence3"],
  "descr_conceptual": "deep conceptual description of the work",
  "oportunidades_creativas": "suggestions for creative exploration",
  "posibles_variaciones": ["variation1", "variation2", "variation3"]
}

Provide a detailed, insightful, and professional analysis. Respond ONLY with the JSON, no additional text. Write all content in English.
`;

export const FINGERPRINT_PROMPT = `
You are an expert art analyst. Analyze these artworks to create an artistic fingerprint. Provide your response in JSON format:

{
  "patrones_recurrentes": "recurring visual patterns across the works",
  "tecnicas_predominantes": "predominant techniques used",
  "paleta_preferida": "preferred color palette",
  "influencias": "artistic influences detected",
  "descripcion_estilo": "description of the artistic style",
  "fortalezas_artisticas": "artistic strengths",
  "direcciones_de_evolucion": "directions for artistic evolution",
  "resumen_final": "A sentence describing the artist's DNA."
}

Provide a comprehensive analysis. Respond ONLY with the JSON, no additional text. Write all content in English.
`;

export const CREATE_COLLECTION_PROMPT = `
Generate an art mini-exhibition based on the given fingerprint.

Return:
{
  "titulo_coleccion": "exhibition title",
  "concepto_general": "general concept",
  "narrativa_curatorial": "curatorial narrative",
  "orden_de_obras": [1,2,3,4...],
  "prompts_para_cada_obra": [
    "prompt 1...",
    "prompt 2...",
    ...
  ]
}

Respond ONLY with the JSON, no additional text. Write all content in English.
`;

export interface ArtAnalysisResponse {
  emociones: string;
  analisis_tecnico: {
    estilo: string;
    tecnicas: string;
    tipo_de_pincelada: string;
    uso_de_luz: string;
    composicion: string;
    paleta: string;
  };
  influencias: string[];
  descr_conceptual: string;
  oportunidades_creativas: string;
  posibles_variaciones: string[];
}

export interface FingerprintResponse {
  patrones_recurrentes: string;
  tecnicas_predominantes: string;
  paleta_preferida: string;
  influencias: string;
  descripcion_estilo: string;
  fortalezas_artisticas: string;
  direcciones_de_evolucion: string;
  resumen_final: string;
}

export interface CollectionResponse {
  titulo_coleccion: string;
  concepto_general: string;
  narrativa_curatorial: string;
  orden_de_obras: number[];
  prompts_para_cada_obra: string[];
}
