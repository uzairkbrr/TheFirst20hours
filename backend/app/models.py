from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    streak_freezes_available = Column(Integer, default=3) # Gamification

    skills = relationship("Skill", back_populates="owner")
    badges = relationship("UserBadge", back_populates="user")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    target_definition = Column(String)
    daily_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="active") # active, completed

    owner = relationship("User", back_populates="skills")
    daily_plans = relationship("DailyPlan", back_populates="skill", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="skill", cascade="all, delete-orphan")
    freezes = relationship("SkillFreeze", back_populates="skill", cascade="all, delete-orphan")


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    day_number = Column(Integer)
    focus_topic = Column(String)
    action_task = Column(Text)
    suggested_duration_minutes = Column(Integer)
    scheduled_date = Column(DateTime, nullable=True) # For dynamic scheduling
    resources = Column(JSON, default=list) # [{title, url, type}]
    
    skill = relationship("Skill", back_populates="daily_plans")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    date = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    skill = relationship("Skill", back_populates="sessions")
    reflections = relationship("Reflection", back_populates="session", cascade="all, delete-orphan")


class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    content = Column(Text)
    difficulty = Column(String) # e.g., Easy, Medium, Hard
    key_takeaway = Column(String)
    
    session = relationship("Session", back_populates="reflections")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    icon_name = Column(String) # For frontend mapping
    criteria_type = Column(String) # e.g., 'session_count', 'streak_days'
    threshold = Column(Integer)
    
    user_badges = relationship("UserBadge", back_populates="badge")


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")


class SkillFreeze(Base):
    __tablename__ = "skill_freezes"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    date = Column(DateTime, default=datetime.utcnow) # The date frozen
    
    skill = relationship("Skill", back_populates="freezes")
