"""
GitHub service - handles GitHub export operations
"""
from typing import Tuple

from talen.dal.mongo_dal import MongoDAL
from talen.dal.github_dal import GithubDAL
from talen.controller.file_downloader import download_data
from talen.exceptions import ExternalServiceError, DatasetNotFoundError
from talen.logger import get_logger

LOG = get_logger()


class GitHubService:
    """Service for GitHub export operations"""

    def __init__(self, mongo_dal: MongoDAL, github_dal: GithubDAL):
        self.mongo_dal = mongo_dal
        self.github_dal = github_dal

    def export_to_github(self, repo_name: str, dataset_key: str) -> Tuple[str, str]:
        """
        Export dataset annotations to a GitHub repository.

        Args:
            repo_name: GitHub repository name (e.g., "username/repo")
            dataset_key: Dataset identifier to export

        Returns:
            Tuple of (annotations_file, stats_file) that were pushed

        Raises:
            DatasetNotFoundError: If dataset doesn't exist
            ExternalServiceError: If GitHub operations fail
        """
        try:
            # Clone the repository
            LOG.info(f"Cloning repository: {repo_name}")
            cloned_repo = self.github_dal.clone_repo(repo_name)

            # Download annotations and statistics
            LOG.info(f"Downloading data for dataset: {dataset_key}")
            fname, stats_fname = download_data(dataset_key, self.mongo_dal)

            if not fname or not stats_fname:
                raise DatasetNotFoundError(f"Failed to download data for dataset '{dataset_key}'")

            # Push files to GitHub
            LOG.info(f"Pushing files to GitHub: {fname}, {stats_fname}")
            self.github_dal.push_files([fname, stats_fname], cloned_repo)

            LOG.info(f"Successfully exported dataset '{dataset_key}' to '{repo_name}'")
            return fname, stats_fname

        except Exception as e:
            LOG.error(f"Failed to export to GitHub: {e}")
            if isinstance(e, (DatasetNotFoundError, ExternalServiceError)):
                raise
            raise ExternalServiceError(f"GitHub export failed: {str(e)}")
