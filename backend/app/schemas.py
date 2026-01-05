from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date

# User Schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Skill Schemas
class SkillBase(BaseModel):
    name: str
    target_definition: str
    daily_minutes: int

class SkillCreate(SkillBase):
    status: Optional[str] = "active"

class Skill(SkillBase):
    id: int
    user_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True

# Daily Plan Schemas
class DailyPlanBase(BaseModel):
    day_number: int
    focus_topic: str
    action_task: str
    suggested_duration_minutes: int
    scheduled_date: Optional[date] = None
    resources: Optional[List[dict]] = [] # {title, url, type}

class DailyPlanCreate(DailyPlanBase):
    pass

class DailyPlan(DailyPlanBase):
    id: int
    skill_id: int

    class Config:
        from_attributes = True

# Badge Schemas
class BadgeBase(BaseModel):
    name: str
    description: str
    icon_name: str
    
class Badge(BadgeBase):
    id: int
    
    class Config:
        from_attributes = True

class UserBadge(BaseModel):
    id: int
    badge_id: int
    earned_at: datetime
    badge: Badge
    
    class Config:
        from_attributes = True

# Session Schemas
class SessionBase(BaseModel):
    duration_minutes: int

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    skill_id: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# Reflection Schemas
class ReflectionBase(BaseModel):
    content: str
    difficulty: str
    key_takeaway: str

class ReflectionCreate(ReflectionBase):
    session_id: int

class Reflection(ReflectionBase):
    id: int
    
    class Config:
        from_attributes = True
