# REAL ESTATE DISTRIBUTION NETWORK
## Master Business + Product + Technical Specification for Codex

> **Document type:** Product constitution / implementation blueprint  
> **Primary market:** Colombia  
> **Product model:** Managed real-estate distribution network with centralized inventory and distributed sellers  
> **Status:** MVP → scalable SaaS/internal platform  
> **Language:** Spanish UI by default  
> **Currency:** COP by default, multi-currency ready  
> **Timezone:** America/Bogota  
> **Core principle:** The platform owns the commercial workflow and traceability. Sellers do not own the property relationship, the lead database, or the closing workflow.

---

# 0. CODEX EXECUTION INSTRUCTIONS

Codex must treat this document as the source of truth.

## Rules

1. Do not reduce the system to a basic property-listing CRUD.
2. Preserve the separation between:
   - owners,
   - properties,
   - sellers,
   - buyers/leads,
   - appointments,
   - offers,
   - transactions,
   - commissions,
   - documents,
   - audit events.
3. Every sensitive action must be auditable.
4. Property-owner contact data must never be exposed to unauthorized sellers.
5. Sellers must only access information allowed by their role and the property disclosure policy.
6. Every buyer must be attributable to a seller, source, campaign, or platform-generated lead.
7. Commission calculations must be reproducible from stored rules; never store only a final number.
8. Financial calculations must use decimal/numeric types, never floating point.
9. All state changes that affect commission attribution must create immutable audit events.
10. Never hard-delete business-critical entities such as properties, leads, appointments, offers, deals, commissions, documents, or audit events.
11. Use soft deletion / archival when appropriate.
12. Build server-side authorization. Hiding a button in the frontend is not access control.
13. Sensitive documents must use private storage and signed URLs.
14. Keep legal text configurable in the admin panel rather than hard-coding contractual wording into application logic.
15. Build a modular monolith first. Do not prematurely split into microservices.
16. The implementation must include tests for authorization, commission attribution, duplicate leads, appointment access, owner-data masking, and state transitions.

---

# 1. BUSINESS THESIS

The company operates a centralized real-estate inventory and a distributed commercial network.

The company signs commercial/intermediation agreements with property owners, verifies the property, creates a structured listing, establishes the commercial conditions and places the asset into a private inventory.

Approved sellers/realtors can access that inventory and market eligible properties to prospective buyers.

The platform centralizes:

- owner relationships,
- inventory,
- buyer registration,
- lead attribution,
- appointments,
- property visits,
- offers,
- negotiation,
- transaction progress,
- commissions,
- compliance documents,
- communications,
- audit history.

The seller's main job is:

1. identify or receive a prospective buyer;
2. qualify the buyer;
3. select suitable properties;
4. register the buyer in the platform;
5. schedule the visit;
6. conduct or accompany the showing according to platform rules;
7. register feedback;
8. route offers through the platform;
9. assist until closing;
10. receive the commission assigned to the transaction.

The seller must not be able to bypass the company by privately dealing with the owner or transferring the company's inventory to a third-party brokerage.

---

# 2. BUSINESS POSITIONING

The product is not only an "inmobiliaria".

It should be positioned operationally as a:

**Real Estate Distribution Network**

Value proposition for owners:

> One commercial relationship can activate a large network of approved sellers without the owner needing to manage each seller independently.

Value proposition for sellers:

> Access verified inventory without having to prospect for every property from zero.

Value proposition for buyers:

> One advisor can search a broader inventory and coordinate the process through a centralized platform.

Value proposition for founders:

> Centralized ownership of data, inventory, commercial rules, lead attribution and closing traceability.

---

# 3. BUSINESS ACTORS

## 3.1 Founders / Super Admins

The two founders retain ultimate control of:

- platform configuration;
- user approvals;
- owner relationships;
- inventory publication;
- commission rules;
- sensitive property data;
- legal templates;
- deal approval;
- payment approval;
- access revocation;
- audit review.

No regular administrator may modify founder permissions.

---

## 3.2 Operations Admin

Can:

- create and verify owners;
- create/edit properties;
- review documents;
- approve listings;
- manage appointments;
- manage offers;
- update transaction milestones;
- communicate with owners and sellers;
- review leads.

Cannot:

- modify founder-level security;
- erase audit logs;
- change historical commission attribution after a deal is locked without elevated approval.

---

## 3.3 Commercial Manager

Can:

- supervise sellers;
- assign platform leads;
- see seller pipelines;
- see commercial KPIs;
- approve seller onboarding when authorized;
- review follow-up activity;
- reassign abandoned leads subject to attribution rules.

---

## 3.4 Seller / Realtor / Commercial Partner

Can:

- browse eligible inventory;
- see public/commercial property data;
- see the commission opportunity;
- register buyers;
- save favorites;
- create matching lists;
- request/schedule visits;
- submit visit feedback;
- submit offers;
- follow assigned transactions;
- see own commissions;
- upload required documents;
- access training/resources.

Cannot:

- see unrestricted owner contact information;
- modify property legal data;
- alter commission rules;
- view another seller's private lead details;
- export the entire owner database;
- access confidential admin notes;
- delete audit records;
- settle commissions.

---

## 3.5 Team Leader

Optional phase.

Can:

- invite/manage approved team members;
- see team performance;
- receive override commission if enabled;
- distribute internally assigned leads.

Must not automatically gain owner-sensitive information.

---

## 3.6 Property Capturer / Listing Originator

May be a seller or separate role.

Can submit a prospective property to the company.

If the property is accepted and contracted, attribution is recorded.

Possible compensation:

- fixed acquisition fee;
- percentage of company commission;
- percentage only if property sells;
- hybrid.

---

## 3.7 Property Owner

Initially does not require full platform access.

Phase 2 owner portal:

- property status;
- approved visit schedule;
- offers;
- document requests;
- transaction milestones;
- statements.

Owner never sees private seller lead databases.

---

## 3.8 Buyer / Lead

A person interested in one or more properties.

May originate from:

- seller;
- website;
- WhatsApp;
- Meta Ads;
- Google Ads;
- referral;
- organic;
- partner;
- manual admin entry.

Every lead must have a source and attribution history.

---

# 4. LEGAL AND COMMERCIAL FRAMEWORK

> This section is a product/compliance design requirement and does not replace review by a Colombian attorney.

The commercial model should be documented using agreements appropriate for brokerage/intermediation.

Colombian commercial law recognizes the figure of the broker/intermediary under the Commercial Code, including the concept of putting parties in relation for a commercial transaction.

The platform must support configurable legal documents, including:

1. Property Intermediation / Brokerage Agreement.
2. Exclusive Brokerage Agreement, if used.
3. Non-exclusive Brokerage Agreement, if used.
4. Seller Commercial Collaboration Agreement.
5. Confidentiality Agreement.
6. Non-circumvention / No-bypass clause.
7. Lead and portfolio protection clause.
8. Data processing authorization.
9. Privacy Policy.
10. Platform Terms of Use.
11. Electronic acceptance evidence.
12. Commission settlement statement.
13. Property visit acknowledgement.
14. Offer submission acknowledgement.
15. Document delivery acknowledgement.
16. Optional team leader agreement.
17. Optional property-capture agreement.

Avoid relying only on a broad non-compete clause. The operating system should primarily protect the company through:

- confidentiality;
- non-circumvention;
- property and client attribution;
- restricted disclosure;
- contractual portfolio protection;
- audit logs;
- controlled owner communications.

Personal-data handling must support consent evidence, restricted access and appropriate security controls.

The compliance module must also be designed to support future AML/FT due-diligence requirements, risk flags and document collection as the company grows or becomes subject to applicable obligations.

---

# 5. CORE BUSINESS POLICIES

## 5.1 No property enters active inventory without

- identified owner;
- owner identity/KYC checklist;
- property identification;
- verified authority to commercialize;
- commercial agreement accepted/signed;
- agreed asking price;
- commission structure;
- publication authorization;
- minimum required documents;
- internal property owner assigned.

---

## 5.2 No property should expose all data to sellers by default

Property fields have disclosure levels:

### PUBLIC
Visible on public website.

Examples:
- city;
- general sector;
- property type;
- price;
- area;
- rooms;
- bathrooms;
- selected photos.

### SELLER
Visible to approved sellers.

Examples:
- internal property code;
- commission opportunity;
- showing instructions;
- additional media;
- availability.

### APPOINTMENT_UNLOCKED
Visible only after approved appointment.

Examples:
- exact address;
- access instructions;
- meeting point.

### ADMIN_ONLY
Never exposed to normal sellers.

Examples:
- owner personal phone;
- owner email;
- identity documents;
- internal price floor;
- internal negotiation notes;
- legal review notes;
- bank details;
- sensitive documents.

---

# 6. PROPERTY LIFECYCLE

State machine:

DRAFT
→ OWNER_VERIFICATION
→ DOCUMENT_REVIEW
→ COMMERCIAL_REVIEW
→ READY_FOR_APPROVAL
→ ACTIVE
→ TEMPORARILY_UNAVAILABLE
→ UNDER_OFFER
→ RESERVED
→ PROMISE_SIGNED
→ CLOSING
→ SOLD

Alternate terminal states:

- WITHDRAWN
- EXPIRED
- REJECTED
- ARCHIVED

Rules:

- only approved roles may transition to ACTIVE;
- SOLD requires a linked transaction;
- RESERVED must identify the buyer and seller attribution;
- owner contact information does not change disclosure state merely because a property becomes active;
- every state transition creates an audit event.

---

# 7. PROPERTY RECORD

Each property must contain:

## Identity

- internal ID;
- human-readable code;
- title;
- property type;
- transaction type;
- status;
- assigned operations manager.

## Location

- country;
- department/state;
- city;
- neighborhood/sector;
- approximate map location;
- exact address;
- latitude;
- longitude;
- address disclosure policy.

## Physical attributes

- total area;
- built area;
- bedrooms;
- bathrooms;
- parking spaces;
- floor;
- strata;
- year built;
- furnished;
- administration fee;
- amenities;
- property features.

## Commercial

- asking price;
- minimum authorized negotiating threshold;
- currency;
- owner commission rate;
- owner commission fixed amount;
- seller payout rule;
- capturer payout rule;
- team leader override;
- tax/VAT flags if relevant;
- commission visibility.

## Media

- cover image;
- gallery;
- video;
- 360 tour;
- floor plan;
- brochure;
- seller-safe media package.

## Sensitive

- owner;
- title/matricula data;
- deed information;
- tax/property documents;
- legal notes;
- bank/settlement data.

## Marketing

- public slug;
- SEO title;
- SEO description;
- channels;
- publication status;
- featured flag;
- public description;
- seller description.

---

# 8. OWNER MANAGEMENT

Owner profile:

- person/company type;
- legal name;
- identification type;
- identification;
- phone;
- email;
- address;
- KYC status;
- source;
- assigned relationship manager;
- consent status;
- notes;
- documents;
- properties;
- agreements;
- transaction history.

Required capability:

One owner can own multiple properties.

One property can have multiple owners.

Therefore implement:

`owners <-> property_owners <-> properties`

with:

- ownership percentage;
- signatory status;
- authority status;
- primary contact flag.

---

# 9. SELLER ONBOARDING

Seller onboarding stages:

APPLIED
→ IDENTITY_PENDING
→ DOCUMENT_PENDING
→ AGREEMENT_PENDING
→ TRAINING_PENDING
→ REVIEW
→ ACTIVE

Possible states:

- SUSPENDED
- REJECTED
- TERMINATED

Required onboarding information:

- full name;
- identification;
- mobile;
- email;
- city;
- profile photo;
- bank payout details;
- tax information if required;
- experience;
- referral source;
- team affiliation;
- documents;
- agreement acceptance;
- confidentiality acceptance;
- data-processing authorization.

Admin must approve seller before inventory access.

---

# 10. SELLER PORTAL

Primary navigation:

1. Dashboard
2. Properties
3. My Clients
4. Matches
5. Appointments
6. Offers
7. Deals
8. Commissions
9. Property Capture
10. Training
11. Documents
12. Notifications
13. Profile

---

# 11. SELLER DASHBOARD

Metrics:

- active properties;
- new properties this week;
- registered leads;
- leads needing follow-up;
- appointments today;
- appointments this week;
- offers submitted;
- negotiations;
- active deals;
- sales closed;
- gross commissions earned;
- payable commissions;
- paid commissions;
- conversion rate;
- average days to close.

Widgets:

- upcoming appointments;
- hot properties;
- newly listed;
- high commission;
- leads without activity;
- recent activity;
- pending compliance tasks.

---

# 12. INVENTORY SEARCH

Filters:

- city;
- neighborhood;
- property type;
- price range;
- area range;
- bedrooms;
- bathrooms;
- parking;
- strata;
- amenities;
- new/used;
- furnished;
- seller commission;
- availability;
- exclusive listings;
- recently added.

Sort:

- newest;
- price ascending;
- price descending;
- highest seller commission;
- most viewed;
- most requested;
- recommended match score.

Sellers may create saved searches.

---

# 13. LEAD / BUYER CRM

A lead must have:

- name;
- phone;
- email;
- document ID only when justified;
- source;
- original seller;
- currently assigned seller;
- stage;
- budget;
- desired locations;
- desired property types;
- bedrooms;
- bathrooms;
- financing status;
- purchase timeline;
- notes;
- tags;
- consent evidence;
- created_at;
- last_contact_at.

Pipeline:

NEW
→ CONTACTED
→ QUALIFIED
→ PROPERTY_MATCHED
→ APPOINTMENT
→ VISITED
→ OFFER
→ NEGOTIATION
→ RESERVED
→ CLOSING
→ WON

Alternative:

- LOST
- DORMANT
- INVALID
- DUPLICATE

---

# 14. LEAD ATTRIBUTION

This is one of the most important modules.

Each lead stores:

- `origin_source`
- `origin_seller_id`
- `current_seller_id`
- `origin_campaign_id`
- `first_touch_at`
- `protection_start_at`
- `protection_expires_at`
- `attribution_status`

Attribution history must be append-only.

Example:

Lead created by Seller A.
Seller A has protection for configurable N days.
Lead later contacts website directly.
The system recognizes the phone/email match.
Lead remains attributed according to policy unless an authorized administrator changes it.

A reassignment never deletes the original attribution.

---

# 15. DUPLICATE LEAD ENGINE

Normalize:

- phone numbers to E.164;
- email lowercase/trimmed;
- optional document identifier;
- WhatsApp identity if available.

On registration:

1. check exact phone;
2. check exact email;
3. check document if stored;
4. search active protection windows;
5. return one of:
   - NEW;
   - DUPLICATE_SAME_SELLER;
   - DUPLICATE_OTHER_SELLER;
   - EXISTING_PLATFORM_LEAD;
   - ADMIN_REVIEW_REQUIRED.

Seller must not be shown another seller's private data during duplicate checking.

Return only safe messages such as:

> Este contacto ya se encuentra registrado y tiene protección comercial activa. Solicita revisión si consideras que existe un error.

---

# 16. BUYER REQUIREMENTS + PROPERTY MATCHING

A buyer profile can define:

- maximum budget;
- minimum area;
- cities;
- neighborhoods;
- property types;
- bedrooms;
- bathrooms;
- parking;
- amenities;
- financing;
- urgency.

MVP matching:

weighted deterministic score.

Example:

- price fit: 30 points;
- city/neighborhood: 25;
- property type: 15;
- rooms: 10;
- area: 10;
- parking: 5;
- amenities: 5.

Return score 0–100.

Later AI can improve semantic matching, but the initial algorithm must remain explainable.

---

# 17. APPOINTMENT / SHOWING SYSTEM

Appointment states:

REQUESTED
→ PENDING_CONFIRMATION
→ CONFIRMED
→ CHECKED_IN
→ COMPLETED

Other states:

- REJECTED
- CANCELLED_BY_BUYER
- CANCELLED_BY_SELLER
- CANCELLED_BY_OWNER
- NO_SHOW
- RESCHEDULED

Appointment includes:

- property;
- lead;
- seller;
- requested time;
- confirmed time;
- attendees;
- admin owner;
- notes;
- disclosure unlock timestamps;
- check-in;
- check-out;
- feedback;
- follow-up task.

Exact address is exposed according to property disclosure rules and only after required approval.

---

# 18. VISIT SECURITY

For sensitive properties support:

- exact address hidden before confirmation;
- address visible X hours before visit;
- expiring address reveal;
- seller-specific watermark on brochure/media;
- visit code;
- QR check-in;
- optional GPS confirmation;
- visit log;
- owner notification.

Do not expose owner phone simply because a visit exists.

If seller-owner direct coordination is necessary, use:

- platform relay;
- masked communication;
- controlled WhatsApp workflow;
- admin-mediated group.

---

# 19. OFFER MANAGEMENT

Offer contains:

- property;
- buyer;
- seller;
- offer amount;
- payment method;
- financing amount;
- down payment;
- contingencies;
- proposed closing date;
- expiration;
- supporting documents;
- notes;
- timestamp;
- status.

Status:

DRAFT
→ SUBMITTED
→ ADMIN_REVIEW
→ PRESENTED_TO_OWNER
→ COUNTERED
→ ACCEPTED
→ REJECTED
→ EXPIRED
→ WITHDRAWN

All counteroffers need version history.

Never overwrite old terms.

---

# 20. DEAL / TRANSACTION MANAGEMENT

A deal is created once commercial conditions justify formal tracking.

Deal stages:

OPEN
→ TERMS_ACCEPTED
→ DUE_DILIGENCE
→ RESERVATION
→ PROMISE
→ FINANCING
→ NOTARY_PREPARATION
→ SIGNING
→ FUNDS_PENDING
→ CLOSED_WON

Alternative:

- CLOSED_LOST
- CANCELLED

Checklist examples:

- buyer identity;
- source of funds / financing;
- owner documents;
- title review;
- taxes;
- administration status;
- reservation;
- promise;
- bank approval;
- notary;
- deed;
- registration;
- commission invoice;
- settlement.

---

# 21. COMMISSION ENGINE

Never encode commission as a single opaque final amount.

Store the rule and its snapshot.

## Commission sources

Possible owner agreement:

- percentage of sale price;
- fixed amount;
- percentage with minimum;
- hybrid.

## Distribution

Example:

Gross sale price: 500,000,000 COP  
Gross brokerage: 3% = 15,000,000 COP

Distribution rule:

- Company: 55%
- Seller: 35%
- Capturer: 5%
- Team override: 5%

The engine should support:

### Percent split

`beneficiary_amount = distributable_commission * split_rate`

### Fixed seller payout

Property advertises:

`Seller commission: 5,000,000 COP`

### Hybrid

Seller receives:

`max(fixed_amount, percentage_amount)` or another configured rule.

### Tiered seller plans

Example:

- STANDARD: 30%
- PRO: 35%
- ELITE: 40%

Do not retroactively change a deal if the seller changes plan after attribution lock.

Snapshot the payout terms when the deal reaches the configured locking event.

---

# 22. COMMISSION STATES

CALCULATED
→ PENDING_CLOSE
→ EARNED
→ APPROVED
→ PAYABLE
→ PAID

Other:

- HELD
- DISPUTED
- CANCELLED
- ADJUSTED

Commission record needs:

- deal_id;
- beneficiary_type;
- beneficiary_id;
- basis;
- rule_snapshot;
- gross_amount;
- deductions;
- net_amount;
- currency;
- status;
- invoice/document references;
- approval metadata;
- payment reference;
- paid_at.

---

# 23. COMMISSION DISPUTES

A seller can open a dispute.

Dispute contains:

- commission;
- reason;
- evidence;
- comment thread;
- decision;
- decision author;
- timestamps.

Historical values remain immutable.

Adjustments create separate accounting entries.

---

# 24. PROPERTY CAPTURE MODULE

Seller clicks:

`CAPTAR PROPIEDAD`

Fields:

- owner name;
- phone;
- email;
- city;
- neighborhood;
- property type;
- approximate value;
- relationship context;
- notes;
- photos optional.

System checks duplicates.

Submission states:

SUBMITTED
→ CONTACT_PENDING
→ CONTACTED
→ QUALIFIED
→ AGREEMENT_PENDING
→ WON
→ PROPERTY_CREATED

Other:

- REJECTED
- DUPLICATE
- LOST

Capture attribution is preserved after property creation.

---

# 25. PUBLIC WEBSITE

Public site modules:

- Home;
- Property Search;
- Property Detail;
- Sell Your Property;
- Become a Seller;
- Contact;
- Legal;
- Privacy;
- Terms.

Public property page must never leak:

- owner phone;
- owner email;
- internal negotiation floor;
- private documents;
- seller-private notes.

Lead form:

- name;
- phone;
- email;
- message;
- preferred contact method;
- consent checkbox.

Lead automatically enters CRM.

---

# 26. LEAD ROUTING

Platform-generated leads can be routed by:

- round robin;
- city;
- seller availability;
- property specialization;
- performance;
- team;
- manual admin assignment.

Configurable SLA:

Example:

Seller has 15 minutes to accept a hot lead.

If not accepted:

→ route to next eligible seller.

Preserve assignment history.

---

# 27. COMMUNICATIONS

Channels:

- in-app;
- email;
- WhatsApp integration;
- optional SMS;
- push notifications later.

Event examples:

- new property;
- appointment requested;
- appointment confirmed;
- appointment reminder;
- offer updated;
- lead assigned;
- deal milestone;
- commission earned;
- compliance document expiring.

Template system required.

---

# 28. TASKS AND FOLLOW-UP

Tasks can belong to:

- lead;
- property;
- owner;
- appointment;
- offer;
- deal;
- seller.

Fields:

- title;
- type;
- assignee;
- due date;
- priority;
- status;
- reminder;
- relation.

CRM should surface overdue tasks.

---

# 29. DOCUMENT MANAGEMENT

Document types:

## Owner
- identity;
- authorization;
- brokerage agreement;
- consent;
- tax/legal documents.

## Property
- title certificate;
- deed;
- property tax;
- administration status;
- plans;
- permits;
- other legal documents.

## Seller
- identity;
- commercial agreement;
- NDA/confidentiality;
- payout docs;
- training certifications.

## Buyer/Deal
- offer;
- financing;
- reservation;
- promise;
- settlement;
- closing docs.

Document metadata:

- type;
- entity;
- version;
- uploaded_by;
- uploaded_at;
- expires_at;
- visibility;
- checksum;
- storage key;
- status.

Storage must be private by default.

Use short-lived signed URLs.

---

# 30. E-SIGNATURE / ACCEPTANCE EVIDENCE

MVP may support:

- clickwrap acceptance;
- document hash;
- user ID;
- timestamp;
- IP;
- user agent;
- version of terms;
- acceptance log.

Later integrate a qualified third-party e-sign provider if desired.

Never silently replace a document version after signature.

---

# 31. ADMIN PANEL

Navigation:

1. Executive Dashboard
2. Properties
3. Owners
4. Sellers
5. Teams
6. Leads
7. Appointments
8. Offers
9. Deals
10. Commissions
11. Property Captures
12. Documents
13. Compliance
14. Notifications
15. Reports
16. Users & Roles
17. Audit Logs
18. Configuration
19. Legal Templates
20. Integrations

---

# 32. EXECUTIVE DASHBOARD

KPIs:

- active inventory value;
- active properties;
- new properties;
- properties under offer;
- sold this month;
- gross sales volume;
- gross brokerage revenue;
- net company revenue;
- pending commissions;
- paid commissions;
- active sellers;
- productive sellers;
- seller activation rate;
- leads;
- qualified leads;
- visits;
- offers;
- close rate;
- average days on market;
- average days lead-to-visit;
- average days offer-to-close.

Funnels:

### Property funnel
Captured → Contracted → Active → Visited → Offer → Sold

### Buyer funnel
Lead → Qualified → Visit → Offer → Reserved → Closed

### Seller funnel
Applied → Approved → Active → First lead → First visit → First sale

---

# 33. ANTI-BYPASS / ANTI-CIRCUMVENTION SYSTEM

Use both contractual and technical controls.

## Technical controls

1. Owner contact masking.
2. Sensitive address disclosure policies.
3. Per-user document permissions.
4. Watermarked marketing material.
5. Immutable viewing logs for sensitive assets.
6. Lead registration before showing.
7. Duplicate lead checks.
8. Visit records.
9. Offer routing through platform.
10. Commission attribution snapshots.
11. Export restrictions.
12. Rate limits.
13. anomaly detection for excessive property scraping.
14. device/session logs.
15. account suspension tooling.

## Audit events

Log:

- property viewed;
- sensitive field revealed;
- document opened/downloaded;
- lead created;
- duplicate check;
- appointment created;
- address revealed;
- offer submitted;
- owner data accessed;
- deal changed;
- commission changed;
- permission changed;
- export created.

---

# 34. SECURITY MODEL

Authentication:

- email/password or passwordless;
- MFA for admins;
- optional MFA for sellers;
- session management;
- email verification;
- password reset;
- suspicious login alert.

Authorization:

Use RBAC + selected ABAC rules.

RBAC roles:

- SUPER_ADMIN
- ADMIN
- OPERATIONS
- COMMERCIAL_MANAGER
- SELLER
- TEAM_LEADER
- FINANCE
- COMPLIANCE
- SUPPORT
- OWNER_PORTAL

ABAC examples:

- seller can only view own lead details;
- team leader can view team metrics but not necessarily full PII;
- exact address only if appointment condition passes;
- finance can see commission and payout data but not alter property legal documents.

---

# 35. DATA PRIVACY

Implement:

- explicit consent records;
- privacy policy versioning;
- purpose tracking;
- restricted access;
- deletion/anonymization workflows where legally permitted;
- data subject request workflow;
- export of personal data;
- consent withdrawal flags;
- retention rules;
- access logs.

Do not expose personal data through public URLs.

---

# 36. AML / RISK READINESS

The system should support, even if not all features are mandatory on day one:

- identity verification status;
- beneficial owner records for legal entities;
- risk level;
- source-of-funds notes;
- PEP flag;
- sanctions screening integration hook;
- unusual transaction flag;
- cash payment flag;
- compliance review;
- compliance case;
- internal notes;
- audit trail.

Do not make automated accusations.

Flags should create a review workflow.

---

# 37. DATABASE ARCHITECTURE

Recommended database: PostgreSQL.

Use UUID primary keys.

Essential tables:

## Identity
- users
- roles
- permissions
- user_roles
- sessions
- user_profiles

## Seller network
- seller_profiles
- seller_status_history
- seller_agreements
- teams
- team_members
- seller_tiers

## Owners
- owners
- owner_contacts
- property_owners
- owner_agreements

## Properties
- properties
- property_locations
- property_features
- property_media
- property_documents
- property_status_history
- property_disclosure_rules
- property_publications
- property_commission_rules

## Leads
- leads
- lead_contacts
- lead_preferences
- lead_attributions
- lead_status_history
- lead_tags
- lead_tag_links
- lead_property_matches

## Appointments
- appointments
- appointment_attendees
- appointment_status_history
- appointment_feedback

## Offers
- offers
- offer_versions
- offer_documents
- offer_status_history

## Deals
- deals
- deal_participants
- deal_milestones
- deal_checklist_items
- deal_status_history

## Commissions
- commission_rules
- commission_snapshots
- commissions
- commission_adjustments
- commission_payments
- commission_disputes

## Captures
- property_capture_leads
- property_capture_status_history

## Documents
- documents
- document_versions
- document_access_logs
- document_signatures

## Communications
- notifications
- notification_templates
- conversations
- messages
- communication_events

## Work
- tasks
- comments
- attachments

## Compliance
- consent_records
- risk_profiles
- compliance_cases
- compliance_flags

## System
- audit_events
- integration_events
- webhooks
- api_keys
- system_settings
- feature_flags

---

# 38. IMPORTANT DATABASE CONSTRAINTS

1. Unique normalized phone index where business logic permits.
2. Unique normalized email index where appropriate.
3. Property code unique.
4. No commission without linked deal.
5. No seller payout with missing beneficiary.
6. Decimal monetary fields.
7. Foreign keys on all business relations.
8. Audit events append-only.
9. Status history append-only.
10. Unique active attribution logic implemented transactionally.
11. Signed agreement points to immutable document version.
12. Commission snapshot cannot be silently mutated after lock.

---

# 39. SUGGESTED TECH STACK

Build as a modular monolith.

## Frontend / Full-stack
- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui or equivalent accessible component system

## Database
- PostgreSQL

## ORM
- Prisma or Drizzle

## Auth
- Auth.js / Better Auth / managed provider

## Object storage
- S3-compatible private object storage

## Cache / queues
- Redis-compatible service when required

## Background jobs
Use a durable jobs/queue system for:
- reminders;
- image processing;
- notifications;
- document processing;
- webhook retries;
- reports.

## Maps
Provider abstraction:
- Google Maps;
- Mapbox;
- equivalent.

## Email
Provider abstraction.

## WhatsApp
Meta WhatsApp Business Cloud API integration adapter.

## Observability
- structured logs;
- error tracking;
- metrics;
- audit system separate from debugging logs.

---

# 40. REPOSITORY STRUCTURE

```text
/apps
  /web
    /app
    /components
    /features
      /auth
      /properties
      /owners
      /sellers
      /leads
      /appointments
      /offers
      /deals
      /commissions
      /documents
      /compliance
      /admin
    /lib
    /server

/packages
  /database
  /auth
  /ui
  /validation
  /domain
  /permissions
  /notifications
  /storage
  /audit
  /config

/prisma
  schema.prisma
  /migrations
  seed.ts

/docs
  ARCHITECTURE.md
  DATABASE.md
  API.md
  SECURITY.md
  PERMISSIONS.md
  BUSINESS_RULES.md
  DEPLOYMENT.md
  TESTING.md
```

Single-repository implementation preferred.

---

# 41. DOMAIN MODULES

Keep domain logic in explicit services.

Example:

```text
PropertyService
OwnerService
SellerService
LeadService
LeadAttributionService
DuplicateLeadService
MatchingService
AppointmentService
OfferService
DealService
CommissionService
CommissionSnapshotService
DocumentService
DisclosureService
AuditService
NotificationService
ComplianceService
```

Controllers/actions should not contain complicated business rules.

---

# 42. API DESIGN

Use server actions and/or REST API consistently.

Representative endpoints:

## Properties

```text
GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
POST   /api/properties/:id/status
POST   /api/properties/:id/publish
POST   /api/properties/:id/media
GET    /api/properties/:id/disclosure
```

## Leads

```text
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PATCH  /api/leads/:id
POST   /api/leads/check-duplicate
POST   /api/leads/:id/assign
POST   /api/leads/:id/status
GET    /api/leads/:id/matches
```

## Appointments

```text
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments/:id/confirm
POST   /api/appointments/:id/reschedule
POST   /api/appointments/:id/cancel
POST   /api/appointments/:id/check-in
POST   /api/appointments/:id/complete
```

## Offers

```text
POST   /api/offers
GET    /api/offers/:id
POST   /api/offers/:id/submit
POST   /api/offers/:id/counter
POST   /api/offers/:id/accept
POST   /api/offers/:id/reject
```

## Deals

```text
POST   /api/deals
GET    /api/deals/:id
POST   /api/deals/:id/stage
POST   /api/deals/:id/checklist
POST   /api/deals/:id/close
```

## Commissions

```text
GET    /api/commissions
GET    /api/commissions/:id
POST   /api/commissions/calculate
POST   /api/commissions/:id/approve
POST   /api/commissions/:id/pay
POST   /api/commissions/:id/dispute
```

---

# 43. EVENT MODEL

Business events:

```text
property.created
property.activated
property.viewed
property.sensitive_data_revealed
seller.approved
seller.suspended
lead.created
lead.duplicate_detected
lead.assigned
appointment.requested
appointment.confirmed
appointment.completed
offer.submitted
offer.countered
offer.accepted
deal.created
deal.stage_changed
deal.closed
commission.calculated
commission.earned
commission.approved
commission.paid
document.signed
compliance.flag_created
```

Use events for:

- notifications;
- audit;
- analytics;
- integrations.

Do not rely on events alone for core transactional consistency.

---

# 44. AUDIT EVENT FORMAT

Each audit record:

```json
{
  "id": "uuid",
  "actor_user_id": "uuid",
  "actor_role": "SELLER",
  "action": "PROPERTY_ADDRESS_REVEALED",
  "entity_type": "PROPERTY",
  "entity_id": "uuid",
  "metadata": {},
  "ip_address": "masked_or_encrypted_as_policy_requires",
  "user_agent": "...",
  "created_at": "timestamp"
}
```

Audit records should be immutable from normal application functions.

---

# 45. MEDIA WATERMARKING

Seller-safe marketing exports can contain:

- company logo;
- property code;
- seller name or code;
- generated timestamp;
- optional unique sharing ID.

Purpose:

- discourage uncontrolled redistribution;
- identify leaked collateral;
- preserve company branding.

Do not visibly watermark the public website unless desired.

---

# 46. REPORTING

Admin reports:

- properties by city;
- inventory aging;
- owner acquisition source;
- seller productivity;
- seller conversion;
- lead source performance;
- appointment conversion;
- offer conversion;
- revenue;
- commission expense;
- capturer performance;
- team performance;
- lost reasons;
- average transaction cycle;
- projected commissions;
- payable commissions.

Export:

- CSV;
- XLSX later;
- PDF statements later.

All exports must be permission-controlled and logged.

---

# 47. NOTIFICATION RULES

Examples:

### Seller
- new lead assigned;
- appointment confirmed;
- appointment in 24h;
- appointment in 2h;
- buyer follow-up overdue;
- offer response;
- commission earned.

### Admin
- seller application;
- new property capture;
- owner agreement pending;
- appointment request;
- new offer;
- deal milestone delayed;
- compliance flag;
- commission dispute.

### Owner
- visit scheduled;
- visit completed;
- offer received;
- deal milestone.

---

# 48. SEARCH

Global admin search:

- property code;
- owner name;
- owner phone;
- seller;
- buyer;
- buyer phone;
- appointment;
- deal;
- commission.

Seller global search must apply redaction.

---

# 49. PERMISSION MATRIX

| Capability | Super Admin | Admin | Commercial | Seller | Finance | Compliance |
|---|---:|---:|---:|---:|---:|---:|
| View active inventory | Yes | Yes | Yes | Yes | Limited | Limited |
| View owner phone | Yes | Yes | Configurable | No | No | As needed |
| Edit property | Yes | Yes | Limited | No | No | No |
| Register lead | Yes | Yes | Yes | Yes | No | No |
| View all leads | Yes | Yes | Yes | No | Limited | As needed |
| Schedule visit | Yes | Yes | Yes | Yes | No | No |
| Submit offer | Yes | Yes | Yes | Yes | No | No |
| Approve commission | Yes | Configurable | No | No | Yes | No |
| Pay commission | Yes | No | No | No | Yes | No |
| View audit | Yes | Limited | Limited | Own | Limited | Yes |
| Modify permissions | Yes | No | No | No | No | No |

Implement permissions in code, not only in this table.

---

# 50. PLATFORM CONFIGURATION

Admin configuration:

- company name;
- logo;
- currencies;
- default lead protection period;
- duplicate lead policy;
- seller tiers;
- commission presets;
- appointment rules;
- disclosure timing;
- notification templates;
- legal document versions;
- public property settings;
- source list;
- lost reasons;
- deal milestones;
- feature flags.

---

# 51. BUSINESS UNIT ECONOMICS

Track per deal:

```text
sale_price
gross_brokerage_revenue
seller_commission
capturer_commission
team_override
external_partner_commission
direct_transaction_costs
gross_company_margin
net_company_margin
```

Example:

```text
Sale price:                500,000,000
Brokerage @ 3%:             15,000,000
Seller payout:               5,250,000
Capturer payout:               750,000
Team override:                 750,000
Company gross margin:         8,250,000
```

The percentages are configurable examples, not fixed business policy.

---

# 52. CORE COMPANY SOP

## Owner Acquisition

1. Receive owner lead.
2. Qualify property.
3. Verify identity/authority.
4. Review property.
5. Define price.
6. Define brokerage fee.
7. Sign agreement.
8. Collect documents.
9. Capture media.
10. Create listing.
11. Internal review.
12. Activate.

## Buyer Process

1. Capture lead.
2. Duplicate check.
3. Assign attribution.
4. Qualify.
5. Match.
6. Schedule.
7. Show property.
8. Record feedback.
9. Follow up.
10. Submit offer.
11. Negotiate.
12. Create deal.
13. Close.
14. Calculate commissions.

## Seller Process

1. Apply.
2. KYC/basic verification.
3. Agreement.
4. Confidentiality.
5. Training.
6. Approval.
7. Inventory access.
8. Lead activity.
9. Appointments.
10. Offers.
11. Closing.
12. Commission.

---

# 53. MVP SCOPE

The first production version MUST include:

## Authentication
- login;
- roles;
- forgot password;
- admin MFA.

## Seller
- onboarding;
- approval;
- seller dashboard.

## Properties
- creation;
- owner association;
- photos;
- property search;
- seller-safe property view;
- sensitive data masking;
- status workflow.

## Leads
- seller lead registration;
- duplicate detection;
- pipeline;
- lead attribution;
- notes/tasks.

## Appointments
- request;
- admin confirmation;
- calendar;
- address disclosure rule;
- status history.

## Offers
- submit;
- review;
- counter;
- accept/reject.

## Deals
- create;
- stage workflow;
- checklist.

## Commissions
- configurable rule;
- calculation;
- seller view;
- admin approval;
- paid status.

## Documents
- private upload;
- role access;
- signed URL;
- metadata.

## Audit
- sensitive access;
- status changes;
- commission changes.

## Admin
- operational dashboard;
- entity management;
- configuration.

---

# 54. PHASE 2

- public property marketplace;
- website lead routing;
- owner portal;
- WhatsApp Cloud API;
- seller teams;
- team leader override;
- property capture incentives;
- advanced reporting;
- automated brochures;
- QR visit check-in;
- e-signature provider;
- seller training center;
- saved property searches;
- recommendation engine.

---

# 55. PHASE 3

- multi-company / franchise model;
- white-label;
- external agency partnerships;
- API marketplace;
- mortgage/credit integrations;
- insurance;
- title/legal partners;
- automated valuations;
- AI sales copilot;
- AI lead scoring;
- AI property descriptions;
- advanced fraud/anomaly detection;
- national marketplace.

---

# 56. AI FEATURES

AI may assist with:

- property description drafting;
- buyer/property matching;
- conversation summarization;
- follow-up suggestions;
- lead prioritization;
- document classification;
- missing-document detection;
- sales activity summaries.

AI must NOT autonomously:

- approve legal title;
- make final AML accusations;
- accept a binding offer;
- approve a commission payment;
- modify attribution without review;
- expose restricted owner data.

---

# 57. UI PRINCIPLES

Style:

- professional;
- premium;
- data-dense but clean;
- fast;
- mobile responsive.

Seller mobile experience is critical because many sellers operate from phones.

Required responsive flows:

- property search;
- property detail;
- lead registration;
- visit scheduling;
- visit feedback;
- offer submission;
- commissions.

---

# 58. DESIGN SYSTEM

Use:

- consistent spacing tokens;
- semantic typography;
- reusable cards;
- badges for states;
- tables for admin;
- command/search palette where useful;
- modal/drawer forms;
- accessible inputs;
- skeleton loading;
- empty states;
- toast notifications.

Status colors must be semantic and accessible, but do not encode meaning only by color.

---

# 59. NON-FUNCTIONAL REQUIREMENTS

## Performance

- paginate all large lists;
- indexed search fields;
- image optimization;
- lazy load property media;
- avoid N+1 queries;
- use database transactions for attribution and commission locks.

## Reliability

- idempotent webhooks;
- retry background jobs;
- backups;
- migration discipline.

## Security

- HTTPS;
- CSRF strategy;
- secure cookies;
- rate limiting;
- input validation;
- file type validation;
- signed URLs;
- secrets outside code;
- authorization tests.

## Accessibility

Aim for WCAG AA-level patterns in primary flows.

---

# 60. API / INPUT VALIDATION

Use shared schemas, for example Zod.

Never trust:

- client user_id;
- client role;
- commission amounts;
- property visibility;
- attribution ownership.

Resolve these server-side.

---

# 61. FINANCIAL PRECISION

For COP:

Store money as:

- PostgreSQL NUMERIC, or
- integer minor/base units where appropriate.

Do not use JavaScript floating point for commission math.

Create money utility functions.

All commission tests must assert exact values.

---

# 62. TRANSACTION SAFETY

Use DB transactions for:

- lead registration + attribution;
- seller reassignment;
- offer acceptance;
- deal creation;
- commission snapshot;
- deal close + commission earning.

Avoid race conditions where two sellers register the same lead at the same time.

---

# 63. SOFT DELETE POLICY

Do not hard delete:

- leads;
- offers;
- deals;
- commissions;
- audit events;
- signed agreements.

Archive instead.

For privacy requests, implement appropriate deletion/anonymization workflows consistent with applicable legal retention requirements.

---

# 64. SAMPLE SEED DATA

Create development seed:

- 2 super admins;
- 2 admins;
- 10 sellers;
- 2 teams;
- 10 owners;
- 30 properties;
- 60 leads;
- 20 appointments;
- 8 offers;
- 4 deals;
- sample commissions.

Use fictional data only.

---

# 65. TEST SUITE

Minimum tests:

## Authorization
- seller cannot see owner phone;
- seller cannot access another seller's lead;
- seller cannot approve own commission;
- finance cannot modify property owner identity.

## Attribution
- duplicate lead preserves active attribution;
- expired attribution follows policy;
- reassignment preserves history;
- simultaneous duplicate registrations remain consistent.

## Disclosure
- seller cannot see exact address before allowed event;
- confirmed appointment unlocks according to rule;
- cancelled appointment re-locks if configured.

## Commission
- percentage split exact;
- fixed payout exact;
- tier snapshot remains unchanged;
- closed deal earns commissions once;
- webhook retry does not duplicate payment state.

## Audit
- sensitive access writes log;
- commission adjustment writes log;
- permission change writes log.

---

# 66. DEVELOPMENT MILESTONES

## Milestone 1 — Foundation
- monorepo;
- database;
- auth;
- RBAC;
- layout;
- audit foundation.

## Milestone 2 — Inventory
- owners;
- properties;
- media;
- documents;
- disclosure rules.

## Milestone 3 — Seller Network
- onboarding;
- approvals;
- seller dashboard;
- inventory search.

## Milestone 4 — CRM
- leads;
- duplicate engine;
- attribution;
- tasks;
- matching.

## Milestone 5 — Appointments
- scheduling;
- confirmation;
- address unlock;
- feedback.

## Milestone 6 — Offers + Deals
- offer versioning;
- negotiation;
- deal pipeline;
- checklist.

## Milestone 7 — Commissions
- rules;
- snapshots;
- calculation;
- approvals;
- payouts tracking.

## Milestone 8 — Admin + Reporting
- executive metrics;
- reports;
- configuration.

## Milestone 9 — Public Site
- property portal;
- lead forms;
- routing.

## Milestone 10 — Hardening
- security review;
- performance;
- tests;
- backups;
- production deployment.

---

# 67. ENVIRONMENT VARIABLES

Example only:

```bash
DATABASE_URL=
AUTH_SECRET=
APP_URL=

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=

WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

MAPS_API_KEY=

REDIS_URL=

SENTRY_DSN=
```

Never commit real secrets.

---

# 68. INITIAL ADMIN SETTINGS

Seed configurable values:

```yaml
lead_protection_days: 120
appointment_address_unlock_hours: 24
require_seller_approval: true
require_owner_agreement_before_activation: true
commission_lock_event: DEAL_CREATED
allow_seller_inventory_export: false
allow_seller_owner_contact: false
admin_mfa_required: true
```

These are initial defaults and must remain editable.

---

# 69. CODING STANDARDS

- TypeScript strict mode.
- No `any` unless documented.
- Domain logic outside UI components.
- Server-side permission helpers.
- Use migrations.
- Use transactions.
- Add indexes based on query patterns.
- Avoid giant services.
- No secrets in repository.
- No sensitive PII in normal application logs.
- Audit business events separately.
- Validate all inputs.
- Return typed errors.
- Do not expose stack traces to clients.
- Reusable UI components.
- Mobile-first seller workflows.

---

# 70. REQUIRED DOCUMENTATION

Before declaring MVP complete, repository must contain:

```text
README.md
docs/ARCHITECTURE.md
docs/BUSINESS_RULES.md
docs/DATABASE.md
docs/API.md
docs/SECURITY.md
docs/PERMISSIONS.md
docs/COMMISSION_ENGINE.md
docs/LEAD_ATTRIBUTION.md
docs/DEPLOYMENT.md
docs/TESTING.md
```

README must contain:

- prerequisites;
- local setup;
- environment variables;
- migrations;
- seed;
- run commands;
- tests;
- deployment overview.

---

# 71. DEFINITION OF DONE — MVP

MVP is NOT done merely because pages render.

It is done when:

1. Admin can onboard owner.
2. Admin can create a property.
3. Sensitive owner data is protected.
4. Admin can activate property.
5. Approved seller can browse it.
6. Seller can register a buyer.
7. Duplicate buyer detection works.
8. Attribution is recorded.
9. Seller can request visit.
10. Admin can approve visit.
11. Address is disclosed according to policy.
12. Seller can complete visit and feedback.
13. Seller can submit offer.
14. Admin can manage counteroffer.
15. Accepted offer can create deal.
16. Deal can move through closing workflow.
17. Commission is calculated from a stored rule snapshot.
18. Seller sees own expected commission.
19. Admin/finance can approve and mark paid.
20. Sensitive actions appear in immutable audit history.
21. Automated tests cover the critical business rules.
22. Application can be deployed without development-only secrets or fake authorization.

---

# 72. FIRST CODEX TASK

Start by doing the following in order:

1. Inspect the existing repository.
2. Do not delete working features without reason.
3. Create `/docs` and save this specification as the master product document.
4. Write:
   - `ARCHITECTURE.md`
   - `DATABASE.md`
   - `PERMISSIONS.md`
   - `BUSINESS_RULES.md`
5. Propose the concrete database schema.
6. Implement authentication + RBAC.
7. Implement audit foundation.
8. Implement owners + properties.
9. Add seller-safe disclosure rules.
10. Implement seller onboarding.
11. Implement leads + duplicate detection + attribution.
12. Implement appointments.
13. Implement offers.
14. Implement deals.
15. Implement commission engine.
16. Add tests after each domain.
17. Only then implement cosmetic enhancements and advanced integrations.

At every milestone:

- run lint;
- run type checking;
- run tests;
- run migrations safely;
- fix failures before continuing.

Do not replace real implementation with mock-only UI.

---

# 73. PRODUCT NORTH STAR

The platform succeeds when this entire chain is provable:

**Owner → Property → Seller → Buyer → Visit → Offer → Deal → Closing → Commission**

with complete attribution, restricted disclosure and auditability.

The central competitive asset is not the property card UI.

It is the company's controlled network of:

**inventory + sellers + buyers + transaction data + attribution + trust.**
