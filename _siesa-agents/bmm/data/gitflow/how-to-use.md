---
name: 'gitflow-siesa-conditional-extension'
description: 'Conditionally applies Siesa Git Flow rules based on workflow type and story status'
disable-model-invocation: true
---

THIS FILE EXTENDS _bmad WORKFLOWS.
IT DOES NOT MODIFY CORE LOGIC.

<critical>
Git Flow behavior MUST be applied conditionally based on:
- auto_gitflow_enabled flag
- current workflow being executed
- story status in sprint-status.yaml
</critical>

<steps CRITICAL="TRUE">

### SECTION 1 – Git Flow Configuration Validation

1. CHECK for the existence of:
   `_bmad-output/implementation-artifacts/gitflow-config.md`

2. IF the file DOES NOT EXIST:
   - CREATE it with the following content:

     ```md
     # Git Flow Configuration

     ## auto_gitflow_enabled
     TBD
     ```

   - ASK the USER:
     "Do you want Siesa-Agents to automatically manage Git Flow for this project? (true / false)"

   - UPDATE the file with the explicit answer
   - DO NOT proceed until the value is defined

3. IF the file EXISTS:
   - READ the file completely
   - PARSE the value under `## auto_gitflow_enabled`

4. IF `auto_gitflow_enabled` is `false`:
   - DO NOT load `data/git-flow-siesa.md`
   - DO NOT apply any Git Flow rules
   - CONTINUE workflow normally

---

### SECTION 2 – Load Git Flow Standards

5. IF `auto_gitflow_enabled` is `true`:
   - LOAD `_siesa-agents\bmm\data\gitflow\git-flow-siesa.md`
   - TREAT its content as MANDATORY standards
   - APPLY them conditionally based on the active workflow

---

### SECTION 3 – Workflow-Specific Git Flow Behavior

6. DETERMINE the ACTIVE workflow:
   - Example values: `dev-story`, `code-review`
   - DO NOT guess; infer only from the executed workflow context

---

#### 3.1 dev-story Rules

7. IF the active workflow is `dev-story`:
   - APPLY Git Flow rules ONLY for:
     - Branch naming
     - Branch creation
     - Branch selection
   - DO NOT perform commits
   - DO NOT finalize merges
   - Git Flow usage is LIMITED to branch-level operations

---

#### 3.2 code-review Rules

8. IF the active workflow is `code-review`:
   - APPLY Git Flow rules for:
     - Commit creation
     - Commit message standards
     - Commit granularity

9. BEFORE creating ANY commit:
   - LOAD and READ `sprint-status.yaml` COMPLETELY
   - FIND the current story entry
   - VERIFY that:
     ```yaml
     status: done
     ```

10. IF the story status is NOT `done`:
    - DO NOT create commits
    - DO NOT modify git state
    - INFORM the user that commits are blocked until the story is marked as `done`

11. IF and ONLY IF the story status IS `done`:
    - ALLOW commit creation
    - ENSURE commits strictly follow `git-flow-siesa.md`
    - DO NOT bypass commit rules under any circumstance

---

### SECTION 4 – Absolute Constraints

12. UNDER NO CIRCUMSTANCE:
    - Infer story completion
    - Assume commit permission
    - Commit during `dev-story`
    - Commit during `code-review` if status ≠ `done`
    - Apply Git Flow partially when `auto_gitflow_enabled = true`

</steps>

<critical>
Git Flow enforcement is GOVERNED, CONDITIONAL, and STATE-DEPENDENT.
Violating these rules is a workflow failure.
</critical>
