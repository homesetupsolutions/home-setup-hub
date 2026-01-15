import { useEffect, useRef, useState } from "react";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SquarePaymentFormProps {
  applicationId: string;
  locationId: string;
  amount: number;
  currency?: string;
  onPaymentComplete: (paymentToken: string, verificationToken?: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  customerEmail?: string;
}

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locId: string) => Promise<any>;
    };
  }
}

export function SquarePaymentForm({
  applicationId,
  locationId,
  amount,
  currency = "CAD",
  onPaymentComplete,
  onError,
  isProcessing,
  customerEmail,
}: SquarePaymentFormProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeSquare() {
      // Load Square Web Payments SDK
      if (!window.Square) {
        const script = document.createElement("script");
        script.src = "https://web.squarecdn.com/v1/square.js";
        script.onload = () => {
          if (mounted) initPayments();
        };
        script.onerror = () => {
          if (mounted) {
            setSdkError("Failed to load payment system. Please refresh the page.");
            setIsLoading(false);
          }
        };
        document.body.appendChild(script);
      } else {
        initPayments();
      }
    }

    async function initPayments() {
      if (!window.Square || !cardContainerRef.current) return;

      try {
        const paymentsInstance = await window.Square.payments(applicationId, locationId);
        setPayments(paymentsInstance);

        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach(cardContainerRef.current);
        
        setCard(cardInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Square initialization error:", error);
        setSdkError("Failed to initialize payment form. Please refresh the page.");
        setIsLoading(false);
      }
    }

    initializeSquare();

    return () => {
      mounted = false;
      if (card) {
        card.destroy();
      }
    };
  }, [applicationId, locationId]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onError("Payment form not ready. Please wait or refresh the page.");
      return;
    }

    try {
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === "OK") {
        // Create verification for 3DS / Strong Customer Authentication
        let verificationToken: string | undefined;
        
        try {
          const verificationDetails = {
            amount: (amount / 100).toFixed(2),
            currencyCode: currency,
            intent: "STORE", // We're storing the card for later charge
            billingContact: customerEmail ? { email: customerEmail } : undefined,
          };

          const verificationResult = await payments.verifyBuyer(
            tokenResult.token,
            verificationDetails
          );

          if (verificationResult) {
            verificationToken = verificationResult.token;
          }
        } catch (verifyError) {
          // Verification is optional, proceed without it
          console.log("Verification skipped:", verifyError);
        }

        onPaymentComplete(tokenResult.token, verificationToken);
      } else {
        const errorMessage = tokenResult.errors?.[0]?.message || "Failed to process card";
        onError(errorMessage);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError("An error occurred while processing your payment. Please try again.");
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency,
    }).format(cents / 100);
  };

  if (sdkError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{sdkError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Payment Details</h3>
      </div>

      <div className="bg-muted/50 border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-4">
          <Lock className="w-4 h-4 inline mr-1" />
          Your card will be authorized for {formatAmount(amount)} to hold your appointment. 
          You will only be charged after service completion.
        </p>

        {isLoading ? (
          <div className="h-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : (
          <div
            ref={cardContainerRef}
            id="card-container"
            className="min-h-[50px]"
          />
        )}
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading || isProcessing || !card}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Confirm & Hold {formatAmount(amount)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secured by Square. Your payment information is encrypted.
      </p>
    </div>
  );
}
