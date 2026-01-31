"use client";

import { toast } from "sonner";
import { parseErrorResponse } from "@/lib/api/utils/parseError";

/**
 * Shows an error toast from an unknown error (Response, Error, or string).
 */
export async function errorToaster(error: unknown): Promise<void> {
  const message = await parseErrorResponse(error);
  toast.error(message);
}
