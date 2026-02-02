/**
 * Parses error messages from backend Response objects or Error instances
 * Supports various error formats:
 * - { message: "..." }
 * - { detail: "..." }
 * - { field_name: ["error1", "error2"] } (validation errors)
 * - { non_field_errors: ["error1", "error2"] }
 * - 500/5xx: shows a user-friendly server error message
 */

const SERVER_ERROR_MESSAGE = "Server error. Please try again later."

export async function parseErrorResponse(
  error: unknown,
  defaultMessage: string = "An error occurred"
): Promise<string> {
  // Handle Response objects (from fetch/proxyFetch)
  if (error instanceof Response) {
    const isServerError = error.status >= 500
    try {
      const errorData = await error.clone().json();
      
      // Try common error message fields
      if (typeof errorData.message === "string") {
        return errorData.message;
      }
      
      if (typeof errorData.detail === "string") {
        return errorData.detail;
      }
      
      // Handle validation errors (field-specific)
      const fieldErrors: string[] = [];
      
      // Check for non_field_errors (common in Django REST framework)
      if (Array.isArray(errorData.non_field_errors)) {
        fieldErrors.push(...errorData.non_field_errors);
      }
      
      // Check for field-specific errors
      Object.keys(errorData).forEach((key) => {
        if (key !== "non_field_errors" && Array.isArray(errorData[key])) {
          const fieldName = key.replace(/_/g, " ");
          const errors = errorData[key]
            .map((err: string) => `${fieldName}: ${err}`)
            .join(", ");
          fieldErrors.push(errors);
        } else if (key !== "non_field_errors" && typeof errorData[key] === "string") {
          const fieldName = key.replace(/_/g, " ");
          fieldErrors.push(`${fieldName}: ${errorData[key]}`);
        }
      });
      
      if (fieldErrors.length > 0) {
        return fieldErrors.join(". ");
      }

      // 500/5xx with unknown JSON shape: show friendly message instead of raw JSON
      if (isServerError && Object.keys(errorData).length > 0) {
        return SERVER_ERROR_MESSAGE;
      }

      // Try to get error text if JSON parsing worked but no known format
      if (Object.keys(errorData).length > 0) {
        return JSON.stringify(errorData);
      }
    } catch {
      // If JSON parsing fails, try to get text
      try {
        const text = await error.clone().text();
        if (text && !isServerError) {
          return text;
        }
      } catch {
        // Fall through to default message
      }
    }

    // 500/5xx: show user-friendly message instead of raw status/text
    if (isServerError) {
      return SERVER_ERROR_MESSAGE
    }

    // Fallback to status text if available
    return error.statusText || defaultMessage;
  }
  
  // Handle Error instances
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }
  
  // Default fallback
  return defaultMessage;
}
