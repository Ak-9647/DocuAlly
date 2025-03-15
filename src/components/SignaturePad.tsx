'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineWidth = 2.5;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'hsl(var(--primary))';
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    if (ctx) {
      ctx.beginPath();
      
      // Get coordinates
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Get coordinates
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      ctx.lineTo(clientX - rect.left, clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasDrawn(false);
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      const signatureData = canvasRef.current.toDataURL('image/png');
      onSave(signatureData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale">
      <CardContent className="p-6 space-y-5">
        <h3 className="text-lg font-medium font-heading text-center">Draw Your Signature</h3>
        <div className="signature-pad relative border-2 border-dashed border-primary/40 rounded-lg bg-secondary/20 p-2 h-44 transition-all duration-200 hover:border-primary/60">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair bg-white/80 rounded-md shadow-sm"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={clearCanvas}
            className="font-medium text-sm"
          >
            Clear
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="font-medium text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveSignature} 
              disabled={!hasDrawn}
              className="font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              Save Signature
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignaturePad;
