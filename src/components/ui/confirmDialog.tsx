import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  loading: boolean;
  onClick: () => Promise<void>;
  triggerText: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  driverId?: string;
  variantButton?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  loading,
  onClick,
  description,
  title,
  triggerText,
  icon,
  driverId,
  variantButton,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button id={driverId} type="button" className="" variant={variantButton || "ghost"} loading={loading}>
          {icon}
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
