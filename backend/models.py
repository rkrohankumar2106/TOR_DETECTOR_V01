from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, func
try:
    from .database import Base
except ImportError:
    from database import Base

class TorNode(Base):
    __tablename__ = "tor_nodes"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True, index=True)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())

class ForensicLog(Base):
    __tablename__ = "forensic_logs"

    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String, index=True)
    dst_ip = Column(String, index=True)
    timestamp = Column(DateTime)
    is_tor_traffic = Column(Boolean, default=False)
    
    # GeoIP data
    geo_city = Column(String, nullable=True)
    geo_country = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=func.now())
