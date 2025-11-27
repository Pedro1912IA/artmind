import { CREATE_COLLECTION_PROMPT, CollectionResponse } from './prompts';
import { getFingerprint } from './fingerprintAnalysis';
import { generateTextWithGemini } from './geminiService';
import { generateMultipleImages } from './imageGenerationService';

export async function createCollection(
  fingerprintId: string,
  desiredQuantity: number = 6
): Promise<CollectionResponse> {
  // Verify fingerprint exists
  const fingerprint = getFingerprint(fingerprintId);
  if (!fingerprint) {
    throw new Error('Fingerprint not found');
  }

  // Validate quantity
  const quantity = Math.min(Math.max(6, desiredQuantity), 12);

  try {
    // Crear un prompt contextualizado con el fingerprint
    const contextualizedPrompt = `${CREATE_COLLECTION_PROMPT}

Contexto del fingerprint del artista:
- Estilo: ${fingerprint.descripcion_estilo}
- Patrones: ${fingerprint.patrones_recurrentes}
- Técnicas: ${fingerprint.tecnicas_predominantes}
- Paleta: ${fingerprint.paleta_preferida}

Genera una colección de ${quantity} obras.`;

    const responseText = await generateTextWithGemini(contextualizedPrompt);
    
    // Intentar parsear la respuesta como JSON
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                      responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsedResponse = JSON.parse(jsonText);
      return parsedResponse as CollectionResponse;
    }
    
    throw new Error('No se pudo parsear la respuesta de Gemini');
  } catch (error) {
    console.error('Error al crear colección con Gemini:', error);
    
    // Fallback to mock data if there's an error
    return {
    titulo_coleccion: "Dialogues Between Order and Nature",
    concepto_general: "An exploration of the creative tension between geometric structures " +
      "and organic elements, reflecting the fundamental duality in the artist's style " +
      "between minimalism and natural expression.",
    narrativa_curatorial: "The collection traces a narrative arc from pure geometric abstraction " +
      "towards a progressive integration with organic forms. Each piece represents a unique " +
      "point of balance between order and chaos, structure and fluidity, reflecting the " +
      "artistic evolution and the search for harmony between these seemingly opposing elements.",
    orden_de_obras: Array.from({ length: quantity }, (_, i) => i + 1),
    prompts_para_cada_obra: [
      "Minimalist composition with pure geometric forms in earth tones, " +
        "emphasizing negative space and visual tension",
      "Intersection of straight lines and organic curves, using the artist's " +
        "characteristic palette with subtle transitions",
      "Grid structure with emerging natural elements, playing with textures " +
        "and overlapping layers",
      "Controlled explosion of organic forms contained within invisible " +
        "geometric frames",
      "Abstract landscape combining architectural elements with natural patterns, " +
        "maintaining distinctive minimalism",
      "Culmination that fully integrates the geometric and organic in " +
        "a harmonious and balanced composition",
      "Study of light and shadow through architectural forms with " +
        "projected natural elements",
      "Rhythmic sequence of forms transitioning from angular to fluid",
      "Exploration of natural textures within a modular structure",
      "Composition playing with the tension between order and chaos",
      "Abstract interpretation of a geometric garden",
      "Final synthesis of all elements in an integrative piece"
    ].slice(0, quantity)
    };
  }
}

// Store collections in memory (replace with proper database in production)
const collectionStore = new Map<string, CollectionResponse>();

export function storeCollection(id: string, collection: CollectionResponse): void {
  collectionStore.set(id, collection);
}

export function getCollection(id: string): CollectionResponse | undefined {
  return collectionStore.get(id);
}
