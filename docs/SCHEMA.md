# Frontend Data Shapes

Key TypeScript types used by the frontend API client (`src/lib/api.ts`):

- `QueryRequest`:
  - `query: string`
  - `workflow?: string`
  - `marks?: number`
  - `top_k?: number`
  - `format?: string`
  - `subject?: string`
  - `topic?: string`

- `QueryResponse`:
  - `answer?: string`
  - `citations?: Array<{ id?: string; source?: string; text?: string; url?: string }>`
  - `metadata?: Record<string, any>`

- `SignupPayload`:
  - `email: string`
  - `password: string`
  - `full_name?: string | null`
  - `institution_id?: number | null`
  - `department_id?: string | null` — required when institution_id is set

- `Department` (from `getDepartments`):
  - `department_id: string`
  - `name: string`

Also note streaming behavior from `streamQuery` which yields string chunks (SSE or NDJSON style).
