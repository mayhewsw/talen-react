#!/usr/bin/env python3
"""
Migration script to set up the annotation_status collection.
This replaces the "dummy annotation" hack with a proper status tracking collection.

This script will:
1. Create database indexes
2. Migrate existing annotation data to the new annotation_status collection
3. Remove dummy annotations (annotations with index=-1)

Usage:
    python scripts/migrate_to_annotation_status.py
"""
import os
import sys

# Add parent directory to path so we can import talen
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from talen.config import Config
from talen.dal.mongo_dal import MongoDAL
from talen.models.annotation_status import AnnotationStatus
from talen.logger import get_logger, setup_logger

setup_logger()
LOG = get_logger()


def migrate_annotation_status(mongo_dal: MongoDAL):
    """
    Migrate existing annotation data to the annotation_status collection.
    Creates AnnotationStatus records for all users who have annotated documents.
    """
    LOG.info("Starting annotation_status migration...")

    # Get all unique combinations of dataset_id, doc_id, and user_id from annotations
    pipeline = [
        {
            "$group": {
                "_id": {
                    "dataset_id": "$dataset_id",
                    "doc_id": "$doc_id",
                    "user_id": "$user_id"
                }
            }
        }
    ]

    unique_combos = list(mongo_dal.annotations.aggregate(pipeline))
    LOG.info(f"Found {len(unique_combos)} unique document/user combinations")

    migrated_count = 0
    for combo in unique_combos:
        dataset_id = combo["_id"]["dataset_id"]
        doc_id = combo["_id"]["doc_id"]
        user_id = combo["_id"]["user_id"]

        # Check if status already exists
        if not mongo_dal.is_document_annotated(dataset_id, doc_id, user_id):
            mongo_dal.mark_document_annotated(dataset_id, doc_id, user_id)
            migrated_count += 1

    LOG.info(f"Migrated {migrated_count} annotation status records")
    return migrated_count


def remove_dummy_annotations(mongo_dal: MongoDAL):
    """
    Remove old dummy annotations (annotations with index=-1).
    These are no longer needed with the annotation_status collection.
    """
    LOG.info("Removing dummy annotations...")

    # Find all annotations with index=-1 (the dummy marker)
    result = mongo_dal.annotations.delete_many({"index": -1})
    deleted_count = result.deleted_count

    LOG.info(f"Removed {deleted_count} dummy annotations")
    return deleted_count


def create_indexes(mongo_dal: MongoDAL):
    """Create all database indexes"""
    LOG.info("Creating database indexes...")
    mongo_dal.create_indexes()
    return True


def main():
    """Main entry point"""
    env = os.environ.get("ENV", "dev")
    LOG.info(f"Running migration for environment: {env}")

    # Load config and connect to database
    config = Config(env)
    mongo_dal = MongoDAL(config.mongo_url)

    LOG.info("=" * 60)
    LOG.info("ANNOTATION STATUS MIGRATION")
    LOG.info("=" * 60)

    # Step 1: Create indexes
    LOG.info("\nStep 1: Creating database indexes...")
    create_indexes(mongo_dal)

    # Step 2: Migrate annotation status
    LOG.info("\nStep 2: Migrating annotation status...")
    migrated = migrate_annotation_status(mongo_dal)

    # Step 3: Remove dummy annotations
    LOG.info("\nStep 3: Removing dummy annotations...")
    removed = remove_dummy_annotations(mongo_dal)

    LOG.info("\n" + "=" * 60)
    LOG.info("MIGRATION COMPLETE")
    LOG.info("=" * 60)
    LOG.info(f"Summary:")
    LOG.info(f"  - Database indexes: Created")
    LOG.info(f"  - Annotation status records: {migrated} migrated")
    LOG.info(f"  - Dummy annotations: {removed} removed")
    LOG.info("\nYour database has been successfully upgraded!")


if __name__ == "__main__":
    main()
