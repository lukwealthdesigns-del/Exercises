# Importing Libraries
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

# Loading environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found! Please set it in your .env file.")

# Initializing the LLM (GPT-4o-mini as shown in the codebook)
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=openai_api_key
)

# System prompt for customer support (modified from codebook example)
sys_msg = SystemMessage(
    content="You are a helpful customer support representative for an electronics store. Be friendly, professional, and try to solve the customer's issues. Ask clarifying questions when needed."
)

def customer_support_agent(state: MessagesState) -> dict:
    """
    The customer support agent node - processes messages and generates response.
    Follows exact same pattern as the 'assistant' function in the codebook.
    """
    # Combine system prompt with conversation history (exactly as in codebook)
    messages = [sys_msg] + state["messages"]
    
    # Get response from LLM (exactly as in codebook)
    response = llm.invoke(messages)
    
    # Return as state update (exactly as in codebook)
    return {"messages": [AIMessage(content=response.content)]}

# Create a StateGraph with MessagesState (exactly as in codebook)
builder = StateGraph(MessagesState)

# Add the customer support node (same pattern as adding 'assistant' node)
builder.add_node("customer_support", customer_support_agent)

# Define the flow: START → customer_support → END (exactly as in codebook)
builder.add_edge(START, "customer_support")
builder.add_edge("customer_support", END)

# Create a memory checkpointer (exactly as in codebook)
memory = MemorySaver()

# Compile the graph WITH memory (exactly as in codebook)
support_agent = builder.compile(checkpointer=memory)

print("✅ Customer support agent built successfully!")

# Helper function for conversations (same pattern as codebook)
def run_customer_conversation(user_input: str, thread_id: str):
    """
    Send a message to the agent and get response.
    Follows exact same pattern as codebook's run_conversation function.
    """
    # Invoke the agent (exactly as in codebook)
    result = support_agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    
    # Print the conversation (exactly as in codebook)
    for message in result["messages"]:
        if isinstance(message, HumanMessage):
            print(f"\nCustomer: {message.content}")
        elif isinstance(message, AIMessage):
            print(f"Support: {message.content}")
    
    print("\n" + "="*70)

# Test with the example conversation from the exercise
print("\n TEST CONVERSATION - Customer Support Agent")
print("="*70)

# First message
run_customer_conversation("I bought a laptop last week", thread_id="cust_001")

# Follow-up question
run_customer_conversation("It won't turn on", thread_id="cust_001")

# Additional test to show memory works
run_customer_conversation("What kind of laptop was it again?", thread_id="cust_001")

# Test separate conversation (different thread_id)
print("\n🟢 SEPARATE CONVERSATION - Different Customer")
run_customer_conversation("My phone battery drains quickly", thread_id="cust_002")
run_customer_conversation("It's an iPhone 14", thread_id="cust_002")