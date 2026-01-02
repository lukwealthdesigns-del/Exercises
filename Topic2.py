from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import Literal
import os

print("✅ All imports successful")

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found! Please set it in your .env file.")

print("✅ API key loaded")

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=openai_api_key
)

print(f"✅ LLM initialized: {llm.model_name}")

@tool
def get_weather(city: str) -> str:
    weather_data = {
        "lagos": "Sunny, 28°C, humidity: 65%",
        "new york": "Partly cloudy, 15°C, wind: 10 km/h",
        "london": "Rainy, 12°C, chance of rain: 80%",
        "tokyo": "Clear, 22°C, humidity: 50%",
        "sydney": "Windy, 20°C, wind: 25 km/h",
        "paris": "Overcast, 14°C, chance of rain: 30%"
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        return f"Current weather in {city.title()}: {weather_data[city_lower]}"
    else:
        return f"Weather simulation for {city.title()}: Mild, 20°C, partly cloudy"

print("✅ Weather tool created")

@tool
def lookup_word(word: str) -> str:
    dictionary = {
        "ephemeral": "Lasting for a very short time; transient.",
        "resilient": "Able to withstand or recover quickly from difficult conditions.",
        "ubiquitous": "Present, appearing, or found everywhere.",
        "paradigm": "A typical example or pattern of something; a model.",
        "serendipity": "The occurrence of events by chance in a happy or beneficial way.",
        "eloquent": "Fluent or persuasive in speaking or writing.",
        "ambiguous": "Open to more than one interpretation; not having one obvious meaning.",
        "diligent": "Having or showing care in one's work or duties.",
        "verbose": "Using more words than needed; wordy.",
        "conundrum": "A confusing and difficult problem or question."
    }
    
    word_lower = word.lower()
    if word_lower in dictionary:
        return f"Definition of '{word}': {dictionary[word_lower]}"
    else:
        return f"Word '{word}' not found in dictionary. Please try another word."

print("✅ Dictionary tool created")

@tool
def web_search(query: str) -> str:
    try:
        from duckduckgo_search import DDGS
        
        with DDGS() as ddgs:
            results = []
            for r in ddgs.text(query, max_results=3):
                results.append(f"Title: {r['title']}\nSnippet: {r['body']}\n")
            
            if results:
                return f"Search results for '{query}':\n\n" + "\n---\n".join(results)
            else:
                return f"No results found for '{query}'"
    except Exception as e:
        return f"Error performing web search: {str(e)}"

print("✅ Web search tool created")

tools = [get_weather, lookup_word, web_search]
llm_with_tools = llm.bind_tools(tools)

print(f"✅ LLM bound to {len(tools)} tools")
print(f"   Tools: {[tool.name for tool in tools]}")

sys_msg = SystemMessage(content="""You are a helpful assistant with access to tools.

When asked about weather in a city, use the get_weather tool.
When asked for word definitions, use the lookup_word tool.
When asked for current information, news, or facts that require searching, use the web_search tool.

Only use tools when necessary - for general knowledge questions you know, answer directly.""")

def assistant(state: MessagesState) -> dict:
    messages = [sys_msg] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

print("✅ Assistant node defined")

def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    
    return "__end__"

print("✅ Conditional routing function defined")

builder = StateGraph(MessagesState)

builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    should_continue,
    {"tools": "tools", "__end__": END}
)
builder.add_edge("tools", "assistant")

memory = MemorySaver()
agent = builder.compile(checkpointer=memory)

print("✅ Agent graph compiled with tools and memory")

def run_agent_test(user_input: str, thread_id: str = "test_session"):
    print(f"\n{'='*70}")
    print(f"👤 User: {user_input}")
    print(f"{'='*70}\n")
    
    result = agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    
    for message in result["messages"]:
        if isinstance(message, HumanMessage):
            continue
        elif isinstance(message, AIMessage):
            if message.tool_calls:
                tool_call = message.tool_calls[0]
                print(f"🤖 Agent: [Calling {tool_call['name']} with: {tool_call['args']}]")
            else:
                print(f"🤖 Agent: {message.content}")
        elif isinstance(message, ToolMessage):
            content = message.content
            if len(content) > 150:
                content = content[:150] + "..."
            print(f"🔧 Tool Result: {content}")
    
    print(f"\n{'='*70}")

print("✅ Test function ready")

print("\nTEST 1: Weather query (should use weather tool)")
run_agent_test("What's the weather in Lagos?", thread_id="weather_test")

print("\nTEST 2: Dictionary query (should use dictionary tool)")
run_agent_test("Define the word 'ephemeral'", thread_id="dict_test")

print("\nTEST 3: Web search query (should use web search tool)")
run_agent_test("Search for latest AI news", thread_id="search_test")

print("\nTEST 4: General knowledge (should answer directly, no tool)")
run_agent_test("What's the capital of France?", thread_id="general_test")

print("\nTEST 5: Unknown word (should use dictionary tool)")
run_agent_test("What does 'ubiquitous' mean?", thread_id="dict_test2")

print("\nTEST 6: Mixed query with context")
run_agent_test("What's the weather in Tokyo?", thread_id="mixed_session")
run_agent_test("Now search for tourist attractions there", thread_id="mixed_session")

print("\nTEST 7: Tool priority test")
run_agent_test("Define 'weather'", thread_id="priority_test")