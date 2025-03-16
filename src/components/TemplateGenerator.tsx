'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Copy, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OPENAI_MODELS } from '@/lib/openai';

const templateTypes = [
  {
    id: 'contract',
    name: 'Service Agreement Contract',
    description: 'A standard contract for service agreements between a provider and client.',
    fields: [
      { name: 'clientName', label: 'Client Name', placeholder: 'Enter client name' },
      { name: 'providerName', label: 'Provider Name', placeholder: 'Enter provider name' },
      { name: 'projectName', label: 'Project Name', placeholder: 'Enter project name' },
      { name: 'projectDescription', label: 'Project Description', placeholder: 'Enter a brief description' },
      { name: 'endDate', label: 'End Date', placeholder: 'Enter end date (e.g., December 31, 2024)' },
      { name: 'paymentAmount', label: 'Payment Amount', placeholder: 'Enter payment amount' },
      { name: 'paymentTerms', label: 'Payment Terms', placeholder: 'Enter payment terms' }
    ]
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'A confidentiality agreement to protect sensitive information.',
    fields: [
      { name: 'disclosingParty', label: 'Disclosing Party', placeholder: 'Enter disclosing party name' },
      { name: 'receivingParty', label: 'Receiving Party', placeholder: 'Enter receiving party name' },
      { name: 'purpose', label: 'Purpose of Disclosure', placeholder: 'Enter purpose of disclosure' },
      { name: 'termYears', label: 'Term (Years)', placeholder: '2' }
    ]
  },
  {
    id: 'employment',
    name: 'Employment Agreement',
    description: 'An agreement between an employer and employee.',
    fields: [
      { name: 'employerName', label: 'Employer Name', placeholder: 'Enter employer name' },
      { name: 'employeeName', label: 'Employee Name', placeholder: 'Enter employee name' },
      { name: 'position', label: 'Position', placeholder: 'Enter job position' },
      { name: 'startDate', label: 'Start Date', placeholder: 'Enter start date' },
      { name: 'salary', label: 'Salary', placeholder: 'Enter salary' },
      { name: 'benefits', label: 'Benefits', placeholder: 'Enter benefits' },
      { name: 'workHours', label: 'Work Hours', placeholder: 'Enter work hours' },
      { name: 'location', label: 'Location', placeholder: 'Enter work location' }
    ]
  },
  {
    id: 'lease',
    name: 'Residential Lease Agreement',
    description: 'A lease agreement between a landlord and tenant.',
    fields: [
      { name: 'landlordName', label: 'Landlord Name', placeholder: 'Enter landlord name' },
      { name: 'tenantName', label: 'Tenant Name', placeholder: 'Enter tenant name' },
      { name: 'propertyAddress', label: 'Property Address', placeholder: 'Enter property address' },
      { name: 'leaseEndDate', label: 'Lease End Date', placeholder: 'Enter lease end date' },
      { name: 'rentAmount', label: 'Rent Amount', placeholder: 'Enter rent amount' },
      { name: 'securityDeposit', label: 'Security Deposit', placeholder: 'Enter security deposit amount' },
      { name: 'paymentDueDate', label: 'Payment Due Date', placeholder: 'Enter payment due date (e.g., 1st)' }
    ]
  }
];

interface TemplateGeneratorProps {
  onTemplateGenerated?: (template: string) => void;
}

export function TemplateGenerator({ onTemplateGenerated }: TemplateGeneratorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [templateType, setTemplateType] = useState<string>('nda');
  const [generatedTemplate, setGeneratedTemplate] = useState<string>('');
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(OPENAI_MODELS.GPT4O);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    parties: 2,
    duration: '2 years',
    jurisdiction: 'the State of California',
    // Employment specific
    employerName: '',
    position: '',
    salary: '',
    payPeriod: 'month',
    startDate: '',
    // Service specific
    services: '',
    compensation: '',
    endDate: '',
    // General
    purpose: '',
  });
  const router = useRouter();

  const handleTemplateChange = (value: string) => {
    setSelectedTemplateId(value);
    setTemplateFields({});
    setErrorMessage('');
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setTemplateFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateTemplate = async () => {
    if (!selectedTemplateId) {
      setErrorMessage('Please select a template type');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedTemplateId,
          details: templateFields
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to document editor with the generated document
        router.push(`/documents/edit/${data.documentId}?content=${encodeURIComponent(data.content)}`);
      } else {
        setErrorMessage(data.error || 'Failed to generate template');
      }
    } catch (error) {
      console.error('Error generating template:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplate = templateTypes.find(template => template.id === selectedTemplateId);

  const generateAI = async () => {
    // Clear previous messages and states
    setErrorMessage('');
    setSuccessMessage('');
    setFallbackReason(null);
    setIsGenerating(true);
    
    try {
      // Validate form data
      if (!templateType) {
        throw new Error('Please select a template type');
      }
      
      // Make API request
      const response = await fetch('/api/ai/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateType,
          details: formData,
          model: selectedModel
        }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate template');
      }

      // Process successful response
      const data = await response.json();
      
      if (!data.templateContent) {
        throw new Error('No template content received');
      }
      
      setGeneratedTemplate(data.templateContent);
      setIsAIGenerated(data.isAIGenerated || false);
      setFallbackReason(data.fallbackReason);
      
      if (data.isAIGenerated) {
        setSuccessMessage(`Template successfully generated using AI model: ${data.model}!`);
      } else {
        setSuccessMessage('Template generated using fallback system. AI generation failed.');
        if (data.fallbackReason) {
          setErrorMessage(`AI generation failed: ${data.fallbackReason}`);
        }
      }
      
      if (onTemplateGenerated) {
        onTemplateGenerated(data.templateContent);
      }
    } catch (error) {
      console.error('Error generating template:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setGeneratedTemplate(''); // Clear any previous template
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTemplate);
  };

  const downloadTemplate = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedTemplate], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${templateType}-template.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Document Template</CardTitle>
        <CardDescription>
          Select a template type and fill in the required information to generate a document.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="template-type">Template Type</Label>
          <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
            <SelectTrigger id="template-type">
              <SelectValue placeholder="Select a template type" />
            </SelectTrigger>
            <SelectContent>
              {templateTypes.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTemplate && (
          <div>
            <h3 className="text-lg font-medium mb-2">{selectedTemplate.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedTemplate.description}</p>
            
            <div className="space-y-4">
              {selectedTemplate.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={templateFields[field.name] || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <Tabs defaultValue="nda" onValueChange={(value) => setTemplateType(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="nda">NDA</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="service">Service Agreement</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nda" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Confidentiality Agreement"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Parties</label>
                <input
                  type="number"
                  name="parties"
                  value={formData.parties}
                  onChange={handleInputChange}
                  min="2"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="2 years"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                <input
                  type="text"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  placeholder="the State of California"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="employment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Employment Agreement"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Software Engineer"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="$100,000"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                <select
                  name="payPeriod"
                  value={formData.payPeriod}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="week">Weekly</option>
                  <option value="biweek">Bi-weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="service" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Service Agreement"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                <textarea
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  placeholder="Description of services to be provided"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compensation</label>
                <input
                  type="text"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleInputChange}
                  placeholder="$5,000"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="General Agreement"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Parties</label>
                <input
                  type="number"
                  name="parties"
                  value={formData.parties}
                  onChange={handleInputChange}
                  min="2"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Purpose of the agreement"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="1 year"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                <input
                  type="text"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  placeholder="the State of California"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ai-model">AI Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OPENAI_MODELS.GPT4O}>GPT-4o (Recommended)</SelectItem>
                <SelectItem value={OPENAI_MODELS.GPT4}>GPT-4 Turbo</SelectItem>
                <SelectItem value={OPENAI_MODELS.GPT35_TURBO}>GPT-3.5 Turbo (Faster)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              Different models offer varying levels of quality and speed. GPT-4o provides the best results.
            </p>
          </div>

        <Button 
            onClick={generateAI} 
            disabled={isGenerating}
            className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Template with AI...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Template with AI
              </>
            )}
          </Button>
        </div>
        
        {generatedTemplate && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Generated Template</h3>
                {isAIGenerated ? (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    AI Generated
                  </span>
                ) : (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Fallback Template
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
        </Button>
              </div>
            </div>
            {fallbackReason && !isAIGenerated && (
              <div className="mb-4 bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm flex items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>AI generation failed: {fallbackReason}. Using fallback template instead.</span>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
              <pre className="whitespace-pre-wrap">{generatedTemplate}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 