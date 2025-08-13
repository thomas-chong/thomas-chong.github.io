---
title: 'Mastering AgentOps: A Deep Dive into Evaluating ADK Agents with Langfuse'
date: '2025-08-03'
description: 'This is a sample post to demonstrate the new blog design.'
category: 'Getting Started'
author: 'Thomas Chong'
---

# Mastering AgentOps: A Deep Dive into Evaluating ADK Agents with Langfuse

### The Challenge of Production-Ready Agents

The era of AI agents is upon us. Building a proof-of-concept agent that can chat or perform a simple task has become remarkably accessible. However, the journey from a clever prototype to a reliable, production-grade application is fraught with challenges. How do you ensure your agent behaves predictably? How do you measure its performance over time and prevent regressions when you update a prompt or a tool? Answering these questions requires moving beyond simple "vibe-testing" and adopting a more rigorous, engineering-focused discipline.

This is the domain of **AgentOps**: the set of practices and tools for observing, analyzing, and optimizing the entire lifecycle of AI agents. Just as DevOps revolutionized traditional software, AgentOps provides the framework for building trustworthy and effective agentic systems. This article will focus on a critical pillar of AgentOps: **evaluation**.

### The Tools for the Job

To tackle this challenge, we will use a powerful combination of open-source tools:

*   **Google's Agent Development Kit (ADK):** ADK is a code-first Python toolkit designed to make agent development feel more like traditional software engineering. It offers a flexible, modular framework for building, orchestrating, and, crucially, evaluating sophisticated AI agents. Its emphasis on a code-first approach provides the flexibility and control needed for complex, production-ready systems.
*   **Langfuse:** Langfuse is an open-source LLM engineering platform built for the entire development workflow. It helps teams collaboratively debug, analyze, and iterate on their LLM applications by providing detailed tracing, prompt management, and evaluation capabilities.

### Our Goal

This article provides a complete, step-by-step guide to creating a closed-loop evaluation system. We will build a realistic agent using ADK, systematically evaluate its performance using ADK's built-in features, and then programmatically log those quantitative evaluation scores into Langfuse. This links the outcome of an evaluation with the detailed execution trace, providing a comprehensive view for debugging and continuous improvement.

***

### Part 1: Foundational Concepts: ADK and Langfuse

Before diving into the code, it's essential to understand the core philosophies of our chosen tools and how they complement each other to create a robust AgentOps workflow.

#### **Google's Agent Development Kit (ADK): A Code-First Approach to Agentic Systems**

ADK's core philosophy is to treat agent development with the same rigor as software development. It prioritizes flexibility, testability, and version control through a code-first paradigm, allowing developers to define agent logic, tools, and orchestration directly in Python.

The key components a developer interacts with are:

*   **Agents:** These are the central decision-making entities. The most common is the `LlmAgent`, which uses a Large Language Model for reasoning. ADK also provides workflow agents like `SequentialAgent` and `ParallelAgent` to orchestrate other agents in predictable patterns.
*   **Tools:** These are the capabilities an agent can use to interact with the world. A tool can be a simple Python function, a complex class, an API call, or even another agent.
*   **Runners & Session:** These components manage the agent's execution flow and maintain the state of a conversation over time, respectively.

ADK also includes a powerful local development UI, launched with the `adk web` command, which is invaluable for testing, debugging, and, as we will see, generating test cases.

#### **Langfuse: The Observability Backbone for LLM Applications**

Langfuse provides the observability layer necessary to understand what your agent is doing under the hood. To effectively use it, one must understand its simple but powerful data model:

*   **Trace:** Represents a single, complete end-to-end execution of a request. For our purposes, a trace will correspond to one full run of our agent during an evaluation.
*   **Observation:** A single, discrete step within a trace. This could be an LLM call, a tool execution, or any other instrumented part of the application. Langfuse's native integration with ADK automatically creates these observations, giving a detailed, step-by-step view of the agent's reasoning process.
*   **Score:** A metric used to evaluate the quality or performance of a trace or observation. Scores can be numeric, categorical, or boolean. This is the object we will create programmatically to log our ADK evaluation results.

The Langfuse Python SDK is the primary interface for custom instrumentation, allowing us to send our evaluation scores and enrich the automatically captured traces.

#### **Synergy: Why ADK + Langfuse is a Perfect Match for AgentOps**

The combination of ADK and Langfuse creates a powerful, two-part system for robust AgentOps. ADK's evaluation feature provides the **quantitative measurement**—an objective score of how well the agent performed against a known-good dataset. Langfuse provides the **qualitative context**—the exact sequence of prompts, tool calls, and model responses that led to that score.

Consider the flow:

1.  ADK is engineered for building and testing agents with a software development discipline. Its evaluation feature produces specific, objective scores like `tool_trajectory_avg_score` and `response_match_score`.
2.  However, these scores exist in a vacuum. A `tool_trajectory_avg_score` of 0.5 tells you that the agent deviated from the expected path, but it doesn't tell you *how* or *why*.
3.  Langfuse's strength lies in capturing detailed, hierarchical traces of every step an agent takes. The native ADK integration automates this logging, providing a complete record of the agent's reasoning process.
4.  By programmatically sending ADK's evaluation scores into the corresponding Langfuse trace, we link the **"what"** (the score) with the **"why"** (the detailed trace). This creates a complete feedback loop. A developer can see a low score in Langfuse, click into the associated trace, and immediately debug the exact point of failure. This is the essence of effective AgentOps.

***

### Part 2: Building Our Sample Agent: The "Support Agent"

Let's put theory into practice by building an agent for a realistic use case. Our "Support Agent" will be designed to help users by looking up the status of their orders using a custom tool.

#### **Environment and Project Setup**

First, prepare your development environment and project structure.

1.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
    *(On Windows, use `.venv\Scripts\activate`)*

2.  **Install dependencies:** Create a `requirements.txt` file with the following content:
    ```
    google-adk
    langfuse
    python-dotenv
    google-generativeai
    ```
    Then, install them:
    ```bash
    pip install -r requirements.txt
    ```
    This installs ADK, Langfuse, a helper for environment variables, and the Google Gemini SDK.

3.  **Set up the project structure:** Create the following directories and files:
    ```
    adk_langfuse_eval/
    ├── support_agent/
    │   ├── __init__.py
    │   ├── agent.py
    │   └── .env
    ├── run_evaluation.py
    └── requirements.txt
    ```
    > **PHOTO:** A screenshot of the final project directory structure as shown in a VS Code sidebar or similar tree view should be placed here.

4.  **Configure environment variables:** Create a file named `.env` inside the `support_agent/` directory and add your credentials. You can get these from Google AI Studio and the Langfuse project settings page.
    ```
    GOOGLE_API_KEY="your_google_api_key_here"
    LANGFUSE_PUBLIC_KEY="pk-lf-..."
    LANGFUSE_SECRET_KEY="sk-lf-..."
    LANGFUSE_HOST="https://cloud.langfuse.com" # or https://us.cloud.langfuse.com for US region
    ```

#### **Coding the "Support Agent" (agent.py)**

Now, let's write the code for our agent. Open `support_agent/agent.py` and add the following:

```python
# support_agent/agent.py

from google.adk.agents import LlmAgent
from google.adk.tools import tool
from pydantic import Field

@tool
def lookup_order_status(
    order_id: str = Field(description="The unique identifier for the customer's order, e.g., 'ABC-123'.")
) -> dict:
    """
    Looks up the status of a specific order by its ID.

    Args:
        order_id: The customer's order ID.

    Returns:
        A dictionary containing the order's status and details.
    """
    # In a real application, this would query a database or an API.
    # For this example, we'll return a fixed status for a known ID.
    known_orders = {
        "ABC-123": {"status": "Shipped", "estimated_delivery": "2025-07-28"},
        "XYZ-789": {"status": "Processing", "estimated_delivery": "2025-07-30"}
    }
    
    result = known_orders.get(order_id, {"status": "Not Found", "error": "Invalid order ID."})
    return result

# This is the main agent ADK will run.
root_agent = LlmAgent(
    name="support_agent",
    model="gemini-1.5-flash-latest",
    description="A helpful agent for the e-commerce store 'Gadget World', capable of checking order statuses.",
    instruction="""
    You are a friendly and helpful customer support agent for 'Gadget World'.
    Your primary task is to help users find the status of their order using the `lookup_order_status` tool.
    - Politely greet the user.
    - You must extract the `order_id` from the user's message.
    - You must call the `lookup_order_status` tool with the extracted `order_id`.
    - Once the tool returns the status, present the information to the user in a clear, helpful sentence.
    - If the tool returns 'Not Found', apologize and inform the user that the order ID might be incorrect.
    - Do not ask for any other personally identifiable information.
    """,
    tools=[lookup_order_status],
)
```
This code defines a realistic `lookup_order_status` tool and an `LlmAgent` with a detailed prompt that instructs it on how to act as a helpful support agent.

#### **Define the `__init__.py`**

Finally, make the agent discoverable by ADK. In `support_agent/__init__.py`, add the following line. This makes the directory a Python package and exposes the `root_agent` instance.

```python
# support_agent/__init__.py
from .agent import root_agent
```

***

### Part 3: Mastering ADK's Evaluation Workflow

With our agent built, we now need to create a reliable way to test it. This involves creating a high-quality dataset of expected interactions and defining what a "successful" run looks like.

#### **Creating a High-Quality Evaluation Dataset (`.evalset.json`)**

Writing a valid `.evalset.json` file by hand is a complex and error-prone task. Fortunately, ADK provides a much better way. The `adk web` UI is not just a testing ground; it is a powerful test case generation tool. It allows you to capture real, multi-turn interactions and save them as structured, reusable evaluation sets.

Here's how to generate the evalset:

1.  From your terminal, in the `adk_langfuse_eval` directory, run the ADK web server:
    ```bash
    adk web ./support_agent
    ```

2.  Open your browser to the provided URL (usually `http://127.0.0.1:8000`). You will see a chat interface.

3.  Have a conversation with the agent to create a test case. For example:
    **User:** "Hi, can you check on my order? The ID is ABC-123"

    > **PHOTO:** A screenshot of the `adk web` UI showing the conversation with the "Support Agent". The agent's response, showing the correct tool call and final answer, should be visible.

4.  Once the interaction is complete, navigate to the **Eval** tab on the right side of the interface.

5.  Click **Create new eval set**. Name it `support.evalset.json` and save it inside the `support_agent` directory.

6.  Click **Add current session** to save the conversation you just had as a new evaluation case within that file.

    > **PHOTO:** A screenshot of the "Eval" tab in `adk web`, with arrows pointing to the "Create new eval set" and "Add current session" buttons to clearly illustrate the process.

This process serializes the entire interaction—user inputs, the exact tool calls the agent made with their arguments, and the final text response—into the correct JSON format. This becomes our "golden" dataset representing the expected behavior.

#### **Defining Success: The `test_config.json` File**

Next, we need to define the pass/fail criteria for our evaluation. Create a file named `test_config.json` inside the `support_agent` directory. This file specifies the thresholds for ADK's built-in evaluation metrics:

*   **`tool_trajectory_avg_score`:** This metric is critical. It measures the correctness of the agent's tool usage. A score of 1.0 signifies that the agent called the `lookup_order_status` tool with the *perfect* arguments (i.e., `order_id: 'ABC-123'`).
*   **`response_match_score`:** This metric uses the ROUGE score to compare the agent's final text response to the reference response in the evalset. It measures the overlap in words and phrases, allowing for some flexibility in the LLM's wording.

Add the following content to `support_agent/test_config.json`:

```json
{
  "criteria": {
    "tool_trajectory_avg_score": 0.9,
    "response_match_score": 0.8
  }
}
```
For our support task, we expect a very high score for tool trajectory, as getting the `order_id` right is essential. The response match score is slightly lower to account for minor variations in the LLM's generated text (e.g., "The order has shipped" vs. "Your order's status is: Shipped").

#### **Choosing Your Evaluation Method**

ADK offers multiple ways to run evaluations. Our goal of integrating with Langfuse makes the programmatic approach the only viable option, as it provides structured results that we can parse and use.

| Evaluation Method | Primary Use Case | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **`adk web` UI** | Interactive debugging, creating evalsets | Visual, easy to inspect traces, great for exploration | Manual, not scalable for CI, limited configuration |
| **`adk eval` CLI** | Quick checks, simple CI/CD steps | Easy to automate, fast for one-off runs | Text-based output, difficult to parse for integration |
| **Programmatic (`AgentEvaluator`)**| Advanced CI/CD, custom integrations | **Full control, returns structured results, enables integration** | Requires writing a custom runner script |

***

### Part 4: The Integration: Piping ADK Eval Scores into Langfuse

This is the heart of the tutorial. We will now write the `run_evaluation.py` script that orchestrates the entire process: running the ADK evaluation programmatically and sending the results to Langfuse.

#### **The `run_evaluation.py` Script**

Open the `run_evaluation.py` file at the root of your project and add the following code. The comments explain each step in detail.

```python
# run_evaluation.py

import asyncio
import os
from pathlib import Path
import langfuse
from dotenv import load_dotenv

# This is the programmatic entry point for ADK's evaluation logic.
from google.adk.evaluation.agent_evaluator import AgentEvaluator

# --- 1. Setup and Initialization ---
# Load environment variables from the agent's .env file
dotenv_path = Path('./support_agent/.env')
load_dotenv(dotenv_path=dotenv_path)

# Initialize the Langfuse client. It will automatically pick up credentials
# from the environment variables we just loaded.
try:
    langfuse_client = langfuse.Langfuse()
    print("Langfuse client initialized successfully.")
except Exception as e:
    print(f"Failed to initialize Langfuse client: {e}")
    exit(1)

# Define paths to our agent and evaluation files
AGENT_MODULE_PATH = "support_agent"
EVAL_SET_PATH = os.path.join(AGENT_MODULE_PATH, "support.evalset.json")
CONFIG_FILE_PATH = os.path.join(AGENT_MODULE_PATH, "test_config.json")

async def run_and_log_evaluation():
    """
    Runs the ADK evaluation programmatically and logs scores to Langfuse.
    """
    print(f"Starting evaluation for agent at: {AGENT_MODULE_PATH}")
    print(f"Using evalset: {EVAL_SET_PATH}")
    print(f"Using config: {CONFIG_FILE_PATH}")

    try:
        # --- 2. Execute the Evaluation Programmatically ---
        # The AgentEvaluator.evaluate_eval_set function runs the agent against
        # each case in the evalset and returns a list of result objects.
        # This is the key function that enables our custom integration.
        eval_results_list = await AgentEvaluator.evaluate_eval_set(
            agent_module_path=AGENT_MODULE_PATH,
            eval_set_file_path=EVAL_SET_PATH,
            config_file_path=CONFIG_FILE_PATH,
        )
        print(f"\nEvaluation complete. Found {len(eval_results_list)} results.")

    except Exception as e:
        print(f"An error occurred during ADK evaluation: {e}")
        return

    # --- 3. Capture Results and Score Traces in Langfuse ---
    for result in eval_results_list:
        # The Langfuse ADK integration automatically creates a trace for each
        # evaluation run. We need to get the ID of that trace.
        # We extract it from the 'actual_invocation' metadata.
        trace_id = result.actual_invocation.session_input.metadata.get("langfuse_trace_id")
        
        if not trace_id:
            print(f"Warning: Langfuse trace ID not found for eval case {result.eval_id}. Skipping.")
            continue

        print(f"\nProcessing results for eval case '{result.eval_id}' (Trace ID: {trace_id})")

        # Extract the scores from the evaluation result object
        tool_score = result.metrics.get("tool_trajectory_avg_score", 0.0)
        response_score = result.metrics.get("response_match_score", 0.0)

        print(f"  - Tool Trajectory Score: {tool_score}")
        print(f"  - Response Match Score: {response_score}")

        # --- 4. Send Scores to Langfuse ---
        # For each result, we make two calls to langfuse.score(), linking
        # our quantitative scores directly to the qualitative trace.
        try:
            langfuse_client.score(
                trace_id=trace_id,
                name="tool_trajectory_avg_score",
                value=float(tool_score),
                comment=f"ADK Eval Case ID: {result.eval_id}"
            )
            print(f"  - Successfully logged tool_trajectory_avg_score to Langfuse.")

            langfuse_client.score(
                trace_id=trace_id,
                name="response_match_score",
                value=float(response_score),
                comment=f"ADK Eval Case ID: {result.eval_id}"
            )
            print(f"  - Successfully logged response_match_score to Langfuse.")
        except Exception as e:
            print(f"  - Error logging scores to Langfuse for trace {trace_id}: {e}")


    # --- 5. Shutdown ---
    # Ensure all buffered data is sent to the Langfuse server before exiting.
    langfuse_client.flush()
    print("\nLangfuse client flushed. All data sent.")


if __name__ == "__main__":
    asyncio.run(run_and_log_evaluation())

```
This script is the centerpiece of our workflow. It uses `AgentEvaluator.evaluate_eval_set` to run the tests, iterates through the structured results, extracts the trace ID and metric scores, and then uses the `langfuse.score` method to push this data into the correct trace in Langfuse.

***

### Part 5: Closing the Loop: Analysis in the Langfuse UI

Now, let's execute our script and see the results in the Langfuse dashboard.

1.  **Run the script:** From your terminal in the project's root directory, run:
    ```bash
    python run_evaluation.py
    ```
    You should see output indicating that the evaluation is running and that scores are being logged to Langfuse.

2.  **Analyze in Langfuse:** Navigate to your Langfuse project in your browser.
    *   Go to the **Traces** dashboard. You will see a new trace corresponding to the evaluation run. Notice the **Scores** column is now populated with the metrics we just sent.

        > **PHOTO:** A screenshot of the Langfuse "Traces" dashboard. A row for the "support_agent" trace should be highlighted, with the "Scores" column clearly showing values for "tool_trajectory_avg_score" and "response_match_score".

    *   Click on the trace to open the detailed view. On the left, you can see the entire execution hierarchy: the agent's main run, the LLM call it made to decide which tool to use, and the execution of the `lookup_order_status` tool itself. This is the rich, qualitative context captured automatically by the Langfuse-ADK integration.

        > **PHOTO:** A screenshot of the detailed view of a single trace. The left-hand panel should show the nested observations: the parent `support_agent` span, a child `Generation` observation for the LLM call, and another child `Span` for the `lookup_order_status` tool call.

    *   Now, click on the **Scores** tab within this trace view. This is the payoff. You will see our two custom scores, `tool_trajectory_avg_score` and `response_match_score`, neatly logged with their values and comments.

        > **PHOTO:** A screenshot of the "Scores" tab within the trace detail view. It should clearly display two entries: one for "tool_trajectory_avg_score" and one for "response_match_score", showing the numeric values and comments we provided in the script.

### Beyond a Single Run: Monitoring Over Time

The true power of this workflow is realized when it's automated. By integrating this `run_evaluation.py` script into a CI/CD pipeline that runs after every code or prompt change, you can build powerful dashboards in Langfuse to track these evaluation scores over time. This allows your team to instantly spot performance regressions, objectively compare different models or prompts, and make data-driven decisions to improve agent quality. This is the foundation of a mature AgentOps practice.

***

### Conclusion

In this guide, we have built a complete, end-to-end evaluation workflow. We started by building a functional, realistic agent with Google's ADK. We then used the `adk web` UI not just for testing, but as a sophisticated tool to generate a "golden" evaluation dataset. Finally, we wrote a programmatic runner that executes the ADK evaluation and pipes the quantitative results directly into our observability platform, Langfuse, linking them to the rich, qualitative execution traces.

This pattern of combining **quantitative, dataset-based evaluation** with **qualitative, trace-based observability** is fundamental to building reliable, production-grade AI systems. It moves agent development from an art to an engineering discipline, providing the feedback loops necessary for continuous improvement.

As a next step, you can adapt this pattern for your own, more complex agents. Explore creating larger and more diverse evalsets to cover more edge cases. Investigate other evaluation methods, such as using an LLM-as-a-judge within Langfuse to score aspects like helpfulness or tone. Or, expand your agent's capabilities by building multi-agent systems, a feature where ADK truly shines. The foundation you've built here will support you as you tackle these more advanced challenges in the exciting world of agent development.