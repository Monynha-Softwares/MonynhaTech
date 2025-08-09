import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}

export function ErrorState({ message, onRetry, type = "error" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Alert variant={type === "error" ? "destructive" : "default"} className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}