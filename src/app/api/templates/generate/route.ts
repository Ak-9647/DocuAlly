import { NextRequest, NextResponse } from 'next/server';

interface TemplateData {
  type: string;
  details: {
    [key: string]: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: TemplateData = await req.json();
    const { type, details } = data;
    
    // Generate content based on template type
    let content = '';
    
    if (type === 'contract') {
      content = generateContractTemplate(details);
    } else if (type === 'nda') {
      content = generateNDATemplate(details);
    } else if (type === 'employment') {
      content = generateEmploymentTemplate(details);
    } else if (type === 'lease') {
      content = generateLeaseTemplate(details);
    } else {
      content = 'Template type not supported';
    }
    
    // Generate a random document ID
    const documentId = Math.random().toString(36).substring(2, 15);
    
    return NextResponse.json({
      success: true,
      documentId,
      content,
      message: 'Document template generated successfully'
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate document template' 
    }, { status: 500 });
  }
}

// Template generators
function generateContractTemplate(details: { [key: string]: string }): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const {
    clientName = '[CLIENT NAME]',
    providerName = '[PROVIDER NAME]',
    projectName = '[PROJECT NAME]',
    projectDescription = '[PROJECT DESCRIPTION]',
    startDate = today,
    endDate = '[END DATE]',
    paymentAmount = '[PAYMENT AMOUNT]',
    paymentTerms = '[PAYMENT TERMS]'
  } = details;
  
  return `
SERVICE AGREEMENT CONTRACT

This Service Agreement (the "Agreement") is made and entered into on ${startDate} (the "Effective Date") by and between:

${providerName} ("Provider")
and
${clientName} ("Client")

1. SERVICES
Provider agrees to provide the following services to Client (the "Services"):
${projectName} - ${projectDescription}

2. TERM
This Agreement shall commence on the Effective Date and shall continue until ${endDate}, unless terminated earlier in accordance with the terms of this Agreement.

3. COMPENSATION
Client agrees to pay Provider the sum of ${paymentAmount} for the Services, according to the following payment schedule:
${paymentTerms}

4. INTELLECTUAL PROPERTY
All intellectual property rights in any materials produced by Provider in connection with the Services shall remain the property of Provider until full payment has been made, at which point ownership shall transfer to Client.

5. CONFIDENTIALITY
Both parties agree to keep confidential all information received from the other party that is marked as confidential or ought reasonably to be considered confidential.

6. TERMINATION
Either party may terminate this Agreement with 30 days' written notice to the other party.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

8. SIGNATURES
By signing below, the parties agree to be bound by the terms of this Agreement.

________________________                    ________________________
${providerName}                             ${clientName}
Date: ________________                      Date: ________________

Document generated on ${today} using DocuAlly
`;
}

function generateNDATemplate(details: { [key: string]: string }): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const {
    disclosingParty = '[DISCLOSING PARTY]',
    receivingParty = '[RECEIVING PARTY]',
    purpose = '[PURPOSE OF DISCLOSURE]',
    effectiveDate = today,
    termYears = '2'
  } = details;
  
  return `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is made and entered into on ${effectiveDate} (the "Effective Date") by and between:

${disclosingParty} ("Disclosing Party")
and
${receivingParty} ("Receiving Party")

1. PURPOSE
The Receiving Party wishes to receive certain confidential information from the Disclosing Party for the purpose of ${purpose} (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally, or by inspection of tangible items, which is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

3. OBLIGATIONS
The Receiving Party agrees to:
(a) use the Confidential Information only for the Purpose;
(b) maintain the Confidential Information in strict confidence;
(c) not disclose the Confidential Information to any third party without prior written consent of the Disclosing Party;
(d) protect the Confidential Information with at least the same degree of care used to protect its own confidential information.

4. TERM
This Agreement shall remain in effect for a term of ${termYears} years from the Effective Date.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

6. SIGNATURES
By signing below, the parties agree to be bound by the terms of this Agreement.

________________________                    ________________________
${disclosingParty}                          ${receivingParty}
Date: ________________                      Date: ________________

Document generated on ${today} using DocuAlly
`;
}

function generateEmploymentTemplate(details: { [key: string]: string }): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const {
    employerName = '[EMPLOYER NAME]',
    employeeName = '[EMPLOYEE NAME]',
    position = '[POSITION]',
    startDate = today,
    salary = '[SALARY]',
    benefits = '[BENEFITS]',
    workHours = '[WORK HOURS]',
    location = '[LOCATION]'
  } = details;
  
  return `
EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and entered into on ${today} (the "Effective Date") by and between:

${employerName} ("Employer")
and
${employeeName} ("Employee")

1. POSITION
Employer agrees to employ Employee as ${position}, and Employee accepts such employment.

2. TERM
Employee's employment shall commence on ${startDate} and shall continue until terminated by either party in accordance with this Agreement.

3. COMPENSATION
Employer shall pay Employee a salary of ${salary}, subject to applicable tax withholdings and deductions.

4. BENEFITS
Employee shall be entitled to the following benefits:
${benefits}

5. WORK HOURS AND LOCATION
Employee shall work ${workHours} at ${location}, or such other location as designated by Employer.

6. DUTIES AND RESPONSIBILITIES
Employee shall perform all duties and responsibilities as directed by Employer.

7. TERMINATION
Either party may terminate this Agreement with written notice to the other party in accordance with applicable law.

8. CONFIDENTIALITY
Employee agrees to maintain the confidentiality of all proprietary information of Employer.

9. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

10. SIGNATURES
By signing below, the parties agree to be bound by the terms of this Agreement.

________________________                    ________________________
${employerName}                             ${employeeName}
Date: ________________                      Date: ________________

Document generated on ${today} using DocuAlly
`;
}

function generateLeaseTemplate(details: { [key: string]: string }): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const {
    landlordName = '[LANDLORD NAME]',
    tenantName = '[TENANT NAME]',
    propertyAddress = '[PROPERTY ADDRESS]',
    leaseStartDate = today,
    leaseEndDate = '[LEASE END DATE]',
    rentAmount = '[RENT AMOUNT]',
    securityDeposit = '[SECURITY DEPOSIT]',
    paymentDueDate = '[PAYMENT DUE DATE]'
  } = details;
  
  return `
RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement (the "Agreement") is made and entered into on ${today} (the "Effective Date") by and between:

${landlordName} ("Landlord")
and
${tenantName} ("Tenant")

1. PREMISES
Landlord agrees to rent to Tenant the residential property located at:
${propertyAddress} (the "Premises").

2. TERM
The lease term shall begin on ${leaseStartDate} and end on ${leaseEndDate}.

3. RENT
Tenant agrees to pay Landlord rent in the amount of ${rentAmount} per month, due on the ${paymentDueDate} of each month.

4. SECURITY DEPOSIT
Tenant shall pay a security deposit of ${securityDeposit}, which shall be refunded within 30 days after vacating the Premises, less any deductions for damages beyond normal wear and tear.

5. UTILITIES
Tenant shall be responsible for paying all utilities, including but not limited to electricity, gas, water, sewer, and trash.

6. MAINTENANCE
Tenant shall keep the Premises in a clean and sanitary condition. Landlord shall be responsible for major repairs.

7. TERMINATION
Either party may terminate this Agreement with 30 days' written notice to the other party.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

9. SIGNATURES
By signing below, the parties agree to be bound by the terms of this Agreement.

________________________                    ________________________
${landlordName}                             ${tenantName}
Date: ________________                      Date: ________________

Document generated on ${today} using DocuAlly
`;
} 