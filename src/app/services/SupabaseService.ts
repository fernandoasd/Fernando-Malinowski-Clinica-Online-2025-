import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
from(arg0: string) {
    throw new Error('Method not implemented.');
  }
  supabase: SupabaseClient<any, "public", any>;


  constructor() {
    this.supabase = createClient(
      "https://tyuiwfpujqzeaxbhaprw.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWl3ZnB1anF6ZWF4YmhhcHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MjQxNjgsImV4cCI6MjA2NTAwMDE2OH0.FkFNqhsuxFLKPy5bBCc6TnJhTql70jqShIIA1MRWr1Q"
    );
  }
}
