"""
Batch Processing Service

Handles:
- Multi-document analysis in parallel
- Bulk document processing
- Scheduled analysis jobs
- Progress tracking
- Result aggregation
"""

from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import uuid


class BatchStatus(str, Enum):
    """Batch processing status"""
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    PARTIAL = "partial"
    FAILED = "failed"
    CANCELLED = "cancelled"


class BatchProcessor:
    """Process multiple documents in parallel"""

    def __init__(self, max_concurrent: int = 5):
        self.max_concurrent = max_concurrent
        self.batch_jobs: Dict[str, Dict[str, Any]] = {}
        self.semaphore = asyncio.Semaphore(max_concurrent)

    async def create_batch(self, user_id: str, document_ids: List[str], 
                          analysis_type: str = "full",
                          priority: str = "normal") -> Dict[str, Any]:
        """Create a new batch job"""
        batch_id = str(uuid.uuid4())
        
        batch = {
            "batch_id": batch_id,
            "user_id": user_id,
            "document_ids": document_ids,
            "analysis_type": analysis_type,
            "priority": priority,
            "status": BatchStatus.QUEUED.value,
            "created_at": datetime.utcnow().isoformat(),
            "started_at": None,
            "completed_at": None,
            "total_documents": len(document_ids),
            "processed_documents": 0,
            "failed_documents": 0,
            "results": {},
            "errors": {},
            "progress_percentage": 0,
        }
        
        self.batch_jobs[batch_id] = batch
        return batch

    async def process_batch(self, batch_id: str, 
                           processor_func: Callable) -> Dict[str, Any]:
        """Process all documents in batch"""
        if batch_id not in self.batch_jobs:
            raise ValueError(f"Batch {batch_id} not found")
        
        batch = self.batch_jobs[batch_id]
        batch["status"] = BatchStatus.PROCESSING.value
        batch["started_at"] = datetime.utcnow().isoformat()
        
        document_ids = batch["document_ids"]
        total = len(document_ids)
        
        # Create tasks with semaphore for concurrency control
        tasks = [
            self._process_with_semaphore(
                batch_id, doc_id, processor_func
            )
            for doc_id in document_ids
        ]
        
        # Process all documents concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Aggregate results
        processed_count = 0
        failed_count = 0
        
        for doc_id, result in zip(document_ids, results):
            if isinstance(result, Exception):
                batch["errors"][doc_id] = str(result)
                failed_count += 1
            else:
                batch["results"][doc_id] = result
                processed_count += 1
        
        batch["processed_documents"] = processed_count
        batch["failed_documents"] = failed_count
        batch["completed_at"] = datetime.utcnow().isoformat()
        
        # Determine final status
        if failed_count == 0:
            batch["status"] = BatchStatus.COMPLETED.value
        elif processed_count == 0:
            batch["status"] = BatchStatus.FAILED.value
        else:
            batch["status"] = BatchStatus.PARTIAL.value
        
        batch["progress_percentage"] = 100
        
        return batch

    async def _process_with_semaphore(self, batch_id: str, doc_id: str,
                                     processor_func: Callable) -> Any:
        """Process document with semaphore for concurrency control"""
        async with self.semaphore:
            try:
                result = await processor_func(doc_id)
                
                # Update progress
                batch = self.batch_jobs.get(batch_id)
                if batch:
                    processed = batch["processed_documents"] + batch["failed_documents"]
                    total = batch["total_documents"]
                    batch["progress_percentage"] = int((processed / total) * 100)
                
                return result
            except Exception as e:
                raise e

    async def get_batch_status(self, batch_id: str) -> Dict[str, Any]:
        """Get batch processing status"""
        if batch_id not in self.batch_jobs:
            raise ValueError(f"Batch {batch_id} not found")
        
        return self.batch_jobs[batch_id]

    async def get_batch_results(self, batch_id: str) -> Dict[str, Any]:
        """Get batch results"""
        batch = await self.get_batch_status(batch_id)
        
        return {
            "batch_id": batch_id,
            "status": batch["status"],
            "results": batch["results"],
            "errors": batch["errors"],
            "summary": {
                "total": batch["total_documents"],
                "processed": batch["processed_documents"],
                "failed": batch["failed_documents"],
                "success_rate": (batch["processed_documents"] / batch["total_documents"] * 100)
                               if batch["total_documents"] > 0 else 0,
            }
        }

    async def cancel_batch(self, batch_id: str) -> Dict[str, Any]:
        """Cancel batch processing"""
        if batch_id not in self.batch_jobs:
            raise ValueError(f"Batch {batch_id} not found")
        
        batch = self.batch_jobs[batch_id]
        batch["status"] = BatchStatus.CANCELLED.value
        
        return batch

    def get_user_batches(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all batches for a user"""
        return [b for b in self.batch_jobs.values() if b["user_id"] == user_id]

    def cleanup_old_batches(self, days: int = 7):
        """Clean up old batch jobs (older than specified days)"""
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        to_delete = []
        for batch_id, batch in self.batch_jobs.items():
            if batch["completed_at"] and batch["completed_at"] < cutoff_date:
                to_delete.append(batch_id)
        
        for batch_id in to_delete:
            del self.batch_jobs[batch_id]
        
        return len(to_delete)


# Global batch processor instance
batch_processor = BatchProcessor(max_concurrent=5)
