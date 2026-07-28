"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { createReviewSchema, CreateReviewInput } from "@/lib/validations/review";
import { useCreateReview } from "@/hooks/api/use-reviews";
import { ApiError } from "@/lib/types";

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: string;
  propertyId: string;
}

export function LeaveReviewModal({ isOpen, onClose, rentalId, propertyId }: LeaveReviewModalProps) {
  const { mutate, isPending } = useCreateReview();
  const [errorMsg, setErrorMsg] = useState("");
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      propertyId,
      rating: 0,
      comment: "",
    }
  });

  const onSubmit = (data: CreateReviewInput) => {
    setErrorMsg("");
    mutate(data, {
      onSuccess: () => {
        toast.success("Review submitted successfully!");
        reset();
        onClose();
      },
      onError: (err: ApiError) => {
        if (err.statusCode === 409) {
          setErrorMsg("You have already reviewed this property.");
          toast.error("You have already reviewed this property.");
        } else if (err.statusCode === 403) {
          setErrorMsg("You must complete your stay before leaving a review.");
          toast.error("You must complete your stay before leaving a review.");
        } else {
          setErrorMsg(err.message || "Failed to submit review.");
          toast.error("Failed to submit review.");
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        reset();
        setErrorMsg("");
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience at this property with other users.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Your Rating</label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRating 
                  rating={field.value} 
                  onRatingChange={field.onChange} 
                  className="scale-125 origin-left"
                  interactive
                />
              )}
            />
            {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Comment</label>
            <Textarea 
              placeholder="What was your experience like?" 
              {...register("comment")}
              className={`resize-none h-32 ${errors.comment ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
