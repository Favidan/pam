class IndexationError(Exception):
    """Base error for the indexation module."""


class JobAlreadyRunningError(IndexationError):
    """Raised when a job is requested while another is already running."""


class AdapterError(IndexationError):
    """Raised when a source adapter fails to read or list."""


class ExtractionError(IndexationError):
    """Raised when text extraction fails for a single file."""
