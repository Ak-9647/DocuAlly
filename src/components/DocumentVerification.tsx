import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Shield, Clock, Download, ExternalLink } from 'lucide-react';

interface Signatory {
  name: string;
  email: string;
  signedAt: string;
  ipAddress?: string;
  verified: boolean;
}

interface VerificationResult {
  isVerified: boolean;
  documentId: string;
  verificationId?: string;
  verifiedAt?: string;
  signatories?: Signatory[];
  error?: string;
}

interface DocumentVerificationProps {
  documentId: string;
  documentName: string;
}

export function DocumentVerification({
  documentId,
  documentName
}: DocumentVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyDocument = async () => {
    try {
      setIsVerifying(true);
      setError(null);
      
      const response = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify document');
      }
      
      setVerificationResult(data);
    } catch (err) {
      console.error('Error verifying document:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadVerificationCertificate = () => {
    // In a real app, this would generate and download a PDF certificate
    alert('In a real application, this would download a PDF verification certificate');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Verify this document to ensure all signatures are valid and the document hasn't been tampered with.
          </p>
          <div className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md">
            <Shield className="h-5 w-5 mr-2" />
            <p className="text-sm">
              Verification creates a tamper-proof seal and generates a verification certificate that can be used to prove the document's authenticity.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {verificationResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
              {verificationResult.isVerified ? (
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium text-green-700">Verification Successful</h3>
                  <p className="text-sm text-gray-500">
                    This document has been verified and all signatures are valid.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <XCircle className="h-12 w-12 text-red-500 mb-2" />
                  <h3 className="text-lg font-medium text-red-700">Verification Failed</h3>
                  <p className="text-sm text-gray-500">
                    {verificationResult.error || 'This document could not be verified.'}
                  </p>
                </div>
              )}
            </div>

            {verificationResult.isVerified && verificationResult.signatories && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Signatories</h3>
                {verificationResult.signatories.map((signatory, index) => (
                  <div 
                    key={`${signatory.email}-${index}`}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-sm">{signatory.name}</p>
                      <p className="text-xs text-gray-500">{signatory.email}</p>
                      <p className="text-xs text-gray-500">
                        Signed: {formatDate(signatory.signedAt)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {signatory.verified ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Invalid</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {verificationResult.isVerified && verificationResult.verifiedAt && (
              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                <span>Verified at: {formatDate(verificationResult.verifiedAt)}</span>
                <span>ID: {verificationResult.verificationId}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!verificationResult ? (
          <Button 
            onClick={verifyDocument}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Verify Document
              </>
            )}
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={() => setVerificationResult(null)}
            >
              Verify Again
            </Button>
            
            {verificationResult.isVerified && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={downloadVerificationCertificate}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Certificate
                </Button>
                
                <Button>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Share Proof
                </Button>
              </div>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
} 