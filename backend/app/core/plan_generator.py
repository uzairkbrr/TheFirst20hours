import math

def generate_20_hour_plan(skill_name: str, daily_minutes: int):
    total_minutes = 20 * 60
    total_days = math.ceil(total_minutes / daily_minutes)
    
    plans = []
    
    # Simple rule-based logic
    # Phase 1: Deconstruction & Basics (First 20% of time)
    # Phase 2: Learning Enough to Correct Yourself (Next 30%)
    # Phase 3: Removing Practice Barriers & Practice (Rest 50%)
    
    current_day = 1
    accumulated_minutes = 0
    
    while accumulated_minutes < total_minutes:
        duration = daily_minutes
        if accumulated_minutes + duration > total_minutes:
            duration = total_minutes - accumulated_minutes
            
        progress_pct = accumulated_minutes / total_minutes
        
        focus_topic = ""
        action_task = ""
        
        if progress_pct < 0.2:
            focus_topic = "Deconstruction & Basics"
            action_task = f"Identify core components of {skill_name}. Research top resources. Deconstruct complex parts into smaller tasks."
        elif progress_pct < 0.5:
            focus_topic = "Learning to Self-Correct"
            action_task = "Practice core mechanisms. Focus on 'getting it right'. Identify mistakes immediately and correct them."
        else:
            focus_topic = "Focused Practice"
            action_task = f"Deep work session on {skill_name}. Remove all distractions. Push past the frustration barrier."
            
        plans.append({
            "day_number": current_day,
            "focus_topic": focus_topic,
            "action_task": action_task,
            "suggested_duration_minutes": duration
        })
        
        accumulated_minutes += duration
        current_day += 1
        
    return plans
