import parseOffsetAsPercentage from './parseOffsetAsPercentage';
import parseOffsetAsPixels from './parseOffsetAsPixels';

/**
 * @param {string|number} offset
 * @param {number} contextHeight
 * @return {number} A number representing `offset` converted into pixels.
 */
export default function computeOffsetPixels(offset, contextHeight) {
  const pixelOffset = parseOffsetAsPixels(offset);

  if (typeof pixelOffset === 'number') {
    return pixelOffset;
  }

  const percentOffset = parseOffsetAsPercentage(offset);
  if (typeof percentOffset === 'number') {
    return percentOffset * contextHeight;
  }
}
