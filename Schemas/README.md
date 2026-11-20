# Navigation graph and repository mapping — provisional v0.1

The repositories keep their **native JSON**. The standalone [Knowledge Tree Navigator](../RSM_Tree_Viewer.html) reads an optional, repository-root `rsm-view.json` manifest and projects selected records into the same navigation model. **No source migration is required.**

## Contract

Two distinct artifacts:

1. **Navigation graph** (`navigation-graph-v0.1.schema.json`): an in-memory or exported *view* with `nodes`, typed `edges`, an optional `root`, and each node's source location. A node has `id`, `kind`, `label`, optionally `parent_id`, `description`, `status`, a resource `url`, and `source_location` (`url` + JSON Pointer). Non-hierarchy relationships remain typed edges, never fabricated parentage.
2. **Repository map** (`view-mapping-v0.1.schema.json`): a declarative `rsm-view.json` file choosing which native JSON files to display and how to map their fields. A repository supplies its own map. The viewer interprets it without executing repository JavaScript.

This is a **navigation projection**, not a database schema. Do not replace `candidate_explanations`, `project_idea_set`, `certificate`, `sources`, `clusters`, or other original structure with the graph. The graph is a pointer into those records.

## Supported mappings

- **Flat**: `projection.shape: "flat"`, `records: "nodes"`, optional field names for ID, label, parent and description. Retains unmodified node fields, possible-answer branches, candidate references, and relationships.
- **Record**: one root from a document plus `collections` of nested children. Each collection selects a native property using `path`, names its `kind`, and can specify `label_field`, `description_field`, `url_field`, `children_field`, and nested `collections`. Object properties (for example Drive lake names) become named children; arrays become sibling children.
- **Glob views**: `glob` expands matching files from GitHub's repository tree, without retrieving every file. Only the selected document is fetched. Glob patterns support `*` for a single path component and `**` across directories; `exclude` omits unwanted entries.

Example (single-file map, saved as `rsm-view.json`):

```json
{
  "mapping_version": "0.1",
  "views": [
    {
      "id": "questions",
      "title": "Questions",
      "file": "Investigations/operating-systems/question_tree.json",
      "projection": {
        "shape": "flat",
        "records": "nodes",
        "fields": {"id": "id", "label": "question", "parent": "parent_id", "description": "why_ask"},
        "relations": "connections"
      }
    }
  ]
}
```

## Boundaries

- Manifests **select and map**, but cannot run arbitrary code or dynamically fetch external URLs.
- Repository discovery is for **public GitHub repositories**. Private FKEN/Data Lake repositories retain their maps, but their contents are not browser-readable without making a public export or changing visibility. No token handling is reintroduced.
- Generated IDs prefer native record IDs or values; indices are fallback only. Raw JSON pointers preserve where each displayed item came from. Moving an item can change its pointer even when its logical identity is unchanged.
- This provisional map handles common tree, collection and directory shapes. Cross-repository graph joins, richer layout modes and verified evidence handling are deliberately deferred until representative use demonstrates a need.
- The viewer remains backward-compatible with repositories lacking `rsm-view.json` and with a direct `question_tree.json` or `investigation.json` link.

## Relevant mappings

- [RSM investigation trees](https://github.com/JadanPoll/Kami_Uploads_RSM_Tree/blob/main/rsm-view.json)
- [FKEN project/domain landscapes](https://github.com/JadanPoll/FKEN_Ecosystem/blob/main/rsm-view.json)
- [Data Lake directory](https://github.com/JadanPoll/Data_Lake_AI/blob/main/rsm-view.json)
