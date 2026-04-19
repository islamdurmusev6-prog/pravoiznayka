import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generatePDF = async (
  title: string,
  content: string
): Promise<string> => {
  try {
    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #1e40af;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 10px;
          }
          .content {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="content">${content}</div>
        <div class="footer">
          <p>Документ создан в приложении ПравоЗнайка</p>
          <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </body>
      </html>
    `;

    // Save to file system
    const fileName = `${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Note: In a real app, you'd use a library like react-native-html-to-pdf
    // For now, we'll save as text and provide sharing
    await FileSystem.writeAsStringAsync(filePath, htmlContent);

    return filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const sharePDF = async (filePath: string, title: string) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing not available');
    }

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/pdf',
      dialogTitle: `Поделиться: ${title}`,
    });
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

export const exportConsultation = async (
  question: string,
  answer: string,
  category: string
): Promise<string> => {
  const content = `
КОНСУЛЬТАЦИЯ ПравоЗнайка

Категория: ${category}
Дата: ${new Date().toLocaleDateString('ru-RU')}

ВОПРОС:
${question}

ОТВЕТ:
${answer}

---
Информация носит ознакомительный характер.
Для сложных случаев рекомендуется обратиться к квалифицированному юристу.
  `.trim();

  return generatePDF(`Консультация_${category}`, content);
};
