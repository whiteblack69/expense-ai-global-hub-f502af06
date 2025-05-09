
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ReceiptUploader = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      handleFile(uploadedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      handleFile(uploadedFile);
    }
  };

  const handleFile = (uploadedFile: File) => {
    // Check if file is PDF or image
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      toast.error("Please upload a PDF or image file (JPEG, PNG)");
      return;
    }
    
    setFile(uploadedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Receipt uploaded successfully!");
      navigate("/receipt-analysis");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Receipt</CardTitle>
        <CardDescription>
          Upload a receipt for AI analysis and expense categorization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Drag & Drop your receipt here
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, JPEG, and PNG files up to 10MB
          </p>
          <Input
            id="receipt"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById("receipt")?.click()}
            className="mx-auto"
          >
            Browse files
          </Button>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Selected file:</span> {file.name}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Processing..." : "Upload & Analyze"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReceiptUploader;
