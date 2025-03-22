// components/QuickReport.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface QuickReportProps {
  totalIssues: number;
  remainingIssues: number;
  remainingBugs: number;
  readyForTest: number;
}

export default function QuickReport({
  totalIssues,
  remainingIssues,
  remainingBugs,
  readyForTest,
}: QuickReportProps) {
  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg text-white">QUICK REPORT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white">Total task: {totalIssues}</span>
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Remaining task: {remainingIssues}</span>
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Remaining bugs: {remainingBugs}</span>
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Ready for Test: {readyForTest}</span>
          <Info className="w-4 h-4 text-blue-400" />
        </div>
      </CardContent>
    </Card>
  );
}
