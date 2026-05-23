import sys
import os
from pathlib import Path

# Set up paths
current_dir = Path(__file__).parent
project_root = current_dir.parent
backend_dir = project_root / 'backend'

# Add backend to Python path
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(project_root))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Configure Django
import django
django.setup()

# Import and export WSGI app
from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()


