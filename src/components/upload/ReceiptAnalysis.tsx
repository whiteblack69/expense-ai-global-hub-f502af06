
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Info,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock receipt data from OCR analysis
const mockReceiptData = {
  merchantName: "Grand Hotel Paris",
  date: "2023-05-15",
  country: "France",
  totalAmount: 245.75,
  currency: "EUR",
  taxAmount: 40.96,
  receiptType: "Accommodation",
  lineItems: [
    {
      id: "1",
      description: "Deluxe Room - 1 Night",
      quantity: 1,
      unitPrice: 180.00,
      totalPrice: 180.00,
      taxable: true,
    },
    {
      id: "2",
      description: "Room Service - Dinner",
      quantity: 1,
      unitPrice: 24.79,
      totalPrice: 24.79,
      taxable: true,
    },
    {
      id: "3",
      description: "Mini Bar",
      quantity: 1,
      unitPrice: 15.00,
      totalPrice: 15.00,
      taxable: true,
    },
    {
      id: "4",
      description: "Tourist Tax",
      quantity: 1,
      unitPrice: 2.50,
      totalPrice: 2.50,
      taxable: false,
    },
    {
      id: "5",
      description: "WiFi Service",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxable: false,
    }
  ]
};

// Mock AI analysis results
const mockAiAnalysis = {
  isInternational: true,
  userHomeCountry: "United States",
  suggestedCategory: "Travel - Accommodation",
  alternativeCategories: [
    "Travel - Hotels",
    "Business Trip - Lodging",
    "Accommodation"
  ],
  taxabilityAssessment: "Partially Taxable",
  taxabilityExplanation: "The accommodation expenses are taxable, but the tourist tax is exempt from VAT according to French tax regulations. Hotel accommodations in France are subject to a 20% VAT rate for business travel.",
  complianceFlags: [
    {
      type: "warning",
      message: "Receipt date is more than 30 days old. Please ensure timely submission according to company policy."
    }
  ],
  lineItemAnalysis: [
    {
      id: "1",
      taxTreatment: "Standard Rate (20% VAT)",
      notes: "Business accommodation is subject to standard VAT in France"
    },
    {
      id: "2",
      taxTreatment: "Standard Rate (20% VAT)",
      notes: "Room service meals are subject to standard VAT"
    },
    {
      id: "3",
      taxTreatment: "Standard Rate (20% VAT)",
      notes: "Mini bar items are subject to standard VAT"
    },
    {
      id: "4",
      taxTreatment: "Exempt",
      notes: "Tourist taxes are exempt from VAT in France"
    },
    {
      id: "5",
      taxTreatment: "Complimentary",
      notes: "No charge items do not have VAT implications"
    }
  ]
};

const ReceiptAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState<typeof mockReceiptData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<typeof mockAiAnalysis | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    // Simulate loading OCR and AI analysis results
    setTimeout(() => {
      setReceiptData(mockReceiptData);
      setAiAnalysis(mockAiAnalysis);
      setSelectedCategory(mockAiAnalysis.suggestedCategory);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSave = () => {
    toast.success("Expense saved successfully!");
    navigate("/expenses");
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-md w-1/3 mx-auto"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded-md w-1/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
        <p className="text-muted-foreground mt-6">
          Analyzing receipt with AI... Please wait.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receipt Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Receipt Details
            </CardTitle>
            <CardDescription>OCR extracted information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Merchant</h3>
              <p className="text-sm">{receiptData?.merchantName}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Date</h3>
              <p className="text-sm">{receiptData?.date}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Country</h3>
              <p className="text-sm">{receiptData?.country}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Total Amount</h3>
              <p className="text-sm font-semibold">
                {receiptData?.totalAmount.toFixed(2)} {receiptData?.currency}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tax Amount</h3>
              <p className="text-sm">
                {receiptData?.taxAmount.toFixed(2)} {receiptData?.currency}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              AI-driven tax analysis and classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* International Status */}
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-1 text-white ${aiAnalysis?.isInternational ? 'bg-blue-500' : 'bg-green-500'}`}>
                <Info className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {aiAnalysis?.isInternational 
                    ? "International Expense" 
                    : "Domestic Expense"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {aiAnalysis?.isInternational
                    ? `This is an international expense as the receipt country (${receiptData?.country}) 
                       differs from your home country (${aiAnalysis?.userHomeCountry}).`
                    : `This is a domestic expense as the receipt country matches your home country (${aiAnalysis?.userHomeCountry}).`}
                </p>
              </div>
            </div>

            {/* Taxability Status */}
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-1 text-white ${aiAnalysis?.taxabilityAssessment === "Fully Taxable" ? 'bg-green-500' : aiAnalysis?.taxabilityAssessment === "Non-Taxable" ? 'bg-red-500' : 'bg-amber-500'}`}>
                {aiAnalysis?.taxabilityAssessment === "Fully Taxable" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {aiAnalysis?.taxabilityAssessment}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {aiAnalysis?.taxabilityExplanation}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Category</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Suggested</SelectLabel>
                    <SelectItem value={aiAnalysis?.suggestedCategory || ""}>
                      {aiAnalysis?.suggestedCategory}
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Alternatives</SelectLabel>
                    {aiAnalysis?.alternativeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Compliance Flags */}
            {aiAnalysis?.complianceFlags && aiAnalysis.complianceFlags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Compliance Flags</h3>
                {aiAnalysis.complianceFlags.map((flag, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 rounded bg-amber-50 border border-amber-100 text-amber-800"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <p className="text-xs">{flag.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Notes</h3>
              <Textarea 
                placeholder="Add any additional notes about this expense"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Line Items Analysis */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Line Item Analysis</CardTitle>
            <CardDescription>
              AI analysis of individual line items on the receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Tax Treatment</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receiptData?.lineItems.map((item, index) => {
                  const analysis = aiAnalysis?.lineItemAnalysis.find(
                    (a) => a.id === item.id
                  );
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice.toFixed(2)} {receiptData.currency}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.totalPrice.toFixed(2)} {receiptData.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={analysis?.taxTreatment.includes("Exempt") ? "outline" : "default"}>
                          {analysis?.taxTreatment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {analysis?.notes}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Expense
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptAnalysis;
