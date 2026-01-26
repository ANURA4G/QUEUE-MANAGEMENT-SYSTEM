# Contributing to Hybrid Queue Management System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/HYBRID-QUEUE-MANAGEMENT-SYSTEM.git
   cd HYBRID-QUEUE-MANAGEMENT-SYSTEM
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/HYBRID-QUEUE-MANAGEMENT-SYSTEM.git
   ```

## 💻 Development Setup

### Backend (Python/Flask)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env

# Run development server
python app.py
```

### Frontend (React/TypeScript)

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env

# Run development server
npm run dev
```

## 🔧 Making Changes

### Branch Naming Convention

Use descriptive branch names:
- `feature/add-notification-system`
- `fix/queue-position-calculation`
- `docs/update-api-documentation`
- `refactor/improve-queue-manager`

### Creating a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(queue): add priority boost for disabled persons
fix(api): correct queue position calculation
docs(readme): update deployment instructions
```

## 📤 Submitting Changes

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what and why
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots for UI changes

3. **Respond to feedback** and make requested changes

4. **Ensure CI passes** before requesting review

## 🎨 Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for function parameters and returns
- Document functions with docstrings
- Maximum line length: 100 characters

```python
def calculate_priority(age: int) -> int:
    """
    Calculate queue priority based on age.
    
    Args:
        age: Person's age in years
        
    Returns:
        Priority level (0 = highest, 1 = normal)
    """
    return 0 if age >= 80 else 1
```

### TypeScript (Frontend)

- Use TypeScript strict mode
- Define interfaces for all data structures
- Use functional components with hooks
- Follow React best practices

```typescript
interface QueueEntry {
  life_certificate_no: string;
  name: string;
  age: number;
  priority: number;
}

const QueueItem: React.FC<{ entry: QueueEntry }> = ({ entry }) => {
  return (
    <div className="queue-item">
      <span>{entry.name}</span>
      <span>Position: {entry.position}</span>
    </div>
  );
};
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Follow mobile-first approach
- Ensure accessibility compliance

## 🐛 Reporting Issues

When reporting bugs, include:

1. **Clear title** describing the issue
2. **Environment details** (OS, browser, Node/Python version)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots** if applicable
7. **Error messages** or logs

### Issue Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 18.19.0]
- Python: [e.g., 3.11]
```

## ✅ Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main
- [ ] No console errors or warnings

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping improve this project!

---

Questions? Open an issue or start a discussion on GitHub.
