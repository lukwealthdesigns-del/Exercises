from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
from typing import Literal
import os

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found!")

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.5,
    api_key=openai_api_key
)

from langchain_core.documents import Document

python_docs = [
    Document(
        page_content="""Python Functions
A function is a block of code which only runs when it is called. You can pass data, known as parameters, into a function. A function can return data as a result.

Defining a Function:
def my_function():
    print("Hello from a function")

Calling a Function:
my_function()

Arguments:
Information can be passed into functions as arguments. Arguments are specified after the function name, inside the parentheses.

def greet(name):
    print(f"Hello, {name}!")

greet("Lukman")

Return Values:
To let a function return a value, use the return statement.

def add(a, b):
    return a + b

result = add(5, 3)

Default Parameters:
You can set default values for parameters.

def greet(name="World"):
    print(f"Hello, {name}!")

greet()

Lambda Functions:
A lambda function is a small anonymous function.

multiply = lambda x, y: x * y
print(multiply(5, 3))""",
        metadata={"topic": "functions", "difficulty": "beginner", "page": 1}
    ),
    Document(
        page_content="""Python Classes and Objects
Python is an object oriented programming language. Almost everything in Python is an object, with its properties and methods. A Class is like an object constructor, or a 'blueprint' for creating objects.

Creating a Class:
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old.")

Creating an Object:
person1 = Person("Lukman", 30)
person1.greet()

Inheritance:
Inheritance allows us to define a class that inherits all the methods and properties from another class.

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
    
    def study(self):
        print(f"{self.name} is studying.")

student1 = Student("Bayo", 20, "S12345")
student1.greet()
student1.study()""",
        metadata={"topic": "OOP", "difficulty": "intermediate", "page": 2}
    ),
    Document(
        page_content="""Python Lists and List Comprehensions
Lists are used to store multiple items in a single variable. Lists are created using square brackets.

Creating a List:
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]

List Comprehensions:
List comprehension offers a shorter syntax when you want to create a new list based on the values of an existing list.

Squares of numbers 1-5:
squares = [x**2 for x in range(1, 6)]

Even numbers from 1-10:
evens = [x for x in range(1, 11) if x % 2 == 0]

Nested List Comprehensions:
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]""",
        metadata={"topic": "data_structures", "difficulty": "beginner", "page": 3}
    ),
    Document(
        page_content="""Python Error Handling with Try-Except
The try block lets you test a block of code for errors. The except block lets you handle the error. The finally block lets you execute code, regardless of the result of the try- and except blocks.

Basic Try-Except:
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

Multiple Exceptions:
try:
    file = open("nonexistent.txt")
    data = file.read()
except FileNotFoundError:
    print("File not found!")

Raising Exceptions:
You can raise exceptions with the raise keyword.

def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age

try:
    validate_age(-5)
except ValueError as e:
    print(f"Invalid age: {e}")""",
        metadata={"topic": "error_handling", "difficulty": "intermediate", "page": 4}
    ),
    Document(
        page_content="""Python Decorators
A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.

Basic Decorator:
def my_decorator(func):
    def wrapper():
        print("Before function call.")
        func()
        print("After function call.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()

Decorators with Arguments:
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello, {name}!")""",
        metadata={"topic": "decorators", "difficulty": "advanced", "page": 5}
    )
]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100
)

doc_splits = text_splitter.split_documents(python_docs)

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=openai_api_key
)

chroma_path = "./chroma_db_python_agentic_rag"

vectorstore = Chroma(
    collection_name="python_programming_docs",
    persist_directory=chroma_path,
    embedding_function=embeddings
)

vectorstore.add_documents(documents=doc_splits)

@tool
def retrieve_python_docs(query: str) -> str:
    """
    Search for relevant Python programming documentation.
    Use this when user asks about Python concepts, syntax, or examples.
    Do not use for greetings, general conversation, or non-Python questions.
    """
    retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 4, "fetch_k": 6}
    )
    
    results = retriever.invoke(query)
    
    if not results:
        return "No relevant Python documentation found."
    
    formatted = []
    for i, doc in enumerate(results):
        topic = doc.metadata.get("topic", "unknown")
        difficulty = doc.metadata.get("difficulty", "unknown")
        page = doc.metadata.get("page", "unknown")
        
        formatted.append(
            f"Document {i+1} (Topic: {topic}, Difficulty: {difficulty}):\n"
            f"{doc.page_content}\n"
        )
    
    return "\n---\n".join(formatted)

system_prompt = SystemMessage(content="""You are a Python programming assistant with Python documentation access.

DO NOT retrieve for:
- Greetings: "Hello", "Hi", "How are you"
- General questions about capabilities
- Non-Python programming questions
- Simple math or calculations
- Casual conversation

DO retrieve for:
- Python programming questions: syntax, concepts, examples
- Questions about Python functions, classes, lists, error handling, decorators
- Requests for Python code examples
- Any Python programming question

When you retrieve documents, reference them in your answer. Include code examples when appropriate.
""")

tools = [retrieve_python_docs]
llm_with_tools = llm.bind_tools(tools)

def assistant(state: MessagesState) -> dict:
    messages = [system_prompt] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    return "__end__"

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

def real_time_conversation():
    print("\n" + "="*70)
    print("🤖 PYTHON PROGRAMMING ASSISTANT - Agentic RAG")
    print("="*70)
    print("Type 'exit' to end conversation")
    print("Type 'new' to start new conversation")
    print("="*70)
    
    thread_id = "python_001"
    conversation_counter = 1
    
    while True:
        user_input = input(f"\n[{thread_id}] You: ").strip()
        
        if user_input.lower() == 'exit':
            print("\nGoodbye! 👋")
            break
        
        if user_input.lower() == 'new':
            conversation_counter += 1
            thread_id = f"python_{conversation_counter:03d}"
            print(f"\n🔄 New conversation: {thread_id}")
            continue
        
        if not user_input:
            print("Please enter a question.")
            continue
        
        try:
            print("\n" + "="*70)
            print("🤖 Processing...")
            print("="*70)
            
            result = agent.invoke(
                {"messages": [HumanMessage(content=user_input)]},
                config={"configurable": {"thread_id": thread_id}}
            )
            
            last_message = result["messages"][-1]
            
            if isinstance(last_message, AIMessage):
                if last_message.tool_calls:
                    for message in result["messages"]:
                        if isinstance(message, AIMessage) and message.tool_calls:
                            tool_call = message.tool_calls[0]
                            print(f"🤖 Agent: [Searching Python docs for: {tool_call['args']['query']}]")
                        elif isinstance(message, ToolMessage):
                            content = message.content
                            if len(content) > 200:
                                content = content[:200] + "..."
                            print(f"📚 Retrieved: {content}")
                        elif isinstance(message, AIMessage) and not message.tool_calls:
                            print(f"🤖 Agent: {message.content}")
                else:
                    print(f"🤖 Agent: {last_message.content}")
            
            print("\n" + "="*70)
            
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("🤖 Python Programming Assistant - Agentic RAG System")
    print("Initializing...")
    print(f"✅ Documents loaded: {len(doc_splits)} chunks")
    print(f"✅ Tools: Python documentation retrieval")
    
    choice = input("\nStart conversation? (yes/no): ").strip().lower()
    
    if choice in ['yes', 'y', '']:
        real_time_conversation()
    else:
        print("Goodbye! 👋")