from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from ..routers.auth import get_current_user
from ..core.plan_generator import generate_20_hour_plan
from typing import List

router = APIRouter()

@router.post("/skills", response_model=schemas.Skill)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Create skill (Allow multiple active skills - Dashboard will show latest)
    db_skill = crud.create_skill(db=db, skill=skill, user_id=current_user.id)
    
    # Generate plan ONLY if status is active
    if skill.status == "active":
        plans = generate_20_hour_plan(skill.name, skill.daily_minutes)
        
        from datetime import date, timedelta
        today = date.today()
        
        for plan in plans:
            # Calculate scheduled date
            # Day 1 = Today, Day 2 = Today + 1
            scheduled = today + timedelta(days=plan['day_number'] - 1)
            plan['scheduled_date'] = scheduled
            crud.create_daily_plan(db, plan, db_skill.id)
        
    return db_skill

@router.get("/skills")
def get_user_skills(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    all_skills = db.query(models.Skill).filter(models.Skill.user_id == current_user.id).all()
    
    # Enrich skills with progress data manually for now
    data = {"active": [], "completed": [], "future": []}
    
    for skill in all_skills:
        skill_data = schemas.Skill.model_validate(skill)
        # Calculate progress for active/completed skills
        total_minutes = crud.get_total_duration(db, skill.id)
        # Add a dynamic field 'progress_percent' to the response? 
        # Easier to just return the list and let frontend calculate or fetch details.
        # But frontend needs progress bar immediately.
        # Let's create a custom response structure or just return raw skills ?
        # Actually returning simple lists is fine, but we want progress bars.
        # Let's return a detailed dict.
        
        enriched_skill = skill_data.model_dump()
        enriched_skill['total_minutes'] = total_minutes
        enriched_skill['hours_done'] = round(total_minutes / 60, 2)
        enriched_skill['percentage'] = min(round((total_minutes / (20 * 60)) * 100, 1), 100)

        if skill.status == "active":
            data["active"].append(enriched_skill)
        elif skill.status == "completed":
            data["completed"].append(enriched_skill)
        elif skill.status == "future":
            data["future"].append(enriched_skill)
            
    return data

@router.post("/skills/{skill_id}/start")
def start_future_skill(skill_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    skill = crud.get_skill(db, skill_id)
    if not skill or skill.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    if skill.status == "active":
        return skill

    # Update status
    skill.status = "active"
    
    # Generate plan NOW
    plans = generate_20_hour_plan(skill.name, skill.daily_minutes)
    from datetime import date, timedelta
    today = date.today()
    
    for plan in plans:
        scheduled = today + timedelta(days=plan['day_number'] - 1)
        plan['scheduled_date'] = scheduled
        crud.create_daily_plan(db, plan, skill.id)
    
    db.commit()
    db.refresh(skill)
    return skill

@router.post("/skills/{skill_id}/shift")
def shift_schedule(skill_id: int, days: int = 1, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    skill = crud.get_skill(db, skill_id)
    if not skill or skill.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    # Get all future plans starting from today (or just all incomplete ones?)
    # Logic: Shift EVERYTHING that is scheduled for today or later?
    # Or shift ALL plans?
    # Usually 'Life Happened' means 'I missed yesterday', so yesterday's task needs to be moved to Today.
    # And Today's task moved to Tomorrow.
    # So we shift all plans where scheduled_date >= Yesterday? Or just all remaining plans.
    # Simplest: Shift all plans that haven't been completed? We don't track plan completion explicitly, just day number.
    # Let's shift all plans where day_number >= current_progress_day.
    
    total_minutes = crud.get_total_duration(db, skill_id)
    current_day_num = int(total_minutes // skill.daily_minutes) + 1
    
    plans = db.query(models.DailyPlan).filter(
        models.DailyPlan.skill_id == skill_id,
        models.DailyPlan.day_number >= current_day_num
    ).all()
    
    from datetime import timedelta
    for plan in plans:
        if plan.scheduled_date:
            plan.scheduled_date += timedelta(days=days)
            
    db.commit()
    return {"message": f"Schedule shifted by {days} days"}

@router.post("/plans/{plan_id}/resources")
def add_resource(plan_id: int, resource: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Resource: {title, url, type}
    plan = db.query(models.DailyPlan).join(models.Skill).filter(
        models.DailyPlan.id == plan_id,
        models.Skill.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    current_resources = list(plan.resources) if plan.resources else []
    current_resources.append(resource)
    plan.resources = current_resources # Reassign to trigger update
    
    # SQLAlchemy requires explicit flag marked modified for JSON mutable if not using MutableDict?
    # Or just reassignment works.
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(plan, "resources")
    
    db.commit()
    return plan.resources

@router.get("/skills/active")
def get_active_skill(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    active_skill = crud.get_active_skill(db, user_id=current_user.id)
    if not active_skill:
        # Return empty or specific status to indicate NO active skill
        return None
    
    # Calculate progress
    total_duration = crud.get_total_duration(db, active_skill.id)
    
    # Augment skill object with progress (a bit hacky, normally would use a Pydantic schema with extra fields)
    # But Pydantic's ORM mode might strip extra attributes unless defined in schema
    # Let's augment the return dictionary or use a specific schema?
    # For MVP simplicity, let's just return the skill and let the frontend query dashboard for stats or Add stats to Skill Schema.
    # Actually, let's return a detailed response
    
    return active_skill

@router.get("/dashboard")
def get_dashboard_data(skill_id: Optional[int] = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    target_skill = None
    
    if skill_id:
        target_skill = crud.get_skill(db, skill_id)
        if not target_skill or target_skill.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Skill not found")
    else:
        target_skill = crud.get_active_skill(db, user_id=current_user.id)
        
    if not target_skill:
        return {"has_active_skill": False}
        
    total_minutes = crud.get_total_duration(db, target_skill.id)
    hours_done = total_minutes / 60
    
    # Calculate current day (1-based)
    current_day_num = int(total_minutes // target_skill.daily_minutes) + 1
    
    # Fetch plan
    current_plan = db.query(models.DailyPlan).filter(
        models.DailyPlan.skill_id == target_skill.id,
        models.DailyPlan.day_number == current_day_num
    ).first()
    
    return {
        "has_active_skill": True,
        "skill": schemas.Skill.model_validate(target_skill),
        "current_plan": schemas.DailyPlan.model_validate(current_plan) if current_plan else None,
        "progress": {
            "total_minutes": total_minutes,
            "hours_done": round(hours_done, 2),
            "percentage": min(round((total_minutes / (20 * 60)) * 100, 1), 100),
            "current_day": current_day_num
        },
        "badges": [schemas.UserBadge.model_validate(b) for b in current_user.badges]
    }

@router.get("/skills/{skill_id}/calendar")
def get_skill_calendar(skill_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    skill = crud.get_skill(db, skill_id)
    if not skill or skill.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Skill not found")

    plans = db.query(models.DailyPlan).filter(models.DailyPlan.skill_id == skill_id).all()
    
    # Generate simple ICS content
    ics_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//First20Hours//App//EN",
        "CALSCALE:GREGORIAN"
    ]
    
    for plan in plans:
        if plan.scheduled_date:
            date_str = plan.scheduled_date.strftime("%Y%m%d")
            ics_lines.extend([
                "BEGIN:VEVENT",
                f"UID:20hours-plan-{plan.id}-{date_str}",
                f"DTSTART;VALUE=DATE:{date_str}",
                f"SUMMARY:{skill.name} - Day {plan.day_number}",
                f"DESCRIPTION:{plan.action_task or 'Practice Session'}",
                "END:VEVENT"
            ])
            
    ics_lines.append("END:VCALENDAR")
    
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse("\n".join(ics_lines), media_type="text/calendar", headers={
        "Content-Disposition": f'attachment; filename="{skill.name.lower().replace(" ", "_")}_schedule.ics"'
    })
