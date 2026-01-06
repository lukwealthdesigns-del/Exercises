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

def real_time_conversation():
    """Run a real-time conversation with the customer support agent."""
    print("\n" + "="*70)
    print(" ELECTRONICS STORE CUSTOMER SUPPORT")
    print("="*70)
    print("Type 'exit' to end the conversation")
    print("Type 'new' to start a new conversation with a different thread")
    print("="*70)
    
    thread_id = "user_001"  
    conversation_counter = 1
    
    while True:
       
        user_input = input(f"\n[{thread_id}] You: ").strip()
        
        
        if user_input.lower() == 'exit':
            print("\nThank you for contacting customer support. Have a great day! 👋")
            break
        
        
        if user_input.lower() == 'new':
            conversation_counter += 1
            thread_id = f"user_{conversation_counter:03d}"
            print(f"\n🔄 Starting new conversation with thread ID: {thread_id}")
            print("Type 'exit' to end, 'new' to start another conversation")
            continue
        
        
        if not user_input:
            print("Please enter a message.")
            continue
        
        
        try:
            print("\n" + "="*70)
            print(f"Processing your query... (Thread: {thread_id})")
            print("="*70)
            
            
            result = support_agent.invoke(
                {"messages": [HumanMessage(content=user_input)]},
                config={"configurable": {"thread_id": thread_id}}
            )
            
            
            for message in result["messages"]:
                if isinstance(message, AIMessage):
                    print(f"\n🤖 Support: {message.content}")
            
            print("\n" + "="*70)
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Please try again or type 'exit' to quit.")


def pre_defined_conversations():
    """Run the pre-defined test conversations."""
    print("\n" + "="*70)
    print("🧪 TEST CONVERSATION MODE - Customer Support Agent")
    print("="*70)
    
    run_customer_conversation("I bought a laptop last week", thread_id="cust_001")
    run_customer_conversation("It won't turn on", thread_id="cust_001")
    run_customer_conversation("What kind of laptop was it again?", thread_id="cust_001")
    
    print("\n" + "="*70)
    print("🔄 SEPARATE CONVERSATION - Different Customer")
    print("="*70)
    run_customer_conversation("My phone battery drains quickly", thread_id="cust_002")
    run_customer_conversation("It's an iPhone 14", thread_id="cust_002")

if __name__ == "__main__":
    
    print("Select conversation mode:")
    print("1. Real-time conversation (interactive)")
    print("2. Pre-defined test conversations")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        real_time_conversation()
    elif choice == "2":
        pre_defined_conversations()
    else:
        print("Invalid choice. Defaulting to real-time conversation.")
        real_time_conversation()