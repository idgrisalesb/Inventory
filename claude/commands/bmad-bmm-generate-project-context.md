---
name: 'generate-project-context'
description: 'Creates a concise project-context.md file with critical rules and patterns that AI agents must follow when implementing code. Optimized for LLM context efficiency.'
disable-model-invocation: true
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. ALWAYS Load and read the workflow extension from @{project-root}/_siesa-agents/bmm/workflows/generate-project-context/workflow_ext.md to understand critical implementation rules and Siesa UI Kit requirements.
2. LOAD the FULL @{project-root}/_bmad/bmm/workflows/generate-project-context/workflow.md
3. READ its entire contents.
4. If any instruction in the base workflow conflicts with 'workflow_ext.md', the extension file ALWAYS takes precedence.
5. Follow the workflow directions exactly!
</steps>
