"""
backend/main.py - UPDATED without memory dependencies
"""
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import our SIMPLIFIED RAG system
from rag_system import LukmanRAGSystem

# Initialize FastAPI
app = FastAPI(
    title="Lukman's RAG Portfolio API",
    description="SIMPLIFIED API - No memory modules",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = None

# SIMPLIFIED models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

class SystemStatus(BaseModel):
    status: str
    pdf_loaded: bool
    vector_db_ready: bool
    llm_connected: bool
    total_chunks: int

@app.on_event("startup")
async def startup_event():
    """Initialize RAG system on startup"""
    global rag_system
    try:
        rag_system = LukmanRAGSystem()
        print("\n" + "="*60)
        print("✅ LUKMAN'S RAG SYSTEM STARTED (Simplified)")
        print("="*60)
        print("No langchain.memory or langchain.chains needed!")
        print("Working with:", rag_system.get_system_status())
    except Exception as e:
        print(f"⚠️  RAG System initialization failed: {e}")
        rag_system = None

@app.get("/")
async def root():
    return {
        "message": "Lukman's Simplified RAG API",
        "version": "2.0.0",
        "note": "No memory modules - Simple & Reliable",
        "endpoints": {
            "chat": "POST /api/chat",
            "status": "GET /api/status",
            "upload": "POST /api/upload-pdf",
            "profile": "GET /api/profile"
        }
    }

@app.get("/api/status")
async def get_status():
    """Get system status"""
    if not rag_system:
        return SystemStatus(
            status="offline",
            pdf_loaded=False,
            vector_db_ready=False,
            llm_connected=False,
            total_chunks=0
        )
    
    status = rag_system.get_system_status()
    return SystemStatus(
        status="online",
        pdf_loaded=status["pdf_loaded"],
        vector_db_ready=status["vector_db_ready"],
        llm_connected=status["llm_connected"],
        total_chunks=status["total_chunks"]
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Handle chat messages - SIMPLIFIED"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        response, sources = rag_system.get_response(message.message)
        return ChatResponse(response=response, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a new PDF"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    try:
        # Save uploaded file
        temp_path = f"temp_{file.filename}"
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
        
        # Process with RAG system
        global rag_system
        if rag_system is None:
            rag_system = LukmanRAGSystem()
        
        chunks_created = rag_system.process_pdf(temp_path)
        
        # Cleanup
        os.remove(temp_path)
        
        return {
            "success": True,
            "message": f"PDF processed: {file.filename}",
            "chunks_created": chunks_created
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/api/profile")
async def get_profile():
    """Get Lukman's profile"""
    return {
        "name": "Lukman Adebayo Ibrahim",
        "nickname": "Lukwealth",
        "title": "AI Developer",
        "company": "Nigeria Communications Commission (NCC)",
        "contact": {
            "email": "lukwealthdev@gmail.com",
            "linkedin": "https://linkedin.com/in/lukman-ibrahim-21ba67276",
            "github": "https://github.com/lukwealthdesigns-del",
            "portfolio": "https://www.behance.net/lukmanibrahim9"
        }
    }

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    return {
        "status": "ok",
        "message": "API is running!",
        "rag_system_ready": rag_system is not None
    }

if __name__ == "__main__":
    import uvicorn
    print("\n🌐 Starting FastAPI server...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API Docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)