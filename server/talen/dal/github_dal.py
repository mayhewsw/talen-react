from typing import List
from git import Repo
import os
import shutil

from talen.config import Config


class GithubDAL():
    
    def __init__(self, config: Config) -> None:
        self.username = config.github_username
        self.password = config.github_password

    def clone_repo(self, repo_name: str) -> Repo:
        """
        repo_name is like "UNER_English-EWT"
        """

        # delete dir if it exists
        tmp_dir = f"/tmp/{repo_name}"
        if os.path.exists(tmp_dir):
            shutil.rmtree(tmp_dir)

        cloned_repo = Repo.clone_from(f'https://{self.username}:{self.password}@github.com/UniversalNER/{repo_name}.git',
                                tmp_dir,
                                branch='master')
        
        return cloned_repo

    def push_files(self, fnames: List[str], cloned_repo: Repo) -> None:
        # like: "en_ewt-ud-dev"
        git_dir = cloned_repo.working_tree_dir

        file_list = []
        for fname in fnames:
            # fname could be a full path, just get the filename
            tmp_name = f"{git_dir}/{os.path.basename(fname)}"
            shutil.move(fname, tmp_name)
            file_list.append(tmp_name)

        commit_message = 'Automated commit from TALEN'
        cloned_repo.index.add(file_list)
        cloned_repo.index.commit(commit_message)
        origin = cloned_repo.remote('origin')
        origin.push()