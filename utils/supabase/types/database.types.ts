// Temporary stub types for Supabase until generated types are available.
// Replace this file by running the Supabase CLI when you have access:
// npx supabase gen types typescript --project-id <PROJECT_ID> --schema public > neo_client/utils/supabase/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Root database type used by supabase-js generic. Keep as any for now.
export type Database = any;

// Helpers used widely across the app. Keep as permissive aliases.
export type Tables<TName extends string = string> = any;
export type TablesInsert<TName extends string = string> = any;
export type TablesUpdate<TName extends string = string> = any;
export type Enums<TName extends string = string> = any;

// Project-specific enum alias used in UI. Keep broad until real types are generated.
export type Category = string;
