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

Also note streaming behavior from `streamQuery` which yields string chunks (SSE or NDJSON style).
