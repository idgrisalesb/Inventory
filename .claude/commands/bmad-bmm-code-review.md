---
name: 'code-review'
description: 'Perform an ADVERSARIAL Senior Developer code review that finds 3-10 specific problems in every story. Challenges everything: code quality, test coverage, architecture compliance, security, performance. NEVER accepts `looks good` - must find minimum issues and can auto-fix with user approval.'
disable-model-invocation: true
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @{project-root}/_siesa-agents/bmm/data/gitflow/how-to-use.md
2. Always LOAD the FULL @{project-root}/_bmad/core/tasks/workflow.xml
3. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @{project-root}/_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml
4. Pass the yaml path @{project-root}/_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml as 'workflow-config' parameter to the workflow.xml instructions
5. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
6. Save outputs after EACH section when generating any documents from templates
</steps>
