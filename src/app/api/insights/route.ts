import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalSales, totalProfit, lowStockCount, outOfStockCount, topProducts, recentSales } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are an expert business analyst and growth consultant for Nigerian Retail SMEs.
      Based on the following data for a business, generate specific, actionable insights.
      
      Business Data:
      - Total Recent Sales: ₦${totalSales}
      - Total Recent Profit: ₦${totalProfit}
      - Low Stock Items: ${lowStockCount}
      - Out of Stock Items: ${outOfStockCount}
      - Top Selling Products: ${topProducts.map((p: any) => p.name).join(', ')}
      
      Provide your response strictly in the following JSON format without any markdown wrappers or codeblock tickmarks:
      {
        "summary": "A 2-3 sentence overview of the business health and main opportunity.",
        "recommendations": [
          "Actionable suggestion 1",
          "Actionable suggestion 2",
          "Actionable suggestion 3"
        ],
        "riskLevel": "Low" | "Medium" | "High"
      }
      
      Ensure the response is valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up if the model includes markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(text);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Insights API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
