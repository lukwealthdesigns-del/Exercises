from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found! Please set it in your .env file.")

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=openai_api_key
)

sys_msg = SystemMessage(
    content="You are a helpful customer support representative for an electronics store. Be friendly, professional, and try to solve the customer's issues. Ask clarifying questions when needed."
)

def customer_support_agent(state: MessagesState) -> dict:
    messages = [sys_msg] + state["messages"]
    response = llm.invoke(messages)
    return {"messages": [AIMessage(content=response.content)]}

builder = StateGraph(MessagesState)

builder.add_node("customer_support", customer_support_agent)

builder.add_edge(START, "customer_support")
builder.add_edge("customer_support", END)

memory = MemorySaver()

support_agent = builder.compile(checkpointer=memory)

print("✅ Customer support agent built successfully!")

def run_customer_conversation(user_input: str, thread_id: str):
    result = support_agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    
    for message in result["messages"]:
        if isinstance(message, HumanMessage):
            print(f"\nCustomer: {message.content}")
        elif isinstance(message, AIMessage):
            print(f"Support: {message.content}")
    
    print("\n" + "="*70)

print("\n TEST CONVERSATION - Customer Support Agent")
print("="*70)

run_customer_conversation("I bought a laptop last week", thread_id="cust_001")

run_customer_conversation("It won't turn on", thread_id="cust_001")

run_customer_conversation("What kind of laptop was it again?", thread_id="cust_001")

print("\n SEPARATE CONVERSATION - Different Customer")
run_customer_conversation("My phone battery drains quickly", thread_id="cust_002")
run_customer_conversation("It's an iPhone 14", thread_id="cust_002")