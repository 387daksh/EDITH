from datetime import datetime, timedelta
import random

# Mock Codebase Structure
# Simulating a repo with different critical modules
MODULES = [
    {"name": "Auth Service", "path": "backend/auth.py", "complexity": 8, "lines": 450},
    {"name": "Payment Gateway", "path": "backend/payments.py", "complexity": 10, "lines": 1200},
    {"name": "Frontend Core", "path": "frontend/core/App.tsx", "complexity": 6, "lines": 800},
    {"name": "HR Policy Engine", "path": "backend/hr_policy.py", "complexity": 7, "lines": 600},
    {"name": "Search Algo", "path": "backend/search.py", "complexity": 9, "lines": 350},
    {"name": "UI Components", "path": "frontend/components/Button.tsx", "complexity": 2, "lines": 150},
    {"name": "Database Schema", "path": "database/schema.sql", "complexity": 5, "lines": 200},
    {"name": "Recruitment AI", "path": "backend/hr_processing.py", "complexity": 8, "lines": 900},
]

# Mock Developers
DEVS = [
    {"email": "daksh@edith.ai", "name": "Daksh", "role": "admin"},
    {"email": "kanav@edith.ai", "name": "Kanav", "role": "dev"},
    {"email": "somya@edith.ai", "name": "Somya", "role": "hr"},
    {"email": "alex@company.tech", "name": "Alex", "role": "dev"},
]

def analyze_risk():
    """
    Generates mock risk data by correlating 'code complexity' with 'developer availability'.
    In a real system, this would:
    1. Run 'git blame' to find owners.
    2. Check 'leaves.json' for availability.
    3. Calculate Bus Factor.
    """
    
    risk_report = []
    
    for mod in MODULES:
        # 1. Assign a random 'Primary Owner'
        # Weighted implementation: Critical stuff owned by specific people to simulate risk
        if "Payment" in mod["name"] or "Search" in mod["name"]:
            owner = next(d for d in DEVS if d["name"] == "Kanav") # Kanav owns critical tech
        elif "HR" in mod["name"]:
            owner = next(d for d in DEVS if d["name"] == "Somya") # Somya owns HR
        elif "Auth" in mod["name"]:
             owner = next(d for d in DEVS if d["name"] == "Daksh") # Daksh owns Auth
        else:
            owner = random.choice(DEVS)

        # 2. Simulate Bus Factor (lines owned by primary author)
        # Higher complexity = Higher chance of being a silo
        ownership_percent = random.randint(60, 100) if mod["complexity"] > 7 else random.randint(30, 80)
        
        # 3. Simulate Availability (Mocking 'Leave' status)
        # Randomly mark some critical people as 'On Leave Soon'
        status = "Active"
        leave_start = None
        
        # Scripted scenarios for demo:
        # Kanav (Critical Dev) is going on leave -> HIGH RISK for Payments
        if owner["name"] == "Kanav":
            status = "On Leave Soon"
            leave_start = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        # 4. Calculate Risk Score (0-100)
        # Base risk from complexity
        risk_score = mod["complexity"] * 5 
        
        # Multiplier from Silo (High ownership)
        if ownership_percent > 80:
            risk_score += 20
            
        # Multiplier from Availability
        if status == "On Leave Soon":
            risk_score += 30 # CRITICAL SPIKE
            
        # Cap at 100
        risk_score = min(risk_score, 100)
        
        # Determine Status Label
        if risk_score > 80:
            risk_label = "CRITICAL"
            action_item = f"Immediate Knowledge Transfer req. for {owner['name']}"
        elif risk_score > 50:
            risk_label = "WARNING"
            action_item = "Schedule Code Review"
        else:
            risk_label = "STABLE"
            action_item = "None"

        risk_report.append({
            "module": mod["name"],
            "path": mod["path"],
            "complexity": mod["complexity"],
            "owner": owner,
            "ownership_percent": ownership_percent,
            "owner_status": status,
            "leave_start": leave_start,
            "risk_score": risk_score,
            "risk_label": risk_label,
            "action_item": action_item
        })
        
    # Sort by risk (descending)
    risk_report.sort(key=lambda x: x["risk_score"], reverse=True)
    
    return {
        "generated_at": datetime.now().strftime("%H:%M:%S"),
        "total_modules": len(MODULES),
        "system_health": int(100 - (sum(r["risk_score"] for r in risk_report) / len(risk_report))),
        "report": risk_report
    }
