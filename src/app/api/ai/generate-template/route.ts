import { NextRequest, NextResponse } from 'next/server';
import { generateDocumentTemplate, OPENAI_MODELS } from '@/lib/openai';

// Fallback template generation in case OpenAI fails
const generateFallbackTemplate = (type: string, details: any) => {
  const currentDate = new Date().toLocaleDateString();
  
  // Common template parts
  const header = `# ${details.title || 'Agreement'}\n\n**Date: ${currentDate}**\n\n`;
  const footer = `\n\n## Signatures\n\n${Array(details.parties || 2).fill('________________________').join('\n\n')}\n\n`;
  
  let content = '';
  
  // Generate different templates based on type
  switch (type.toLowerCase()) {
    case 'nda':
      content = `
## Confidentiality Agreement

This Non-Disclosure Agreement (the "Agreement") is entered into by and between the parties listed below, for the purpose of preventing the unauthorized disclosure of Confidential Information.

### 1. Definition of Confidential Information
For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which the parties are engaged.

### 2. Obligations of Receiving Party
The Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

### 3. Term
This Agreement shall remain in effect for a period of ${details.duration || '2 years'} from the date of execution.

### 4. Governing Law
This Agreement shall be governed by the laws of ${details.jurisdiction || 'the State of California'}.
`;
      break;
      
    case 'employment':
      content = `
## Employment Agreement

This Employment Agreement (the "Agreement") is made and entered into as of the date below, by and between ${details.employerName || 'Employer'} ("Employer") and the undersigned employee ("Employee").

### 1. Position and Duties
Employee shall be employed in the position of ${details.position || 'Position'} and shall perform duties as assigned by Employer.

### 2. Compensation
Employer shall pay Employee a salary of ${details.salary || '$X,XXX'} per ${details.payPeriod || 'month'}, subject to applicable withholdings and deductions.

### 3. Term of Employment
This Agreement shall commence on ${details.startDate || '[Start Date]'} and continue until terminated by either party.

### 4. Confidentiality
Employee agrees to maintain the confidentiality of all proprietary information of Employer.

### 5. Governing Law
This Agreement shall be governed by the laws of ${details.jurisdiction || 'the State of California'}.
`;
      break;
      
    case 'service':
      content = `
## Service Agreement

This Service Agreement (the "Agreement") is entered into by and between the service provider and client identified below.

### 1. Services
Provider agrees to provide the following services: ${details.services || '[Description of Services]'}.

### 2. Compensation
Client agrees to pay Provider the sum of ${details.compensation || '$X,XXX'} for the services rendered.

### 3. Term
This Agreement shall commence on ${details.startDate || '[Start Date]'} and continue until ${details.endDate || '[End Date]'} or until the services are completed.

### 4. Independent Contractor Relationship
Provider is an independent contractor and not an employee of Client.

### 5. Governing Law
This Agreement shall be governed by the laws of ${details.jurisdiction || 'the State of California'}.
`;
      break;
      
    default:
      content = `
## General Agreement

This Agreement is entered into by and between the parties listed below.

### 1. Purpose
The purpose of this Agreement is to ${details.purpose || 'establish the terms and conditions of the relationship between the parties'}.

### 2. Term
This Agreement shall be effective from the date of signing and shall continue for a period of ${details.duration || '1 year'}.

### 3. Governing Law
This Agreement shall be governed by the laws of ${details.jurisdiction || 'the State of California'}.
`;
  }
  
  return header + content + footer;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateType, details, model = OPENAI_MODELS.GPT4O } = body;
    
    if (!templateType) {
      return NextResponse.json(
        { error: 'Template type is required' },
        { status: 400 }
      );
    }
    
    let aiGeneratedTemplate = null;
    let errorMessage = null;
    
    // Try to generate template using OpenAI
    try {
      aiGeneratedTemplate = await generateDocumentTemplate(templateType, details || {}, model);
    } catch (error: any) {
      console.error('OpenAI generation failed:', error);
      errorMessage = error.message || 'AI generation failed';
      
      // If the error is related to the API key, return a specific error
      if (error.message?.includes('API key')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }
    
    // If OpenAI generation fails, use the fallback
    const templateContent = aiGeneratedTemplate || generateFallbackTemplate(templateType, details || {});
    
    return NextResponse.json({
      success: true,
      templateContent,
      templateType,
      generatedAt: new Date().toISOString(),
      isAIGenerated: !!aiGeneratedTemplate,
      model: aiGeneratedTemplate ? model : 'fallback',
      fallbackReason: errorMessage
    });
    
  } catch (error: any) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate template' },
      { status: 500 }
    );
  }
} 