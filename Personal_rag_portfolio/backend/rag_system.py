"""
backend/rag_system.py - SIMPLIFIED without memory modules
"""
import os
from dotenv import load_dotenv
from typing import List, Tuple
import hashlib

# Load environment
load_dotenv()

# SIMPLIFIED IMPORTS - No memory modules!
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser

class LukmanRAGSystem:
    def __init__(self, pdf_path: str = None):
        """Initialize SIMPLIFIED RAG system - No memory headaches!"""
        print("🚀 Initializing Simplified RAG System...")
        
        self.pdf_path = pdf_path
        self.pdf_loaded = False
        self.vector_db_ready = False
        self.llm_connected = False
        self.total_chunks = 0
        
        # SIMPLE: In-memory session storage (no external memory modules)
        self.session_data = {}
        
        # Initialize core components
        self.embeddings = self._setup_embeddings()
        self.llm = self._setup_llm()
        self.vectorstore = None
        self.retriever = None
        self.rag_chain = None
        
        # Load default PDF if provided
        if pdf_path and os.path.exists(pdf_path):
            self.process_pdf(pdf_path)
        else:
            print("⚠️  No PDF path provided. Use process_pdf() to load one.")
    
    def _setup_embeddings(self):
        """Setup local embeddings (free)"""
        try:
            embeddings = HuggingFaceEmbeddings(
                model_name="all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            print("✅ Local embeddings ready (all-MiniLM-L6-v2)")
            return embeddings
        except Exception as e:
            print(f"❌ Embeddings setup failed: {e}")
            # Fallback to default embeddings
            from chromadb.utils import embedding_functions
            return embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
    
    def _setup_llm(self):
        """Setup Gemini LLM"""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("❌ GOOGLE_API_KEY not found in .env file")
        
        # Try different Gemini models
        model_names = [
            "gemini-2.5-flash",  # Most reliable
            "gemini-1.5-flash-001",     # Stable
            "gemini-1.0-pro",           # Fallback
        ]
        
        for model_name in model_names:
            try:
                print(f"  Testing model: {model_name}...")
                llm = ChatGoogleGenerativeAI(
                    model=model_name,
                    google_api_key=api_key,
                    temperature=0.1,  # Low for factual responses
                    max_output_tokens=1024
                )
                
                # Quick test
                test_response = llm.invoke("Say 'Hello'")
                print(f"✅ Connected to: {model_name}")
                print(f"   Test: '{test_response.content}'")
                self.llm_connected = True
                return llm
                
            except Exception as e:
                error_msg = str(e)
                print(f"   ❌ {model_name} failed: {error_msg[:60]}...")
                continue
        
        raise ValueError("❌ Could not connect to any Gemini model. Check API key.")
    
    def process_pdf(self, pdf_path: str) -> int:
        """Process PDF and create vector store"""
        try:
            print(f"\n📄 Processing PDF: {pdf_path}")
            
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"PDF not found: {pdf_path}")
            
            # Load PDF
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            print(f"   Loaded {len(documents)} pages")
            
            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
                separators=["\n\n", "\n", " ", ""]
            )
            
            chunks = text_splitter.split_documents(documents)
            self.total_chunks = len(chunks)
            print(f"   Created {self.total_chunks} chunks")
            
            # Create vector store
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory="./chroma_db_lukman",
                collection_name="lukman_knowledge"
            )
            
            # Create retriever
            self.retriever = self.vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}  # Get top 3 chunks
            )
            
            # Build SIMPLE RAG chain (no memory)
            self._build_simple_chain()
            
            self.pdf_loaded = True
            self.vector_db_ready = True
            
            print("✅ PDF processing complete!")
            return self.total_chunks
            
        except Exception as e:
            print(f"❌ PDF processing failed: {e}")
            raise
    
    def _build_simple_chain(self):
        """Build a SIMPLE RAG chain without memory"""
        
        # SIMPLE prompt template - no chat history parameter
        prompt_template = """
        You are "Lukwealth Assistant", an AI representing Lukman Adebayo Ibrahim (Lukwealth).
        
        CONTEXT FROM LUKMAN'S KNOWLEDGE BASE:
        {context}
        
        USER QUESTION: {question}
        
        INSTRUCTIONS:
        1. Answer using ONLY the context above
        2. Be professional, accurate, and helpful
        3. When sharing contact info, format clearly:
           • Email: lukwealthdev@gmail.com
           • LinkedIn: linkedin.com/in/lukman-ibrahim-21ba67276
           • GitHub: github.com/lukwealthdesigns-del
           • Portfolio: behance.net/lukmanibrahim9
           • Phone: +2347085125588 (only share if explicitly requested)
        4. For technical questions, provide detailed explanations
        5. If information isn't in context, say: "I don't have that specific information in Lukman's knowledge base"
        6. Always invite further questions
        
        ANSWER:
        """
        
        prompt = ChatPromptTemplate.from_template(prompt_template)
        
        # Format documents function
        def format_docs(docs):
            formatted = []
            for i, doc in enumerate(docs, 1):
                source = doc.metadata.get('source', 'PDF')
                page = doc.metadata.get('page', 'N/A')
                content = doc.page_content
                formatted.append(f"[Source {i}: {source}, Page {page}]\n{content}")
            return "\n\n".join(formatted)
        
        # SIMPLE chain - no memory, just retrieval + generation
        self.rag_chain = (
            RunnableParallel(
                context=self.retriever | format_docs,
                question=RunnablePassthrough()
            )
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        print("✅ Built simple RAG chain (no memory modules needed)")
    
    def get_response(self, question: str, session_id: str = "default") -> Tuple[str, List[str]]:
        """Get response for a question - SIMPLIFIED"""
        if not self.rag_chain:
            raise ValueError("❌ RAG system not ready. Please load a PDF first.")
        
        print(f"\n🤔 Processing: '{question[:50]}...'")
        
        try:
            # Get retrieved documents
            retrieved_docs = self.retriever.invoke(question)
            sources = [
                f"Page {doc.metadata.get('page', 'N/A')}: {doc.page_content[:80]}..."
                for doc in retrieved_docs
            ]
            
            # Generate response using SIMPLE chain
            response = self.rag_chain.invoke(question)
            
            print(f"✅ Response generated ({len(response)} chars)")
            return response, sources
            
        except Exception as e:
            print(f"❌ Error generating response: {e}")
            return f"Error: {str(e)}", []
    
    def get_system_status(self):
        """Get system status"""
        return {
            "pdf_loaded": self.pdf_loaded,
            "vector_db_ready": self.vector_db_ready,
            "llm_connected": self.llm_connected,
            "total_chunks": self.total_chunks,
            "vector_db_path": "./chroma_db_lukman"
        }
    
    def clear_data(self):
        """Clear all data"""
        self.session_data = {}
        print("✅ Session data cleared")

# Helper function to create default instance
def create_default_rag():
    """Create RAG system with default PDF if exists"""
    default_pdf = "Lukman_Ibrahim_Knowledge_Base.pdf"
    
    if os.path.exists(default_pdf):
        print(f"📁 Found default PDF: {default_pdf}")
        return LukmanRAGSystem(default_pdf)
    else:
        print(f"⚠️  Default PDF not found: {default_pdf}")
        print("   Create PDF or use process_pdf() method later.")
        return LukmanRAGSystem()