"""
Annotation service - handles all annotation-related business logic
"""
from typing import List, Dict

from talen.dal.mongo_dal import MongoDAL
from talen.models.annotation import Annotation
from talen.models.document import Document
from talen.exceptions import DocumentNotFoundError
from talen.util import get_annotations_from_client, make_client_doc
from talen.logger import get_logger

LOG = get_logger()


class AnnotationService:
    """Service for managing annotations"""

    def __init__(self, dal: MongoDAL):
        self.dal = dal

    def get_document_with_annotations(
        self,
        dataset_id: str,
        doc_id: str,
        username: str,
        labelset: Dict[str, str] = None
    ) -> Dict:
        """
        Load a document with user's annotations.

        Args:
            dataset_id: Dataset identifier
            doc_id: Document identifier
            username: Username for loading annotations
            labelset: Optional labelset configuration

        Returns:
            Client document dictionary with annotations

        Raises:
            DocumentNotFoundError: If document doesn't exist
        """
        # Load document and annotations
        document = self.dal.get_document(doc_id, dataset_id)
        if not document:
            raise DocumentNotFoundError(f"Document '{doc_id}' not found in dataset '{dataset_id}'")

        annotations = self.dal.get_annotations(dataset_id, doc_id, username)
        default_annotations = []

        # Convert to client format
        client_doc = make_client_doc(document, annotations, default_annotations)
        if not client_doc:
            raise DocumentNotFoundError(f"Failed to create client document for '{doc_id}'")

        # Add annotation status
        client_doc["isAnnotated"] = self.dal.is_document_annotated(dataset_id, doc_id, username)

        # Add labelset (use default if not provided)
        if labelset is None:
            labelset = {
                "O": "transparent",
                "PER": "#EADA48",  # Person - Yellow
                "ORG": "#37C4E3",  # Organization - Blue
                "LOC": "#4AC300",  # Location - Green
                "OTH": "#dc9e8c"   # Other - Light brown
            }
        client_doc["labelset"] = labelset

        return client_doc

    def save_document_annotations(
        self,
        dataset_id: str,
        doc_id: str,
        username: str,
        client_data: Dict
    ) -> int:
        """
        Save user annotations for a document.

        Args:
            dataset_id: Dataset identifier
            doc_id: Document identifier
            username: Username saving annotations
            client_data: Client annotation data (sentences, labels, etc.)

        Returns:
            Number of annotations saved

        Raises:
            DocumentNotFoundError: If document doesn't exist
        """
        # Retrieve original document to get Token objects
        document = self.dal.get_document(doc_id, dataset_id)
        if not document:
            raise DocumentNotFoundError(f"Document '{doc_id}' not found in dataset '{dataset_id}'")

        # Convert client data to annotations
        new_annotations = get_annotations_from_client(document, client_data, username)

        # Atomically replace all annotations
        self.dal.replace_annotations(dataset_id, doc_id, username, new_annotations)

        LOG.info(f"Saved {len(new_annotations)} annotations for document '{doc_id}' by user '{username}'")
        return len(new_annotations)

    def get_dataset_info(self, dataset_id: str, username: str) -> Dict:
        """
        Get dataset information including document lists for a user.

        Args:
            dataset_id: Dataset identifier
            username: Username for filtering annotations

        Returns:
            Dictionary with documentIDs, annotatedDocumentIDs, assignedDocumentIDs

        Raises:
            DocumentNotFoundError: If dataset doesn't exist
        """
        # Get document lists
        fnames = self.dal.get_document_list(dataset_id)
        if not fnames:
            raise DocumentNotFoundError(f"Dataset '{dataset_id}' not found or has no documents")

        annotated_fnames = self.dal.get_annotated_doc_ids(dataset_id, username)
        assigned_fnames = self.dal.get_assigned_doc_ids(dataset_id, username)

        return {
            "documentIDs": fnames,
            "annotatedDocumentIDs": annotated_fnames,
            "assignedDocumentIDs": assigned_fnames,
            "datasetID": dataset_id,
        }

    def get_dataset_stats(self, dataset_id: str, username: str) -> Dict:
        """
        Get statistics for a dataset and user.

        Args:
            dataset_id: Dataset identifier
            username: Username for filtering annotations

        Returns:
            Dictionary with numDocuments, numAnnotated, datasetID

        Raises:
            DocumentNotFoundError: If dataset doesn't exist
        """
        files = self.dal.get_document_list(dataset_id)
        if not files:
            raise DocumentNotFoundError(f"Dataset '{dataset_id}' not found or has no documents")

        annotated_files = self.dal.get_annotated_doc_ids(dataset_id, username)

        return {
            "numDocuments": len(files),
            "numAnnotated": len(annotated_files),
            "datasetID": dataset_id,
        }

    def get_all_dataset_stats(self) -> Dict:
        """
        Get statistics for all datasets.

        Returns:
            Dictionary with dataset lists and statistics
        """
        from collections import defaultdict

        dataset_dict = defaultdict(list)
        dataset_stats = self.dal.get_stats()
        dataset_ids = sorted(list(dataset_stats.keys()))

        for dataset_id in dataset_ids:
            parent_dataset = dataset_id.split("-")[0]
            dataset_dict[parent_dataset].append(dataset_id)

        return {
            "datasetDict": dataset_dict,
            "datasetIDs": dataset_ids,
            "datasetStats": dataset_stats
        }
