import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = {
  success: "bg-green-500 text-white border-green-600",
  error: "bg-red-500 text-white border-red-600",
  warning: "bg-yellow-500 text-black border-yellow-600",
  info: "bg-blue-500 text-white border-blue-600",
};

const iconVariants = {
  success: <CheckCircle className="h-5 w-5 text-white" />,
  error: <XCircle className="h-5 w-5 text-white" />,
  warning: <AlertTriangle className="h-5 w-5 text-black" />,
  info: <Info className="h-5 w-5 text-white" />,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(
        ({ id, title, description, action, variant = "info", ...props }) => (
          <Toast
            key={id}
            className={cn("border-l-4", toastVariants[variant])}
            {...props}
          >
            <div className="flex items-center gap-3">
              {iconVariants[variant]}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-white hover:text-gray-200" />
          </Toast>
        )
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
