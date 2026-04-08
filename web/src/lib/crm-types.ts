/** Pipeline stages for manual kitchen leads in the owner portal. */
export type CrmLeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "on_hold";

/** One row in `content/crm-leads.json` — entered by Ethan only (not auto from Pantry). */
export type CrmLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string | null;
  phone: string | null;
  /** Interest: e.g. full kitchen, island refresh, cottage. */
  projectNote: string | null;
  /** Next follow-up reminder text. */
  nextStep: string | null;
  status: CrmLeadStatus;
  /** e.g. referral, website, showroom, Instagram */
  source: string | null;
};

export const CRM_LEAD_STATUSES: CrmLeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "on_hold",
];
