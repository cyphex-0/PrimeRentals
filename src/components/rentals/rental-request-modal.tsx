"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRentalRequestSchema, CreateRentalRequestInput } from "@/lib/validations/rental";
import { useCreateRentalRequest } from "@/hooks/api/use-rentals";

interface RentalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export function RentalRequestModal({ isOpen, onClose, propertyId }: RentalRequestModalProps) {
  const { mutate, isPending } = useCreateRentalRequest();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateRentalRequestInput>({
    resolver: zodResolver(createRentalRequestSchema),
    defaultValues: {
      propertyId,
    }
  });

  const onSubmit = (data: CreateRentalRequestInput) => {
    const payload = { ...data };
    
    // Default to 1 year lease if no move-out date is provided
    if (!payload.moveOutDate) {
      const moveIn = new Date(payload.moveInDate);
      moveIn.setFullYear(moveIn.getFullYear() + 1);
      payload.moveOutDate = moveIn.toISOString().split("T")[0];
    }

    mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Rent</DialogTitle>
          <DialogDescription>
            Submit your move-in date and a message to the landlord. You can leave the move-out date blank for an open-ended lease.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <input type="hidden" {...register("propertyId")} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Move-in Date <span className="text-destructive">*</span></label>
              <Input 
                type="date" 
                {...register("moveInDate")}
                className={errors.moveInDate ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.moveInDate && <p className="text-xs text-destructive">{errors.moveInDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Move-out Date <span className="text-muted-foreground font-normal">(Optional)</span></label>
              <Input 
                type="date" 
                {...register("moveOutDate")}
                className={errors.moveOutDate ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.moveOutDate && <p className="text-xs text-destructive">{errors.moveOutDate.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (Optional)</label>
            <Textarea 
              placeholder="Hi, I'm interested in renting your property. I have a stable income and a clean rental history..." 
              {...register("message")}
              className={`resize-none h-32 ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
          
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
