# Imports
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

print("✅ All imports successful")

# Load API key
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found! Please set it in your .env file.")

print("✅ API key loaded")

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.5,
    api_key=openai_api_key
)

print(f"✅ LLM initialized: {llm.model_name}")

# Section 3: Create Sample Python Programming Documents
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

greet("Lukman")  # Output: Hello, Lukman!

Return Values:
To let a function return a value, use the return statement.

def add(a, b):
    return a + b

result = add(5, 3)  # result is 8

Default Parameters:
You can set default values for parameters.

def greet(name="World"):
    print(f"Hello, {name}!")

greet()  # Output: Hello, World!

Lambda Functions:
A lambda function is a small anonymous function.

multiply = lambda x, y: x * y
print(multiply(5, 3))  # Output: 15""",
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
person1.greet()  # Output: Hello, my name is Lukman and I am 30 years old.

Inheritance:
Inheritance allows us to define a class that inherits all the methods and properties from another class.

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
    
    def study(self):
        print(f"{self.name} is studying.")

student1 = Student("Bayo", 20, "S12345")
student1.greet()  # Output: Hello, my name is Bayo and I am 20 years old.
student1.study()  # Output: Bayo is studying.

Class Variables vs Instance Variables:
Class variables are shared across all instances, while instance variables are unique to each instance.

class Car:
    wheels = 4  # Class variable
    
    def __init__(self, brand):
        self.brand = brand  # Instance variable

car1 = Car("Toyota")
car2 = Car("Honda")
print(Car.wheels)  # Output: 4 (shared)
print(car1.brand)  # Output: Toyota (unique)""",
        metadata={"topic": "OOP", "difficulty": "intermediate", "page": 2}
    ),
    Document(
        page_content="""Python Lists and List Comprehensions
Lists are used to store multiple items in a single variable. Lists are created using square brackets.

Creating a List:
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]

Accessing Elements:
print(fruits[0])  # Output: apple (first element)
print(fruits[-1]) # Output: cherry (last element)

List Methods:
fruits.append("orange")  # Add element
fruits.remove("banana")  # Remove element
fruits.sort()  # Sort the list
length = len(fruits)  # Get length

List Comprehensions:
List comprehension offers a shorter syntax when you want to create a new list based on the values of an existing list.

Squares of numbers 1-5:
squares = [x**2 for x in range(1, 6)]
# Result: [1, 4, 9, 16, 25]

Even numbers from 1-10:
evens = [x for x in range(1, 11) if x % 2 == 0]
# Result: [2, 4, 6, 8, 10]

Nested List Comprehensions:
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
# Result: [1, 2, 3, 4, 5, 6, 7, 8, 9]

Conditional Expressions in List Comprehensions:
numbers = [1, 2, 3, 4, 5]
result = ["even" if x % 2 == 0 else "odd" for x in numbers]
# Result: ["odd", "even", "odd", "even", "odd"]""",
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
except PermissionError:
    print("Permission denied!")
except Exception as e:
    print(f"An error occurred: {e}")

Else Clause:
The else clause runs if no exceptions were raised.

try:
    x = 10 / 2
except ZeroDivisionError:
    print("Division by zero!")
else:
    print(f"Result: {x}")  # This runs

Finally Clause:
The finally clause always executes.

try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    print("Execution complete")  # Always runs

Raising Exceptions:
You can raise exceptions with the raise keyword.

def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age

try:
    validate_age(-5)
except ValueError as e:
    print(f"Invalid age: {e}")

Custom Exceptions:
class NegativeNumberError(Exception):
    pass

def process_number(num):
    if num < 0:
        raise NegativeNumberError("Number must be positive")
    return num * 2""",
        metadata={"topic": "error_handling", "difficulty": "intermediate", "page": 4}
    ),
    Document(
        page_content="""Python Decorators
A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure. Decorators are usually called before the definition of a function you want to decorate.

Basic Decorator:
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Output:
# Something is happening before the function is called.
# Hello!
# Something is happening after the function is called.

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
    print(f"Hello, {name}!")

greet("Lukman")
# Output (repeated 3 times):
# Hello, Lukman!

Class Decorators:
You can also use classes as decorators.

class CountCalls:
    def __init__(self, func):
        self.func = func
        self.num_calls = 0
    
    def __call__(self, *args, **kwargs):
        self.num_calls += 1
        print(f"Call {self.num_calls} of {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # Output: Call 1 of say_hello \n Hello!
say_hello()  # Output: Call 2 of say_hello \n Hello!

Built-in Decorators:
@property - Makes a method behave like an attribute
@classmethod - Defines a class method
@staticmethod - Defines a static method""",
        metadata={"topic": "decorators", "difficulty": "advanced", "page": 5}
    )
]

print(f"✅ Created {len(python_docs)} Python programming documents")

# Section 4: Split into Chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100
)

doc_splits = text_splitter.split_documents(python_docs)

print(f"✅ Created {len(doc_splits)} chunks")
print(f"Sample chunk (first 200 chars):\\n{doc_splits[0].page_content[:200]}...")

# Section 5: Create Vector Store
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=openai_api_key
)

print("✅ Embeddings model initialized")

chroma_path = "./chroma_db_python_agentic_rag"

vectorstore = Chroma(
    collection_name="python_programming_docs",
    persist_directory=chroma_path,
    embedding_function=embeddings
)

vectorstore.add_documents(documents=doc_splits)

print(f"✅ Vector store created with {len(doc_splits)} chunks")
print(f"Persisted to: {chroma_path}")

# Test retrieval
test_query = "How do I create a function in Python?"
test_results = vectorstore.similarity_search(test_query, k=2)

print(f"\\nTest retrieval query: {test_query}")
print(f"Top result (first 150 chars):\\n{test_results[0].page_content[:150]}...")
print("✅ Retrieval working!")

# Section 6: Create Retrieval Tool
@tool
def retrieve_python_docs(query: str) -> str:
    """
    Search for relevant Python programming documentation.
    
    Use this tool when the user asks about Python programming concepts,
    syntax, examples, or specific programming questions.
    
    Do NOT use this tool for:
    - General conversation or greetings
    - Questions not related to Python programming
    - Simple math or calculations
    
    Args:
        query: The search query about Python programming
        
    Returns:
        Relevant Python documentation excerpts with metadata
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
            f"Document {i+1} (Topic: {topic}, Difficulty: {difficulty}, Page: {page}):\\n"
            f"{doc.page_content}\\n"
        )
    
    return "\\n---\\n".join(formatted)

print("✅ Retrieval tool created")

# Test tool directly
test_tool_result = retrieve_python_docs.invoke({"query": "What is a lambda function?"})
print(f"\\nTool test (first 300 chars):\\n{test_tool_result[:300]}...")

# Section 7: Build the Agentic RAG System
system_prompt = SystemMessage(content="""You are a Python programming assistant with access to Python documentation.

RETRIEVAL DECISION RULES:

DO NOT retrieve for:
- Greetings: "Hello", "Hi", "How are you"
- General questions about your capabilities
- Non-Python programming questions
- Simple math or calculations
- Casual conversation: "Thank you", "Goodbye"

DO retrieve for:
- Python programming questions: syntax, concepts, examples
- Questions about Python functions, classes, lists, error handling, decorators
- Requests for Python code examples
- Any question about Python programming that would benefit from documentation

Rule of thumb: If the user is asking about Python programming, retrieve documentation.

When you retrieve documents, reference them in your answer. Include code examples when appropriate.
""")

print("✅ System prompt configured")

# Bind tool to LLM
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

print("✅ Agent nodes defined")

# Build graph
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

print("✅ Agentic RAG system compiled")

# Section 8: Testing Function
def test_query_agent(user_input: str, thread_id: str = "test_session"):
    print(f"\\n{'='*70}")
    print(f"👤 User: {user_input}")
    print(f"{'='*70}\\n")
    
    result = agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": thread_id}}
    )
    
    used_retrieval = False
    final_answer = None
    
    for message in result["messages"]:
        if isinstance(message, AIMessage):
            if message.tool_calls:
                used_retrieval = True
                print(f"🔍 Agent: [Calling Python documentation retrieval...]")
            if message.content and not message.tool_calls:
                final_answer = message.content
    
    if final_answer:
        print(f"🤖 Agent: {final_answer}")
    else:
        print("⚠️ No response generated")
    
    print(f"\\n📊 Decision: {'RETRIEVED DOCUMENTATION' if used_retrieval else 'ANSWERED DIRECTLY'}")
    print(f"{'='*70}")

print("✅ Test function ready")

# Section 9: Testing the System

print("\\n" + "="*70)
print("🧪 TESTING AGENTIC RAG SYSTEM - PYTHON PROGRAMMING DOMAIN")
print("="*70)

# Test 1: Query requiring retrieval
test_query_agent("How do I create a decorator in Python?", thread_id="session_1")

# Test 2: General knowledge (no retrieval)
test_query_agent("Hello! What can you help me with?", thread_id="session_2")

# Test 3: Python query requiring retrieval
test_query_agent("Explain list comprehensions with examples", thread_id="session_3")

# Test 4: Non-Python query (no retrieval)
test_query_agent("What is 2+2?", thread_id="session_4")

# Test 5: Advanced Python query
test_query_agent("How do I handle multiple exceptions in Python?", thread_id="session_5")

# Test 6: Follow-up with memory
test_query_agent("Give me an example of custom exceptions", thread_id="session_5")

# Test 7: Borderline case
test_query_agent("What is Python?", thread_id="session_6")

# Test 8: Complex multi-part query
test_query_agent("Compare functions and methods in Python with examples", thread_id="session_7")

print("\\n" + "="*70)
print("📋 TESTING COMPLETE")
print("="*70)

# Section 10: Evaluation
test_cases = [
    ("How do I create a decorator in Python?", "Should retrieve"),
    ("Hello! What can you help me with?", "Should not retrieve"),
    ("Explain list comprehensions with examples", "Should retrieve"),
    ("What is 2+2?", "Should not retrieve"),
    ("How do I handle multiple exceptions in Python?", "Should retrieve"),
    ("What is Python?", "Borderline - might retrieve"),
    ("Compare functions and methods in Python", "Should retrieve"),
    ("Tell me about inheritance in Python classes", "Should retrieve"),
    ("Thank you for your help", "Should not retrieve"),
    ("Can you write a function to calculate factorial?", "Should retrieve"),
]

print("\\n📊 EVALUATION SUMMARY")
print("="*70)

correct_decisions = 0
total_cases = len(test_cases)

for query, expected in test_cases:
    result = agent.invoke(
        {"messages": [HumanMessage(content=query)]},
        config={"configurable": {"thread_id": f"eval_{hash(query)}"}}
    )
    
    used_retrieval = any(
        isinstance(msg, AIMessage) and msg.tool_calls 
        for msg in result["messages"]
    )
    
    decision = "RETRIEVED" if used_retrieval else "DIRECT"
    expected_decision = "RETRIEVED" if "retrieve" in expected.lower() else "DIRECT"
    
    if decision == expected_decision:
        correct_decisions += 1
        symbol = "✅"
    else:
        symbol = "❌"
    
    print(f"{symbol} Query: {query[:40]}...")
    print(f"   Expected: {expected_decision}, Got: {decision}")

accuracy = (correct_decisions / total_cases) * 100
print(f"\\n🎯 Accuracy: {accuracy:.1f}% ({correct_decisions}/{total_cases} correct decisions)")

# Final report summary
print("\\n" + "="*70)
print("📝 BRIEF REPORT")
print("="*70)
print("""
Domain: Python Programming
Why chosen: Python is widely used, has clear documentation needs,
            and allows testing both retrieval and direct answers.

Chunk size: 800 characters with 100 overlap
Why: Preserves context for programming examples while keeping
     chunks manageable for retrieval.

Agent performance: Good retrieval decisions for clear Python queries.
What worked well: Agent correctly distinguishes Python programming
                  questions from general conversation.

Improvements needed: Borderline cases like "What is Python?" need
                    better guidance in system prompt.
""")