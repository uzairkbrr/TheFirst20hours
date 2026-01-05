from sqlalchemy.orm import Session
from . import models, schemas
from .core.security import get_password_hash

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_active_skill(db: Session, user_id: int):
    return db.query(models.Skill).filter(
        models.Skill.user_id == user_id, 
        models.Skill.status == "active"
    ).order_by(models.Skill.created_at.desc()).first()

def create_skill(db: Session, skill: schemas.SkillCreate, user_id: int):
    db_skill = models.Skill(**skill.dict(), user_id=user_id)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def create_daily_plan(db: Session, plan_data: dict, skill_id: int):
    db_plan = models.DailyPlan(**plan_data, skill_id=skill_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def create_session(db: Session, session: schemas.SessionCreate, skill_id: int):
    db_session = models.Session(**session.dict(), skill_id=skill_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def create_reflection(db: Session, reflection: schemas.ReflectionCreate):
    db_reflection = models.Reflection(**reflection.dict(), session_id=reflection.session_id)
    db.add(db_reflection)
    db.commit()
    db.refresh(db_reflection)
    return db_reflection

def get_total_duration(db: Session, skill_id: int):
    from sqlalchemy import func
    result = db.query(func.sum(models.Session.duration_minutes)).filter(models.Session.skill_id == skill_id).scalar()
    return result if result else 0

def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id).first()

def check_and_award_badges(db: Session, user_id: int):
    # 1. Calculate Stats
    total_sessions = db.query(models.Session).join(models.Skill).filter(models.Skill.user_id == user_id).count()
    
    total_minutes = 0
    skills = db.query(models.Skill).filter(models.Skill.user_id == user_id).all()
    for s in skills:
        total_minutes += get_total_duration(db, s.id)

    # 2. Define Badges
    badges_def = [
        {"name": "First Step", "description": "Completed your first session", "criteria": "sessions", "threshold": 1, "icon": "footprints"},
        {"name": "High Five", "description": "Completed 5 hours of practice", "criteria": "minutes", "threshold": 300, "icon": "hand"},
        {"name": "Mastery", "description": "Completed 20 hours", "criteria": "minutes", "threshold": 1200, "icon": "trophy"}
    ]

    new_badges = []
    
    for b_def in badges_def:
        passed = False
        if b_def["criteria"] == "sessions" and total_sessions >= b_def["threshold"]:
            passed = True
        elif b_def["criteria"] == "minutes" and total_minutes >= b_def["threshold"]:
            passed = True

        if passed:
            # Ensure Badge exists in DB
            badge_model = db.query(models.Badge).filter(models.Badge.name == b_def["name"]).first()
            if not badge_model:
                 badge_model = models.Badge(
                     name=b_def["name"], 
                     description=b_def["description"], 
                     icon_name=b_def["icon"], 
                     criteria_type=b_def["criteria"], 
                     threshold=b_def["threshold"]
                 )
                 db.add(badge_model)
                 db.commit()
                 db.refresh(badge_model)

            # Check if user has it
            user_badge = db.query(models.UserBadge).filter(models.UserBadge.user_id == user_id, models.UserBadge.badge_id == badge_model.id).first()
            if not user_badge:
                ub = models.UserBadge(user_id=user_id, badge_id=badge_model.id)
                db.add(ub)
                db.commit()
                new_badges.append(b_def["name"])

    return new_badges
