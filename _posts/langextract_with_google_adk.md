---
title: 'Supercharging AI Agents: A Practical Guide to Integrating LangExtract with the Google ADK'
date: '2025-08-13'
description: 'This is a sample post to demonstrate the new blog design.'
category: 'Getting Started'
author: 'Thomas Chong'
---

Extracting structured data from unstructured text—like emails or reports—is a common challenge. **LangExtract** is an open-source Python library from Google that uses Large Language Models (LLMs) to accurately extract entities, relationships, and other structured information from raw text. It also provides traceability, so you can see exactly where each piece of data came from in the original document.

Now, imagine giving this extraction power to an AI agent that can reason and act. The **Google Agent Development Kit (ADK)** lets you build such agents.

In this guide, you'll learn how to turn LangExtract into a tool for an ADK agent, so your AI can extract information from documents and use it for further actions.

## Setting Up the Project

First, let's create a clean, organized project structure.

### Step 1: Project Structure

We'll follow the standard ADK project structure to ensure our agent is discoverable and easy to maintain.

```
.
├── langextract_agent/
│   ├── __init__.py      # Makes the agent discoverable by ADK
│   ├── agent.py         # Contains the core agent definition
│   ├── tool.py          # Contains the langextract tool logic
│   └── .env             # For storing your API key
├── visualizations/      # Directory for HTML visualization files
├── main.py              # A script to run the agent from the command line
└── requirements.txt     # Project dependencies
```

*   `__init__.py`: This file makes the `langextract_agent` directory a Python package and allows the ADK to find our agent and tool.
*   `agent.py`: This file will contain the definition of our ADK agent.
*   `tool.py`: We'll put all our data extraction logic in this file, keeping it separate from the agent definition.
*   `.env`: This file will store our Google API key.
*   `main.py`: A simple script to test our agent from the command line.
*   `requirements.txt`: This file lists all the Python packages our project needs.

### Step 2: Installation

With the structure in place, let's install the necessary libraries. Create a `requirements.txt` file with the following content:

```
google-adk
langextract
python-dotenv
google-generativeai
```

Then, run the following command in your terminal:

```bash
pip install -r requirements.txt
```

### Step 3: API Key Configuration

Create a file named `.env` inside the `langextract_agent` directory. This file will hold your Google API key.

```
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

Replace `YOUR_GOOGLE_API_KEY_HERE` with your actual API key from [Google AI Studio](https://aistudio.google.com/apikey).

## Building the LangExtract Tool

Now, let's build the core of our extraction logic. We'll create a function in `langextract_agent/tool.py` that will serve as our agent's tool.

***
**Image Suggestion:** A diagram illustrating the dynamic few-shot example selection and the final visualization output. A query comes in, and the diagram shows it being routed to the correct example before going to the LLM, with a final step showing the generated HTML file.
***

### The Core Logic (`tool.py`)

The key to building a powerful and flexible extraction tool is to use **few-shot examples**. These examples guide the LLM, showing it exactly what kind of information to extract and in what format. Instead of using a single, generic example, we'll create a dynamic selection mechanism that chooses the most relevant example based on the user's query.

Here is the code for `langextract_agent/tool.py`:

```python
import os
import pathlib
import textwrap
import langextract as lx
import uuid
import logging

logging.basicConfig(level=logging.INFO)

def generate_visualization(result: any, base_url: str) -> str:
    """Generates an HTML visualization and returns a full, clickable URL."""
    output_dir = "visualizations"
    os.makedirs(output_dir, exist_ok=True)
    
    # Save the results to a temporary JSONL file
    jsonl_filename = f"temp_{uuid.uuid4().hex}.jsonl"
    jsonl_filepath = os.path.join(output_dir, jsonl_filename)
    lx.io.save_annotated_documents([result], output_name=jsonl_filename, output_dir=output_dir)

    # Generate the visualization from the file
    html_filename = f"visualization_{uuid.uuid4().hex}.html"
    html_filepath = os.path.join(output_dir, html_filename)
    html_content = lx.visualize(jsonl_filepath)
    with open(html_filepath, "w") as f:
        f.write(html_content)
        
    # Clean up the temporary JSONL file
    os.remove(jsonl_filepath)
    
    # Construct the full URL
    full_url = f"{base_url}/{html_filepath}"
    return full_url

def document_extractor_tool(unstructured_text: str, user_query: str) -> dict:
    """
    Extracts structured information from a given unstructured text based on a user's query,
    and generates a visualization of the result.
    """

    base_url = pathlib.Path(os.path.abspath(os.getcwd())).as_uri()

    prompt = textwrap.dedent(f\"\"\"
    You are an expert at extracting specific information from documents.
    Based on the user's query, extract the relevant information from the provided text.
    The user's query is: "{user_query}"
    Provide the output in a structured JSON format.
    \"\"\")

    # --- Dynamic Few-Shot Example Selection ---
    examples = []
    query_lower = user_query.lower()
    
    if any(keyword in query_lower for keyword in ["financial", "revenue", "company", "fiscal"]):
        # ... (financial example)
        examples.append(financial_example)
    elif any(keyword in query_lower for keyword in ["legal", "agreement", "parties", "effective date"]):
        # ... (legal example)
        examples.append(legal_example)
    elif any(keyword in query_lower for keyword in ["social", "post", "feedback", "restaurant", "菜式", "評價"]):
        # ... (social media example)
        examples.append(social_media_example)
    else:
        # ... (default generic example)
        examples.append(generic_example)

    logging.info(f"Selected {len(examples)} few-shot example(s).")

    result = lx.extract(
        text_or_documents=unstructured_text,
        prompt_description=prompt,
        examples=examples,
        api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    logging.info(f"Extraction result: {result}")

    # Generate the visualization
    visualization_link = generate_visualization(result, base_url)

    # Convert the result to a JSON-serializable format
    extractions = [
        {"text": e.extraction_text, "class": e.extraction_class, "attributes": e.attributes}
        for e in result.extractions
    ]
    
    return {
        "extracted_data": extractions,
        "visualization_link": visualization_link,
    }
```

This dynamic approach makes our tool incredibly versatile. It can handle financial reports, legal agreements, and even social media posts with high accuracy because it's always using a relevant example to guide the LLM. As a bonus, it also generates an interactive HTML visualization for each extraction, allowing you to see the results in context.

## Creating the ADK Agent

With our tool in place, let's create the agent that will use it. In `langextract_agent/agent.py`, we'll define our agent and give it the `document_extractor_tool`.

### The Agent Definition (`agent.py`)

```python
from dotenv import load_dotenv
from google.adk.agents import Agent
from .tool import document_extractor_tool

# Load environment variables from .env file
load_dotenv()

# Define the instructions for your agent
agent_instructions = """
You are a helpful assistant. Your job is to extract specific information from documents.
When a user provides you with a document and a query, you must use the 'document_extractor_tool'
to get the answer. After presenting the extracted data, you should also provide the user with the
link to the generated visualization with markdown hyperlink format [Please click here to view the visualization](url). Do not try to answer from your own knowledge.
"""

# Create the agent and give it the tool
root_agent = Agent(
    name="document_extractor_agent",
    description="An agent that extracts information from documents.",
    model="gemini-2.5-flash",
    instruction=agent_instructions,
    tools=[document_extractor_tool],
)
```

The `instruction` parameter is crucial here. It tells the agent its purpose and, most importantly, that it *must* use the `document_extractor_tool` to fulfill the user's request and provide the visualization link.

## Seeing it in Action: The Examples

Let's see our agent in action with a few examples from our `main.py` script.

### Example 1: The Financial Analyst's Assistant

Imagine you're a financial analyst who needs to quickly extract key figures from a news article.

***
**Image Suggestion:** A screenshot of the terminal output for the financial example, showing the extracted data and the link to the visualization.
***

```python
# In main.py
article = """
TechCorp announced its results for the second quarter of 2024.
The company reported a record revenue of $5.2 billion, a significant increase from the previous year.
Another company, FutureGadgets, reported revenues of $850 million for the same period.
"""
user_query = "Extract all company names, their revenues, and the fiscal period mentioned."
```

Our agent will process this and return a clean, structured JSON output, along with a link to the visualization:

```
--- Running Financial Analysis ---
The extracted information is:
*   **Company Name:** TechCorp, **Revenue:** $5.2 billion, **Fiscal Period:** second quarter of 2024
*   **Company Name:** FutureGadgets, **Revenue:** $850 million, **Fiscal Period:** second quarter of 2024
```

### Example 2: The Legal Tech Sidekick

Now, let's try a more complex legal document.

***
**Image Suggestion:** A screenshot of the terminal output for the legal example, showing the extracted data and the link to the visualization.
***

```python
# In main.py
legal_text = """
This Service Agreement is made and entered into as of this 21st day of October, 2025,
by and between Innovate Solutions Inc., a corporation organized and existing under the
laws of Delaware, with its principal office at 123 Tech Avenue, Silicon Valley, CA 94000
("Service Provider"), and Global Dynamics LLC, a limited liability company organized
and existing under the laws of New York, with its principal office at 456 Commerce Plaza,
New York, NY 10001 ("Client"). The Service Provider shall deliver the software product
no later than December 15, 2025. The Client's obligation is to pay the full amount of
$150,000 within 30 days of product delivery.
"""
legal_query = "Extract the parties involved, their addresses, the effective date of the agreement, and the key obligations for each party (delivery deadline and payment terms)."
```

The agent can easily parse this and extract the nested information:

```
--- Running Complex Legal Document Extraction ---
The extracted information is:
*   **Parties Involved:** Innovate Solutions Inc., Global Dynamics LLC
*   **Effective Date:** 21st day of October, 2025

```

### Example 3: The Multilingual Social Media Monitor

This is where LangExtract truly shines. Let's give our agent a social media post written in informal, mixed-language Cantonese.

***
**Image Suggestion:** A split-screen image showing the terminal output for both the Traditional Chinese and Cantonese examples side-by-side, each with their visualization links.
***

```python
# In main.py
social_post_canto = """
啱啱買咗部新嘅「星塵X1」手機，個相機影相好掂，夜景模式堅揪！但係電量去得有啲快，
唔知係咪我打機打得太多。個mon個色水好靚，睇片一流。
"""
social_query_canto = "Extract the product name, positive feedback points, and negative feedback points from this social media post."
```

Even with the informal language, the agent can extract the key feedback points:

```
--- Running Social Listening (Traditional Chinese) ---
The extracted information is:
*   **餐廳名稱 (Restaurant Name):** 味之戀人
*   **菜式 (Dishes):**
    *   黑松露意大利飯 (Black Truffle Risotto): **評價 (Evaluation):** 正面 (Positive) - 「真係好好食 (really delicious)」
    *   Tiramisu: **評價 (Evaluation):** 中性 (Neutral) - 「普通咗啲 (a bit ordinary)」
*   **服務 (Service):** 唔錯 (Not bad) - 「服務態度唔錯 (service attitude is not bad)」

```

## Interactive Demo with the ADK Web UI

While running the script from the command line is great for testing, the ADK Web UI provides a much richer interactive experience.

### Step 1: Launch the UI

Run the following command in your terminal:

```bash
adk web
```

### Step 2: Interact with the Agent

Open the URL provided (usually `http://localhost:8000`) in your browser. You can select the `document_extractor_agent` from the dropdown menu and start chatting with it.

***
**Image Suggestion:** A GIF or screenshot of the ADK Web UI. It should show the user selecting the `document_extractor_agent`, typing in a query (e.g., the financial one), and getting the structured output back in the interface, including the clickable link to the visualization.
***

The UI allows you to see the agent's "thoughts" as it decides to use the tool, the exact parameters it passes to the tool, and the final, structured result. It's an invaluable resource for debugging and demonstrating your agent's capabilities.

## Conclusion

By integrating LangExtract's precise data extraction capabilities with the Google ADK's agentic framework, you can build powerful and specialized AI assistants. This combination allows you to move beyond generic chatbots to create agents that can interact with complex, unstructured data and turn it into actionable, structured insights.

The possibilities are vast, from customer support agents that automatically process ticket information from emails to healthcare assistants that summarize and structure clinical notes.

### Ready to start building?

*   Explore the official **LangExtract GitHub repository**: [https://github.com/google/langextract](https://github.com/google/langextract)
*   Dive into the **Google ADK documentation and samples**: [https://github.com/google/adk-python](https://github.com/google/adk-python)