import os
import unittest

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class TestInteractiveSystems(unittest.TestCase):
    def test_curriculum_and_architecture_docs(self):
        docs_dir = os.path.join(repo_root, "docs")
        self.assertTrue(os.path.isdir(docs_dir))
        self.assertTrue(os.path.exists(os.path.join(docs_dir, "ARCHITECTURE.md")))
        self.assertTrue(os.path.exists(os.path.join(docs_dir, "CURRICULUM_MATRIX.md")))

    def test_core_academic_modules_exist(self):
        # Verify core course modules exist
        expected_modules = ["Compilation", "docs"]
        for mod in expected_modules:
            p = os.path.join(repo_root, mod)
            self.assertTrue(os.path.exists(p), f"Module {mod} should exist")


if __name__ == "__main__":
    unittest.main()
