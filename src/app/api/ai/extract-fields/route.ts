import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ai/extract-fields
 * 
 * Extracts key fields from a document using AI
 */
export async function POST(req: NextRequest) {
  try {
    const { documentId, documentContent } = await req.json();
    
    // In a real implementation, this would use AI to extract fields
    // For this example, we'll simulate a response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock extracted fields based on document content
    let extractedFields = [
      { name: 'Effective Date', value: '2023-07-15', confidence: 0.95 },
      { name: 'Party 1', value: 'Acme Corporation', confidence: 0.92 },
      { name: 'Party 2', value: 'XYZ Ltd.', confidence: 0.91 },
    ];
    
    // Add additional fields based on document type
    if (documentContent && documentContent.toLowerCase().includes('non-disclosure')) {
      extractedFields = [
        ...extractedFields,
        { name: 'Confidentiality Period', value: '3 years', confidence: 0.88 },
        { name: 'Governing Law', value: 'State of California', confidence: 0.85 },
      ];
    } else if (documentContent && documentContent.toLowerCase().includes('employment')) {
      extractedFields = [
        ...extractedFields,
        { name: 'Position', value: 'Software Engineer', confidence: 0.89 },
        { name: 'Salary', value: '$120,000 per annum', confidence: 0.87 },
        { name: 'Start Date', value: '2023-08-01', confidence: 0.94 },
      ];
    }
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      extractedFields,
      message: 'Fields extracted successfully' 
    });
  } catch (error) {
    console.error('Error extracting fields:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to extract fields', error: (error as Error).message },
      { status: 500 }
    );
  }
} 