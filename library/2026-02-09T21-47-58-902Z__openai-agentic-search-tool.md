# Research: openai agentic search tool

- Date: 2026-02-09T21:47:58.902Z
- Model: gpt-5-2025-08-07
- Tool: web_search

## Summary

Do you mean:
- ChatGPT’s end-user Search feature, or
- The developer “web_search” tool for building agentic workflows via the OpenAI API?

Quick overview
- End users: ChatGPT Search lets you get up-to-date answers with citations directly in ChatGPT on web and mobile. It’s available to Free, Plus, Team, Edu, and Enterprise users. ([openai.com](https://openai.com/index/introducing-chatgpt-search/?utm_source=openai))
- Developers: The Responses API includes a built-in web_search tool so your agent can plan queries, browse, and cite sources. You can pair it with the Search‑tuned preview models. ([platform.openai.com](https://platform.openai.com/docs/api-reference/responses/compact/?utm_source=openai))

Minimal API example (JavaScript)
- Enables web search in a single call using the Responses API.

import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-4o-mini-search-preview",
  tools: [{ type: "web_search" }],
  input: "Give me a 3‑bullet summary of the latest NASA Mars mission news and cite sources."
});

console.log(response.output_text);

- The web_search tool is one of several built-ins (alongside file_search and computer use) designed for agentic apps. ([openai.com](https://openai.com/index/new-tools-for-building-agents/?utm_source=openai))
- The search‑tuned models are specialized for executing web queries and include pricing/limits distinct from general models. ([platform.openai.com](https://platform.openai.com/docs/models/gpt-4o-search-preview?utm_source=openai))

If you’re building, tell me:
- Your language/runtime (JS/TS, Python, etc.)
- Whether you also need file_search or computer use
- Any constraints (cost, latency, or source domains)

I can then provide a copy‑paste template and best practices for reliable agentic search.

## Sources

- [https://www.techradar.com/pro/openai-introduces-frontier-an-easier-way-to-manage-all-your-ai-agents-in-one-place](https://www.techradar.com/pro/openai-introduces-frontier-an-easier-way-to-manage-all-your-ai-agents-in-one-place)
- [https://www.theverge.com/news/604902/chagpt-deep-research-ai-agent](https://www.theverge.com/news/604902/chagpt-deep-research-ai-agent)
- [https://www.theguardian.com/technology/2024/dec/24/chatgpt-search-tool-vulnerable-to-manipulation-and-deception-tests-show](https://www.theguardian.com/technology/2024/dec/24/chatgpt-search-tool-vulnerable-to-manipulation-and-deception-tests-show)
- [https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval](https://learn.microsoft.com/en-us/azure/search/search-get-started-agentic-retrieval)
- [https://openai.com/index/agentic-ai-foundation/](https://openai.com/index/agentic-ai-foundation/)
- [https://github.com/qx-labs/agents-deep-research](https://github.com/qx-labs/agents-deep-research)
- [https://techcrunch.com/2025/03/11/openai-launches-new-tools-to-help-businesses-build-ai-agents/](https://techcrunch.com/2025/03/11/openai-launches-new-tools-to-help-businesses-build-ai-agents/)
- [https://openai.com/index/new-tools-for-building-agents/](https://openai.com/index/new-tools-for-building-agents/)
- [https://openai.com/solutions/use-case/agents/](https://openai.com/solutions/use-case/agents/)
- [https://arxiv.org/abs/2505.19253](https://arxiv.org/abs/2505.19253)
- [https://docs.agentic.so/marketplace/ts-sdks/openai-responses](https://docs.agentic.so/marketplace/ts-sdks/openai-responses)
- [https://openai.com/index/introducing-chatgpt-search/](https://openai.com/index/introducing-chatgpt-search/)
- [https://help.openai.com/en/articles/9237897-chatgpt-search](https://help.openai.com/en/articles/9237897-chatgpt-search)
- [https://openai.com/chatgpt/search-product-discovery/](https://openai.com/chatgpt/search-product-discovery/)
- [https://platform.openai.com/docs/guides/tools-file-search/](https://platform.openai.com/docs/guides/tools-file-search/)
- [https://platform.openai.com/docs/bots/overview-of-](https://platform.openai.com/docs/bots/overview-of-)
- [https://platform.openai.com/docs/models/gpt-4o-search-preview](https://platform.openai.com/docs/models/gpt-4o-search-preview)
- [https://platform.openai.com/docs/models/gpt-4o-mini-search-preview](https://platform.openai.com/docs/models/gpt-4o-mini-search-preview)
- [https://openai.com/index/chatgpt-shopping-research](https://openai.com/index/chatgpt-shopping-research)
- [https://platform.openai.com/docs/guides/tools/file-search](https://platform.openai.com/docs/guides/tools/file-search)
- [https://platform.openai.com/docs/guides/tools/tool-choice](https://platform.openai.com/docs/guides/tools/tool-choice)
- [https://platform.openai.com/docs/guides/retrieval](https://platform.openai.com/docs/guides/retrieval)
- [https://platform.openai.com/docs/assistants/tools](https://platform.openai.com/docs/assistants/tools)
- [https://platform.openai.com/docs/api-reference/responses/compact/](https://platform.openai.com/docs/api-reference/responses/compact/)
- [https://platform.openai.com/docs/assistants/tools/file-search/step-4-create-a-thread](https://platform.openai.com/docs/assistants/tools/file-search/step-4-create-a-thread)
