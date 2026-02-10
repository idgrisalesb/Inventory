---
name: 'dev-story'
description: 'Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria'
disable-model-invocation: true
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @{project-root}/_siesa-agents/bmm/data/gitflow/how-to-use.md
2. Always LOAD the FULL @{project-root}/_bmad/core/tasks/workflow.xml
3. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @{project-root}/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml
4. Pass the yaml path @{project-root}/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml as 'workflow-config' parameter to the workflow.xml instructions
5. ALWAYS Load and read the workflow extension from @{project-root}/_siesa-agents/bmm/workflows/4-implementation/dev-story/workflow_ext.md to understand UI implementation standards.
6. If any instruction in the base workflow config conflicts with 'workflow_ext.md', the extension file ALWAYS takes precedence.
7. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
8. Save outputs after EACH section when generating any documents from templates
</steps>
