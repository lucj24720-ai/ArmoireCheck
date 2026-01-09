/**
 * Service de reconnaissance d'images pour détecter les outils manquants
 * Utilise TensorFlow.js pour l'analyse d'images
 */

import * as tf from '@tensorflow/tfjs';

class ImageRecognitionService {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
  }

  /**
   * Initialise le modèle de reconnaissance d'images
   */
  async loadModel() {
    if (this.isModelLoaded) {
      return;
    }

    try {
      // Pour l'instant, on utilise un modèle pré-entraîné MobileNet
      // Dans une version future, on pourrait entraîner un modèle personnalisé
      console.log('Loading image recognition model...');

      // Charger MobileNet depuis TensorFlow Hub
      this.model = await tf.loadLayersModel(
        'https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2'
      );

      this.isModelLoaded = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load image recognition model');
    }
  }

  /**
   * Prétraite une image pour l'analyse
   * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageElement
   * @returns {tf.Tensor3D} Image tensor normalisée
   */
  preprocessImage(imageElement) {
    // Convertir l'image en tensor et redimensionner à 224x224
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat();

    // Normaliser les valeurs des pixels entre -1 et 1
    const offset = tf.scalar(127.5);
    const normalized = tensor.sub(offset).div(offset);

    // Ajouter une dimension batch
    return normalized.expandDims(0);
  }

  /**
   * Compare deux images et détecte les différences
   * @param {string} referenceImageUrl - URL de l'image de référence
   * @param {string} currentImageUrl - URL de l'image actuelle
   * @returns {Promise<Object>} Résultat de la comparaison
   */
  async compareImages(referenceImageUrl, currentImageUrl) {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    try {
      // Charger les deux images
      const referenceImage = await this.loadImage(referenceImageUrl);
      const currentImage = await this.loadImage(currentImageUrl);

      // Prétraiter les images
      const referenceTensor = this.preprocessImage(referenceImage);
      const currentTensor = this.preprocessImage(currentImage);

      // Calculer la différence pixel par pixel
      const difference = tf.abs(referenceTensor.sub(currentTensor));

      // Calculer le score de similarité
      const meanDifference = await difference.mean().data();
      const similarityScore = 1 - meanDifference[0];

      // Calculer les zones de différence
      const diffMap = await this.createDifferenceMap(referenceTensor, currentTensor);

      // Nettoyer les tensors
      referenceTensor.dispose();
      currentTensor.dispose();
      difference.dispose();

      return {
        similarityScore: similarityScore,
        confidenceScore: similarityScore > 0.8 ? similarityScore : 0.5,
        differenceMap: diffMap,
        hasSignificantDifference: similarityScore < 0.9
      };
    } catch (error) {
      console.error('Error comparing images:', error);
      throw new Error('Failed to compare images');
    }
  }

  /**
   * Crée une carte de différences entre deux images
   * @param {tf.Tensor} referenceTensor
   * @param {tf.Tensor} currentTensor
   * @returns {Promise<Array>} Zones de différence
   */
  async createDifferenceMap(referenceTensor, currentTensor) {
    const difference = tf.abs(referenceTensor.sub(currentTensor));
    const threshold = 0.3; // Seuil de différence significative

    // Convertir en niveaux de gris
    const grayscale = difference.mean(3);

    // Appliquer un seuil pour détecter les zones de différence
    const binary = grayscale.greater(threshold);

    // Obtenir les données
    const data = await binary.data();
    const shape = binary.shape;

    // Trouver les régions de différence (simplification pour l'exemple)
    const regions = this.findDifferenceRegions(data, shape);

    // Nettoyer
    difference.dispose();
    grayscale.dispose();
    binary.dispose();

    return regions;
  }

  /**
   * Trouve les régions de différence dans une image binaire
   * @param {TypedArray} data
   * @param {Array} shape
   * @returns {Array} Liste des régions
   */
  findDifferenceRegions(data, shape) {
    const regions = [];
    const [batch, height, width] = shape;

    // Algorithme simple de détection de régions
    // Dans une version plus avancée, on pourrait utiliser un algorithme de clustering
    const gridSize = 8; // Diviser l'image en grille 8x8
    const cellHeight = Math.floor(height / gridSize);
    const cellWidth = Math.floor(width / gridSize);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let diffPixelCount = 0;
        let totalPixels = 0;

        // Compter les pixels différents dans cette cellule
        for (let cy = y * cellHeight; cy < (y + 1) * cellHeight; cy++) {
          for (let cx = x * cellWidth; cx < (x + 1) * cellWidth; cx++) {
            const index = cy * width + cx;
            if (data[index]) {
              diffPixelCount++;
            }
            totalPixels++;
          }
        }

        // Si plus de 30% de pixels différents, marquer comme région
        if (diffPixelCount / totalPixels > 0.3) {
          regions.push({
            x: (x * cellWidth) / width,
            y: (y * cellHeight) / height,
            width: cellWidth / width,
            height: cellHeight / height,
            confidence: diffPixelCount / totalPixels
          });
        }
      }
    }

    return regions;
  }

  /**
   * Détecte les outils manquants en comparant avec les positions connues
   * @param {Array} tools - Liste des outils avec leurs positions
   * @param {Array} differenceRegions - Régions de différence détectées
   * @returns {Array} Liste des outils probablement manquants
   */
  detectMissingTools(tools, differenceRegions) {
    const missingTools = [];

    tools.forEach(tool => {
      if (!tool.position_x || !tool.position_y) {
        return; // Ignorer les outils sans position définie
      }

      // Vérifier si la position de l'outil correspond à une région de différence
      const isInDifferenceRegion = differenceRegions.some(region => {
        return this.isPositionInRegion(
          tool.position_x,
          tool.position_y,
          tool.position_width || 0.1,
          tool.position_height || 0.1,
          region
        );
      });

      if (isInDifferenceRegion) {
        missingTools.push({
          ...tool,
          confidence: 0.8 // Score de confiance de base
        });
      }
    });

    return missingTools;
  }

  /**
   * Vérifie si une position est dans une région
   */
  isPositionInRegion(x, y, width, height, region) {
    const toolCenterX = x + width / 2;
    const toolCenterY = y + height / 2;

    return (
      toolCenterX >= region.x &&
      toolCenterX <= region.x + region.width &&
      toolCenterY >= region.y &&
      toolCenterY <= region.y + region.height
    );
  }

  /**
   * Charge une image depuis une URL
   * @param {string} url
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Analyse une image capturée et détecte les outils manquants
   * @param {string} referenceImageUrl - Image de référence de l'armoire
   * @param {string} capturedImageUrl - Image capturée actuelle
   * @param {Array} tools - Liste des outils de l'armoire
   * @returns {Promise<Object>} Résultat de l'analyse
   */
  async analyzeImage(referenceImageUrl, capturedImageUrl, tools) {
    try {
      // Comparer les images
      const comparison = await this.compareImages(referenceImageUrl, capturedImageUrl);

      // Détecter les outils manquants
      const missingTools = this.detectMissingTools(tools, comparison.differenceMap);

      return {
        similarityScore: comparison.similarityScore,
        confidenceScore: comparison.confidenceScore,
        missingTools: missingTools,
        differenceRegions: comparison.differenceMap,
        hasSignificantDifference: comparison.hasSignificantDifference
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  /**
   * Nettoie les ressources du modèle
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
    }
  }
}

// Export une instance singleton
const imageRecognitionService = new ImageRecognitionService();
export default imageRecognitionService;
