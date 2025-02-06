import Tesseract from 'tesseract.js';

export const performOCR = async (file) => {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw error;
  }
};
