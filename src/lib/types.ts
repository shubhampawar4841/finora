export interface Client {
    client_id: number;
    name: string;
    email: string;
    phone: string;
    kyc_status: "verified" | "pending" | "rejected";
    kyc_verified_at: string | null;
    risk_profile: "Aggressive" | "Moderate" | "Conservative" | "High";
    ra_id: number; // Risk Assessment ID
    rm_id: number; // Relationship Manager ID
    current_plan_id: number;
    status: "active" | "inactive";
    last_active_at: string;
    created_at: string;
    updated_at: string;
    rm_name: string;
    rm_email: string;
    plan_name: string;
    days_to_renewal: number | null;
  }
  
  export interface RelationshipManager {
    id: number;
    name: string;
  }