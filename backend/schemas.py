from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TorNodeBase(BaseModel):
    ip_address: str

class TorNodeCreate(TorNodeBase):
    pass

class TorNode(TorNodeBase):
    id: int
    last_updated: datetime

    class Config:
        orm_mode = True

class ForensicLogBase(BaseModel):
    src_ip: str
    dst_ip: str
    timestamp: datetime
    is_tor_traffic: bool = False
    geo_city: Optional[str] = None
    geo_country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ForensicLogCreate(ForensicLogBase):
    pass

class ForensicLog(ForensicLogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
